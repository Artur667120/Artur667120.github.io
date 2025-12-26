// firebase-config.js

// Імпорт Firebase SDK (версія 11.0.2)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Конфігурація Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDdqDJC6iI2pXLtxm61220CIPgG4YdTrYk",
    authDomain: "inboxprodemo.firebaseapp.com",
    projectId: "inboxprodemo",
    storageBucket: "inboxprodemo.firebasestorage.app",
    messagingSenderId: "674512041878",
    appId: "1:674512041878:web:d6c4f43b74c3fb5d6c4fb7",
    measurementId: "G-DN859E1Y0L"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Експорт сервісів
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
