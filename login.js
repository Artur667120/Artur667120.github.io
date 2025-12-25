import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Вхід по email та паролю
window.login = function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Вітаю! Вхід успішний!");
            window.location.href = "index.html";
        })
        .catch(error => {
            alert("Помилка: " + error.message);
        });
};

// Вхід через Google
window.loginWithGoogle = function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch(error => {
            alert("Помилка Google входу: " + error.message);
        });
};
