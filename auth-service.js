// auth-service.js

import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Клас для управління автентифікацією
class AuthService {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
    }

    // Слухач зміни стану автентифікації
    initAuthStateListener() {
        onAuthStateChanged(auth, async (user) => {
            console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
            
            if (user) {
                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL
                };
                
                console.log('✅ Користувач авторизований:', this.currentUser.email);
                
                // Оновлення останнього входу
                try {
                    await this.updateLastLogin(user.uid);
                } catch (error) {
                    console.log('Попередження: не вдалося оновити останній вхід:', error.message);
                }
                
                // Завантаження додаткових даних
                try {
                    await this.loadUserProfile(user.uid);
                } catch (error) {
                    console.log('Попередження: не вдалося завантажити профіль:', error.message);
                }
                
            } else {
                this.currentUser = null;
                console.log('🔒 Користувач не авторизований');
            }
            
            // Сповіщення слухачів
            this.notifyAuthStateChange();
        });
    }

    // Реєстрація нового користувача
    async register(email, password, name) {
        try {
            console.log('Спроба реєстрації:', email);
            
            // Створення користувача
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Користувач створений:', user.uid);
            
            // Оновлення профілю
            if (name) {
                await updateProfile(user, { displayName: name });
            }
            
            // Збереження додаткових даних у Firestore
            try {
                await setDoc(doc(db, "users", user.uid), {
                    email: email.toLowerCase(),
                    name: name || email.split('@')[0],
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    emailVerified: false,
                    storageUsed: 0,
                    plan: 'free',
                    settings: {
                        theme: 'dark',
                        language: 'ua',
                        notifications: true,
                        autoSave: true
                    },
                    profile: {
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=667eea&color=fff`,
                        bio: '',
                        location: '',
                        website: ''
                    }
                });
                console.log('Дані користувача збережено в Firestore');
            } catch (firestoreError) {
                console.warn('Не вдалося зберегти дані в Firestore:', firestoreError);
                // Продовжуємо, навіть якщо Firestore не вдалося
            }
            
            return { success: true, user };
        } catch (error) {
            console.error('Помилка реєстрації:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Вхід
    async login(email, password) {
        try {
            console.log('Спроба входу:', email);
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Вхід успішний:', user.uid);
            
            // Оновлення останнього входу
            try {
                await this.updateLastLogin(user.uid);
            } catch (updateError) {
                console.warn('Не вдалося оновити останній вхід:', updateError);
            }
            
            return { success: true, user };
        } catch (error) {
            console.error('Помилка входу:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Вихід
    async logout() {
        try {
            await signOut(auth);
            this.currentUser = null;
            console.log('Вихід успішний');
            return { success: true };
        } catch (error) {
            console.error('Помилка виходу:', error);
            return { success: false, error: error.message };
        }
    }

    // Відновлення пароля
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Лист для відновлення пароля надіслано:', email);
            return { success: true };
        } catch (error) {
            console.error('Помилка відновлення пароля:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Оновлення останнього входу
    async updateLastLogin(uid) {
        try {
            if (!uid) return;
            
            await updateDoc(doc(db, "users", uid), {
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Помилка оновлення останнього входу:', error);
            // Не викидаємо помилку, щоб не переривати потік
        }
    }

    // Завантаження профілю користувача
    async loadUserProfile(uid) {
        try {
            if (!uid) return null;
            
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                this.currentUser = { ...this.currentUser, ...userData };
                return userData;
            }
            return null;
        } catch (error) {
            console.error('Помилка завантаження профілю:', error);
            return null;
        }
    }

    // Отримання повідомлення про помилку
    getErrorMessage(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'Ця електронна пошта вже використовується',
            'auth/invalid-email': 'Невірний формат електронної пошти',
            'auth/user-not-found': 'Користувача з такою поштою не знайдено',
            'auth/wrong-password': 'Невірний пароль',
            'auth/weak-password': 'Пароль занадто слабкий. Мінімум 6 символів',
            'auth/user-disabled': 'Акаунт заблоковано',
            'auth/too-many-requests': 'Забагато спроб. Спробуйте пізніше',
            'auth/network-request-failed': 'Помилка мережі. Перевірте підключення до інтернету'
        };
        
        return errorMessages[error.code] || error.message || 'Сталася невідома помилка';
    }

    // Додавання слухача зміни стану
    addAuthStateListener(callback) {
        this.authStateListeners.push(callback);
        // Викликати негайно, якщо користувач вже авторизований
        if (this.currentUser) {
            callback(this.currentUser);
        }
    }

    // Сповіщення слухачів
    notifyAuthStateChange() {
        this.authStateListeners.forEach(callback => {
            try {
                callback(this.currentUser);
            } catch (error) {
                console.error('Помилка в слухачі стану автентифікації:', error);
            }
        });
    }

    // Перевірка, чи авторизований користувач
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Отримання поточного користувача
    getCurrentUser() {
        return this.currentUser;
    }
}

// Експорт єдиного екземпляра
export const authService = new AuthService();
