// ====================== GLOBAL VARIABLES ======================
let emails = JSON.parse(localStorage.getItem('emails')) || [];
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUserEmail = localStorage.getItem('currentUser') || null;
let currentFolder = 'inbox';
let currentSelectedEmail = null;
let emailIdCounter = parseInt(localStorage.getItem('emailIdCounter')) || 1;

// ====================== TRANSLATION ======================
const translations = {
    ua:{ inbox:'Вхідні', sent:'Н
