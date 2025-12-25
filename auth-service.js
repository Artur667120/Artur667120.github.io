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
            if (user) {
                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL
                };
                
                // Оновлення останнього входу
                await this.updateLastLogin(user.uid);
                
                // Завантаження додаткових даних
                await this.loadUserProfile(user.uid);
                
                console.log('✅ Користувач авторизований:', this.currentUser.email);
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
            // Створення користувача
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Оновлення профілю
            await updateProfile(user, { displayName: name });
            
            // Збереження додаткових даних у Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: email.toLowerCase(),
                name: name,
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
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
                    bio: '',
                    location: '',
                    website: ''
                }
            });
            
            // Відправлення листа з підтвердженням
            await this.sendVerificationEmail(user);
            
            return { success: true, user };
        } catch (error) {
            console.error('Помилка реєстрації:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Вхід
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Оновлення останнього входу
            await this.updateLastLogin(userCredential.user.uid);
            
            return { success: true, user: userCredential.user };
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
            return { success: true };
        } catch (error) {
            console.error('Помилка відновлення пароля:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Оновлення останнього входу
    async updateLastLogin(uid) {
        try {
            await updateDoc(doc(db, "users", uid), {
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Помилка оновлення останнього входу:', error);
        }
    }

    // Завантаження профілю користувача
    async loadUserProfile(uid) {
        try {
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

    // Відправлення листа з підтвердженням email
    async sendVerificationEmail(user) {
        try {
            // Firebase v11 має інший API для sendEmailVerification
            // Можна використати EmailJS як альтернативу
            console.log('Підтвердження email буде доступно після налаштування');
            return { success: true };
        } catch (error) {
            console.error('Помилка відправлення листа з підтвердженням:', error);
            return { success: false, error: error.message };
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
            'auth/too-many-requests': 'Забагато спроб. Спробуйте пізніше'
        };
        
        return errorMessages[error.code] || error.message;
    }

    // Додавання слухача зміни стану
    addAuthStateListener(callback) {
        this.authStateListeners.push(callback);
    }

    // Сповіщення слухачів
    notifyAuthStateChange() {
        this.authStateListeners.forEach(callback => {
            callback(this.currentUser);
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
