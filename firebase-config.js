// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdqDJC6iI2pXLtxm61220CIPgG4YdTrYk",
    authDomain: "inboxprodemo.firebaseapp.com",
    projectId: "inboxprodemo",
    storageBucket: "inboxprodemo.appspot.com",
    messagingSenderId: "1064944508829",
    appId: "1:1064944508829:web:cb456d0301de25bdee4a81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
