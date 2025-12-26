// Authentication Service
import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    doc, 
    setDoc,
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class AuthService {
    constructor() {
        this.auth = auth;
        this.db = db;
        this.currentUser = null;
        this.onAuthStateChangeCallback = null;
        
        // Listen for auth state changes
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
            
            // Call auth state change callback if set
            if (this.onAuthStateChangeCallback) {
                this.onAuthStateChangeCallback(user);
            }
        });
    }
    
    // Set callback for auth state changes
    onAuthStateChanged(callback) {
        this.onAuthStateChangeCallback = callback;
        // Immediately call with current user if exists
        if (this.currentUser) {
            callback(this.currentUser);
        }
    }
    
    // Register new user
    async register(email, password, name) {
        console.log('Спроба реєстрації:', email);
        
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Update profile with name
            if (name) {
                await updateProfile(user, {
                    displayName: name
                });
            }
            
            // Create user document in Firestore
            await this.createUserDocument(user.uid, email, name);
            
            console.log('✅ Реєстрація успішна:', user.uid);
            return user;
            
        } catch (error) {
            console.error('❌ Помилка реєстрації:', error);
            throw error;
        }
    }
    
    // Create user document in Firestore
    async createUserDocument(uid, email, name) {
        try {
            const userDoc = doc(this.db, 'users', uid);
            await setDoc(userDoc, {
                uid: uid,
                email: email,
                displayName: name || '',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                settings: {
                    theme: 'dark',
                    notifications: true
                }
            });
            
            console.log('📄 Документ користувача створено:', uid);
            
        } catch (error) {
            console.error('❌ Помилка створення документу:', error);
            // Don't throw - user is already created in Auth
        }
    }
    
    // Login user
    async login(email, password) {
        console.log('Спроба входу:', email);
        
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Update last login time
            await this.updateUserLastLogin(user.uid);
            
            console.log('✅ Вхід успішний:', user.uid);
            return user;
            
        } catch (error) {
            console.error('❌ Помилка входу:', error);
            throw error;
        }
    }
    
    // Update user's last login time
    async updateUserLastLogin(uid) {
        try {
            const userDoc = doc(this.db, 'users', uid);
            const docRef = await getDoc(userDoc);
            
            if (docRef.exists()) {
                await setDoc(userDoc, {
                    lastLogin: new Date().toISOString()
                }, { merge: true });
            }
        } catch (error) {
            console.error('Помилка оновлення часу входу:', error);
        }
    }
    
    // Logout user
    async logout() {
        try {
            await signOut(this.auth);
            console.log('✅ Вихід успішний');
        } catch (error) {
            console.error('❌ Помилка виходу:', error);
            throw error;
        }
    }
    
    // Reset password
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(this.auth, email);
            console.log('✅ Лист для скидання пароля відправлено');
        } catch (error) {
            console.error('❌ Помилка скидання пароля:', error);
            throw error;
        }
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Create and export instance
const authServiceInstance = new AuthService();
export default authServiceInstance;
