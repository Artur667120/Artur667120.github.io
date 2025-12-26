// Simplified Authentication Service
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
        this.authStateListeners = [];
        
        // Listen for auth state changes
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
            
            // Notify all listeners
            this.authStateListeners.forEach(callback => callback(user));
        });
    }
    
    // Register callback for auth state changes
    onAuthStateChanged(callback) {
        this.authStateListeners.push(callback);
        // Immediately call with current user if exists
        if (this.currentUser) {
            callback(this.currentUser);
        }
    }
    
    // Remove callback
    removeAuthStateListener(callback) {
        const index = this.authStateListeners.indexOf(callback);
        if (index > -1) {
            this.authStateListeners.splice(index, 1);
        }
    }
    
    // Register new user
    async register(email, password, name) {
        console.log('Register attempt:', email);
        
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
            
            console.log('✅ Registration successful:', user.uid);
            return user;
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            throw this.getAuthErrorMessage(error);
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
            
            console.log('📄 User document created:', uid);
            
        } catch (error) {
            console.error('❌ Document creation error:', error);
            // Don't throw - user is already created in Auth
        }
    }
    
    // Login user
    async login(email, password) {
        console.log('Login attempt:', email);
        
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Update last login time
            await this.updateUserLastLogin(user.uid);
            
            console.log('✅ Login successful:', user.uid);
            return user;
            
        } catch (error) {
            console.error('❌ Login error:', error);
            throw this.getAuthErrorMessage(error);
        }
    }
    
    // Update user's last login time
    async updateUserLastLogin(uid) {
        try {
            const userDoc = doc(this.db, 'users', uid);
            await setDoc(userDoc, {
                lastLogin: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Last login update error:', error);
        }
    }
    
    // Logout user
    async logout() {
        try {
            await signOut(this.auth);
            console.log('✅ Logout successful');
            return true;
        } catch (error) {
            console.error('❌ Logout error:', error);
            throw error;
        }
    }
    
    // Reset password
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(this.auth, email);
            console.log('✅ Password reset email sent');
            return true;
        } catch (error) {
            console.error('❌ Password reset error:', error);
            throw this.getAuthErrorMessage(error);
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
    
    // Get auth error message
    getAuthErrorMessage(error) {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Invalid email format';
            case 'auth/user-disabled':
                return 'Account disabled';
            case 'auth/user-not-found':
                return 'User not found';
            case 'auth/wrong-password':
                return 'Wrong password';
            case 'auth/email-already-in-use':
                return 'Email already in use';
            case 'auth/weak-password':
                return 'Password too weak (min 6 chars)';
            case 'auth/operation-not-allowed':
                return 'Operation not allowed';
            case 'auth/too-many-requests':
                return 'Too many attempts. Try again later';
            default:
                return 'Authentication error: ' + error.message;
        }
    }
}

// Create and export instance
const authService = new AuthService();
export default authService;
