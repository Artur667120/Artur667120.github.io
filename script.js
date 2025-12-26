// Inbox Pro - Main JavaScript
import authServiceInstance from './auth-service.js'; // Змінив тут!

// ==================== CONFIGURATION ====================
const CONFIG = {
    languages: {
        en: {
            appName: "Inbox Pro",
            loading: "Loading Inbox Pro...",
            welcomeBack: "Welcome Back",
            createAccount: "Create Account",
            resetPassword: "Reset Password",
            emailAddress: "Email Address",
            password: "Password",
            fullName: "Full Name",
            confirmPassword: "Confirm Password",
            rememberMe: "Remember me",
            forgotPassword: "Forgot password?",
            signIn: "Sign In",
            newUser: "New user?",
            haveAccount: "Already have an account?",
            rememberPassword: "Remember password?",
            sendResetLink: "Send Reset Link",
            createAccountBtn: "Create Account",
            passwordHint: "Min. 8 characters with letters & numbers",
            aiActive: "AI Active",
            aiOrganizing: "AI is organizing your inbox. {count} emails sorted.",
            compose: "Compose",
            inbox: "Inbox",
            starred: "Starred",
            sent: "Sent",
            drafts: "Drafts",
            spam: "Spam",
            trash: "Trash",
            searchPlaceholder: "Search emails, contacts...",
            themeLight: "Light",
            themeDark: "Dark",
            themeOled: "OLED",
            newMessage: "New Message",
            to: "To",
            subject: "Subject",
            writeMessage: "Write your message here...",
            send: "Send",
            saveDraft: "Save Draft",
            important: "Important",
            settings: "Settings",
            profile: "Profile",
            appearance: "Appearance",
            notifications: "Notifications",
            language: "Language",
            enableNotifications: "Enable notifications",
            interfaceLanguage: "Interface Language",
            saveChanges: "Save Changes",
            all: "All",
            unread: "Unread",
            withFiles: "With Files",
            newestFirst: "Newest first",
            oldestFirst: "Oldest first",
            importantFirst: "Important first",
            unreadFirst: "Unread first",
            selectAll: "Select All",
            markRead: "Mark as Read",
            archive: "Archive",
            delete: "Delete",
            reply: "Reply",
            forward: "Forward",
            star: "Star",
            back: "Back"
        },
        ua: {
            appName: "Inbox Pro",
            loading: "Завантаження Inbox Pro...",
            welcomeBack: "З поверненням",
            createAccount: "Створити акаунт",
            resetPassword: "Скинути пароль",
            emailAddress: "Електронна адреса",
            password: "Пароль",
            fullName: "Повне ім'я",
            confirmPassword: "Підтвердіть пароль",
            rememberMe: "Запам'ятати мене",
            forgotPassword: "Забули пароль?",
            signIn: "Увійти",
            newUser: "Новий користувач?",
            haveAccount: "Вже маєте акаунт?",
            rememberPassword: "Пам'ятаєте пароль?",
            sendResetLink: "Надіслати посилання",
            createAccountBtn: "Створити акаунт",
            passwordHint: "Мін. 8 символів з буквами та цифрами",
            aiActive: "AI Активний",
            aiOrganizing: "AI організовує вашу пошту. Відсортовано {count} листів.",
            compose: "Написати",
            inbox: "Вхідні",
            starred: "Зірочка",
            sent: "Надіслані",
            drafts: "Чернетки",
            spam: "Спам",
            trash: "Кошик",
            searchPlaceholder: "Пошук листів, контактів...",
            themeLight: "Світла",
            themeDark: "Темна",
            themeOled: "OLED",
            newMessage: "Нове повідомлення",
            to: "Кому",
            subject: "Тема",
            writeMessage: "Напишіть ваше повідомлення тут...",
            send: "Надіслати",
            saveDraft: "Зберегти чернетку",
            important: "Важливо",
            settings: "Налаштування",
            profile: "Профіль",
            appearance: "Зовнішній вигляд",
            notifications: "Сповіщення",
            language: "Мова",
            enableNotifications: "Увімкнути сповіщення",
            interfaceLanguage: "Мова інтерфейсу",
            saveChanges: "Зберегти зміни",
            all: "Всі",
            unread: "Непрочитані",
            withFiles: "З файлами",
            newestFirst: "Спочатку нові",
            oldestFirst: "Спочатку старі",
            importantFirst: "Спочатку важливі",
            unreadFirst: "Спочатку непрочитані",
            selectAll: "Вибрати все",
            markRead: "Позначити прочитаним",
            archive: "Архівувати",
            delete: "Видалити",
            reply: "Відповісти",
            forward: "Переслати",
            star: "Зірочка",
            back: "Назад"
        },
        de: {
            appName: "Inbox Pro",
            loading: "Lade Inbox Pro...",
            welcomeBack: "Willkommen zurück",
            createAccount: "Konto erstellen",
            resetPassword: "Passwort zurücksetzen",
            emailAddress: "E-Mail-Adresse",
            password: "Passwort",
            fullName: "Vollständiger Name",
            confirmPassword: "Passwort bestätigen",
            rememberMe: "Angemeldet bleiben",
            forgotPassword: "Passwort vergessen?",
            signIn: "Anmelden",
            newUser: "Neuer Benutzer?",
            haveAccount: "Bereits ein Konto?",
            rememberPassword: "Passwort erinnern?",
            sendResetLink: "Link senden",
            createAccountBtn: "Konto erstellen",
            passwordHint: "Mind. 8 Zeichen mit Buchstaben & Zahlen",
            aiActive: "AI Aktiv",
            aiOrganizing: "AI organisiert Ihren Posteingang. {count} E-Mails sortiert.",
            compose: "Verfassen",
            inbox: "Posteingang",
            starred: "Favoriten",
            sent: "Gesendet",
            drafts: "Entwürfe",
            spam: "Spam",
            trash: "Papierkorb",
            searchPlaceholder: "E-Mails, Kontakte suchen...",
            themeLight: "Hell",
            themeDark: "Dunkel",
            themeOled: "OLED",
            newMessage: "Neue Nachricht",
            to: "An",
            subject: "Betreff",
            writeMessage: "Schreiben Sie hier Ihre Nachricht...",
            send: "Senden",
            saveDraft: "Entwurf speichern",
            important: "Wichtig",
            settings: "Einstellungen",
            profile: "Profil",
            appearance: "Erscheinungsbild",
            notifications: "Benachrichtigungen",
            language: "Sprache",
            enableNotifications: "Benachrichtigungen aktivieren",
            interfaceLanguage: "Oberflächensprache",
            saveChanges: "Änderungen speichern",
            all: "Alle",
            unread: "Ungelesen",
            withFiles: "Mit Dateien",
            newestFirst: "Neueste zuerst",
            oldestFirst: "Älteste zuerst",
            importantFirst: "Wichtige zuerst",
            unreadFirst: "Ungelesene zuerst",
            selectAll: "Alle auswählen",
            markRead: "Als gelesen markieren",
            archive: "Archivieren",
            delete: "Löschen",
            reply: "Antworten",
            forward: "Weiterleiten",
            star: "Favorit",
            back: "Zurück"
        },
        ru: {
            appName: "Inbox Pro",
            loading: "Загрузка Inbox Pro...",
            welcomeBack: "С возвращением",
            createAccount: "Создать аккаунт",
            resetPassword: "Сбросить пароль",
            emailAddress: "Адрес электронной почты",
            password: "Пароль",
            fullName: "Полное имя",
            confirmPassword: "Подтвердите пароль",
            rememberMe: "Запомнить меня",
            forgotPassword: "Забыли пароль?",
            signIn: "Войти",
            newUser: "Новый пользователь?",
            haveAccount: "Уже есть аккаунт?",
            rememberPassword: "Помните пароль?",
            sendResetLink: "Отправить ссылку",
            createAccountBtn: "Создать аккаунт",
            passwordHint: "Мин. 8 символов с буквами и цифрами",
            aiActive: "AI Активен",
            aiOrganizing: "AI организует вашу почту. Отсортировано {count} писем.",
            compose: "Написать",
            inbox: "Входящие",
            starred: "Избранное",
            sent: "Отправленные",
            drafts: "Черновики",
            spam: "Спам",
            trash: "Корзина",
            searchPlaceholder: "Поиск писем, контактов...",
            themeLight: "Светлая",
            themeDark: "Темная",
            themeOled: "OLED",
            newMessage: "Новое сообщение",
            to: "Кому",
            subject: "Тема",
            writeMessage: "Напишите ваше сообщение здесь...",
            send: "Отправить",
            saveDraft: "Сохранить черновик",
            important: "Важно",
            settings: "Настройки",
            profile: "Профиль",
            appearance: "Внешний вид",
            notifications: "Уведомления",
            language: "Язык",
            enableNotifications: "Включить уведомления",
            interfaceLanguage: "Язык интерфейса",
            saveChanges: "Сохранить изменения",
            all: "Все",
            unread: "Непрочитанные",
            withFiles: "С файлами",
            newestFirst: "Сначала новые",
            oldestFirst: "Сначала старые",
            importantFirst: "Сначала важные",
            unreadFirst: "Сначала непрочитанные",
            selectAll: "Выбрать все",
            markRead: "Отметить прочитанным",
            archive: "В архив",
            delete: "Удалить",
            reply: "Ответить",
            forward: "Переслать",
            star: "Избранное",
            back: "Назад"
        }
    }
};

let currentLanguage = 'en';
let currentUser = null;
let currentScreen = 'login';

// ==================== INITIALIZATION ====================

async function initializeApp() {
    console.log('🚀 Ініціалізація Inbox Pro...');
    
    try {
        // Load saved language
        const savedLang = localStorage.getItem('inboxpro-language') || 'en';
        setLanguage(savedLang);
        
        // Load saved theme
        const savedTheme = localStorage.getItem('inboxpro-theme') || 'dark';
        setTheme(savedTheme);
        
        // Setup event listeners
        setupEventListeners();
        
        // Check authentication
        authServiceInstance.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                console.log('✅ Користувач авторизований:', user.email);
                await showMainApp(user);
            } else {
                console.log('👤 Користувач не авторизований');
                showLoginScreen();
            }
        });
        
        // Hide loading screen with timeout
        setTimeout(() => {
            hideLoadingScreen();
        }, 1500);
        
        console.log('✅ Inbox Pro ініціалізовано');
    } catch (error) {
        console.error('❌ Помилка ініціалізації:', error);
        showToast('Помилка ініціалізації додатку', 'error');
        hideLoadingScreen();
    }
}

function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('initialLoading');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
}

// ==================== LANGUAGE SYSTEM ====================

function setLanguage(lang) {
    if (!CONFIG.languages[lang]) lang = 'en';
    
    currentLanguage = lang;
    localStorage.setItem('inboxpro-language', lang);
    
    // Update language selectors
    const langSelects = document.querySelectorAll('#languageSelect, #appLanguageSelect, #settingsLanguage');
    langSelects.forEach(select => {
        if (select) select.value = lang;
    });
    
    // Update all text elements
    updateTextElements();
}

function updateTextElements() {
    const lang = CONFIG.languages[currentLanguage];
    
    // Update loading text
    const loadingText = document.getElementById('loadingText');
    if (loadingText && lang.loading) {
        loadingText.textContent = lang.loading;
    }
    
    // Update login form
    const loginTitle = document.querySelector('#loginForm h2');
    if (loginTitle && lang.welcomeBack) {
        loginTitle.innerHTML = `🔑 ${lang.welcomeBack}`;
    }
    
    // Update other elements
    const elements = {
        '#rememberMeText': lang.rememberMe,
        '#newUserText': lang.newUser,
        '#haveAccountText': lang.haveAccount,
        '#rememberPasswordText': lang.rememberPassword,
        '#loginBtn .btn-text': lang.signIn,
        '#registerBtn .btn-text': lang.createAccountBtn,
        '#sendResetBtn .btn-text': lang.sendResetLink,
        '.password-hint': lang.passwordHint,
        '.ai-text': lang.aiActive,
        '.compose-text': lang.compose,
        '#searchInput': lang.searchPlaceholder
    };
    
    for (const selector in elements) {
        const element = document.querySelector(selector);
        if (element && elements[selector]) {
            if (selector === '#searchInput') {
                element.placeholder = elements[selector];
            } else {
                element.textContent = elements[selector];
            }
        }
    }
    
    // Update AI message
    const aiMessage = document.querySelector('.ai-message');
    if (aiMessage && lang.aiOrganizing) {
        aiMessage.innerHTML = lang.aiOrganizing.replace('{count}', '<strong>15</strong>');
    }
}

// ==================== THEME SYSTEM ====================

function setTheme(theme) {
    document.body.className = theme + '-theme';
    localStorage.setItem('inboxpro-theme', theme);
    
    // Update theme buttons
    document.querySelectorAll('.theme-option, .theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    // Update theme icon
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '●';
    }
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    // Language selectors
    document.querySelectorAll('#languageSelect, #appLanguageSelect').forEach(select => {
        select?.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeOptions = document.getElementById('themeOptions');
    
    themeToggle?.addEventListener('click', () => {
        themeOptions.classList.toggle('show');
    });
    
    // Theme selection
    document.querySelectorAll('.theme-option, .theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            setTheme(theme);
            themeOptions?.classList.remove('show');
            showToast(`Theme changed to ${theme}`, 'info');
        });
    });
    
    // Close theme options when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeToggle?.contains(e.target) && !themeOptions?.contains(e.target)) {
            themeOptions?.classList.remove('show');
        }
    });
    
    // Auth forms
    setupAuthForms();
    
    // Navigation
    setupNavigation();
    
    // Email actions
    setupEmailActions();
    
    // Modals
    setupModalHandlers();
    
    // Compose
    setupCompose();
}

function setupAuthForms() {
    // Form switching
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const showLoginFromResetBtn = document.getElementById('showLoginFromReset');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            resetForm.classList.remove('active');
            currentScreen = 'register';
            updateTextElements();
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            resetForm.classList.remove('active');
            currentScreen = 'login';
            updateTextElements();
        });
    }
    
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.remove('active');
            resetForm.classList.add('active');
            currentScreen = 'reset';
            updateTextElements();
        });
    }
    
    if (showLoginFromResetBtn) {
        showLoginFromResetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm.classList.remove('active');
            loginForm.classList.add('active');
            currentScreen = 'login';
            updateTextElements();
        });
    }
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Register button
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
    
    // Reset password button
    const sendResetBtn = document.getElementById('sendResetBtn');
    if (sendResetBtn) {
        sendResetBtn.addEventListener('click', handleResetPassword);
    }
    
    // Password strength indicator
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
    
    // Enter key in forms
    const loginPassword = document.getElementById('loginPassword');
    if (loginPassword) {
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleRegister();
        });
    }
}

// ==================== AUTH HANDLERS ====================

async function handleLogin() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous errors
    clearErrors();
    
    // Validation
    if (!email || !password) {
        showError('loginEmailError', 'Please fill in all fields');
        return;
    }
    
    try {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="btn-text">Loading...</span><span class="btn-icon">⏳</span>';
        }
        
        const user = await authServiceInstance.login(email, password);
        console.log('✅ Вхід успішний:', user.uid);
        showToast('Login successful! Welcome.', 'success');
    } catch (error) {
        console.error('❌ Помилка входу:', error);
        showError('loginPasswordError', getAuthErrorMessage(error));
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.disabled = false;
            const lang = CONFIG.languages[currentLanguage];
            loginBtn.innerHTML = `<span class="btn-text">${lang.signIn}</span><span class="btn-icon">→</span>`;
        }
    }
}

async function handleRegister() {
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmInput = document.getElementById('registerConfirm');
    
    if (!nameInput || !emailInput || !passwordInput || !confirmInput) return;
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    // Clear previous errors
    clearErrors();
    
    // Validation
    if (!name || !email || !password || !confirm) {
        showError('registerNameError', 'Please fill in all fields');
        return;
    }
    
    if (password !== confirm) {
        showError('registerConfirmError', 'Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        showError('registerPasswordError', 'Password must be at least 8 characters');
        return;
    }
    
    try {
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span class="btn-text">Creating...</span><span class="btn-icon">⏳</span>';
        }
        
        const user = await authServiceInstance.register(email, password, name);
        console.log('✅ Реєстрація успішна:', user.uid);
        showToast('Account created successfully!', 'success');
    } catch (error) {
        console.error('❌ Помилка реєстрації:', error);
        showError('registerEmailError', getAuthErrorMessage(error));
        
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.disabled = false;
            const lang = CONFIG.languages[currentLanguage];
            registerBtn.innerHTML = `<span class="btn-text">${lang.createAccountBtn}</span><span class="btn-icon">✓</span>`;
        }
    }
}

async function handleResetPassword() {
    const emailInput = document.getElementById('resetEmail');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showError('resetEmailError', 'Please enter your email');
        return;
    }
    
    try {
        const sendBtn = document.getElementById('sendResetBtn');
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon">⏳</span>';
        }
        
        await authServiceInstance.resetPassword(email);
        showToast('Password reset email sent!', 'success');
        document.getElementById('resetForm').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
        currentScreen = 'login';
        updateTextElements();
    } catch (error) {
        showError('resetEmailError', getAuthErrorMessage(error));
        
        const sendBtn = document.getElementById('sendResetBtn');
        if (sendBtn) {
            sendBtn.disabled = false;
            const lang = CONFIG.languages[currentLanguage];
            sendBtn.innerHTML = `<span class="btn-text">${lang.sendResetLink}</span><span class="btn-icon">✈️</span>`;
        }
    }
}

function updatePasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthMeter = document.querySelector('.password-strength-meter');
    
    if (!strengthMeter) return;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthMeter.className = 'password-strength-meter';
    
    if (password.length === 0) {
        strengthMeter.style.width = '0';
    } else if (strength <= 1) {
        strengthMeter.classList.add('weak');
    } else if (strength <= 2) {
        strengthMeter.classList.add('medium');
    } else {
        strengthMeter.classList.add('strong');
    }
}

// ==================== UI FUNCTIONS ====================

function showMainApp(user) {
    const loginScreen = document.getElementById('loginScreen');
    const app = document.getElementById('app');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (app) {
        app.style.display = 'flex';
        setTimeout(() => {
            app.style.opacity = '1';
        }, 10);
    }
    
    // Update user info
    updateUserInfo(user);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('inboxpro-theme') || 'dark';
    setTheme(savedTheme);
}

function showLoginScreen() {
    const loadingOverlay = document.getElementById('initialLoading');
    const loginScreen = document.getElementById('loginScreen');
    const app = document.getElementById('app');
    
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    if (app) {
        app.style.display = 'none';
        app.style.opacity = '0';
    }
}

function updateUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement) {
        userNameElement.textContent = user.displayName || 'User';
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = user.email || '';
    }
    
    if (userAvatarElement) {
        const initials = getInitialsFromName(user.displayName || user.email || 'User');
        userAvatarElement.textContent = initials;
    }
}

function getInitialsFromName(name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

function getAuthErrorMessage(error) {
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
            return 'Password too weak';
        case 'auth/operation-not-allowed':
            return 'Operation not allowed';
        case 'auth/too-many-requests':
            return 'Too many attempts. Try again later';
        default:
            return 'Authentication error';
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${getToastIcon(type)}</span>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">✕</button>
    `;
    
    toastContainer.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// ==================== OTHER SETUP FUNCTIONS ====================

function setupNavigation() {
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await authServiceInstance.logout();
                showToast('Logged out successfully', 'info');
            } catch (error) {
                console.error('Помилка виходу:', error);
                showToast('Error logging out', 'error');
            }
        });
    }
}

function setupEmailActions() {
    // Email selection
    const emailCheckboxes = document.querySelectorAll('.email-checkbox');
    emailCheckboxes?.forEach(checkbox => {
        checkbox.addEventListener('change', updateEmailSelection);
    });
    
    // Email item click
    const emailItems = document.querySelectorAll('.email-item');
    emailItems?.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') return;
            viewEmail(item);
        });
    });
}

function setupModalHandlers() {
    // Settings modal
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const settingsModal = document.getElementById('settingsModal');
    const saveSettingsBtn = document.getElementById('saveSettings');
    
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            loadUserSettings();
        });
    }
    
    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveUserSettings);
    }
    
    // Settings tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab + 'Tab')?.classList.add('active');
        });
    });
    
    // Close modals on outside click
    document.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Close modals on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });
}

function setupCompose() {
    const composeBtn = document.getElementById('composeBtn');
    const composeModal = document.getElementById('composeModal');
    const closeCompose = document.getElementById('closeCompose');
    const sendMailBtn = document.getElementById('sendMail');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    
    if (composeBtn && composeModal) {
        composeBtn.addEventListener('click', () => {
            composeModal.classList.remove('hidden');
            document.getElementById('mailTo')?.focus();
        });
    }
    
    if (closeCompose) {
        closeCompose.addEventListener('click', () => {
            composeModal.classList.add('hidden');
            clearComposeForm();
        });
    }
    
    if (sendMailBtn) {
        sendMailBtn.addEventListener('click', async () => {
            const to = document.getElementById('mailTo')?.value.trim() || '';
            const subject = document.getElementById('mailSubject')?.value.trim() || '';
            const text = document.getElementById('mailText')?.value.trim() || '';
            
            if (!to || !subject || !text) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            showToast('Sending email...', 'info');
            
            setTimeout(() => {
                showToast(`Email sent to ${to}`, 'success');
                composeModal.classList.add('hidden');
                clearComposeForm();
            }, 1500);
        });
    }
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            showToast('Draft saved', 'info');
            composeModal.classList.add('hidden');
            clearComposeForm();
        });
    }
}

function clearComposeForm() {
    const mailTo = document.getElementById('mailTo');
    const mailSubject = document.getElementById('mailSubject');
    const mailText = document.getElementById('mailText');
    const urgentCheck = document.getElementById('urgentCheck');
    
    if (mailTo) mailTo.value = '';
    if (mailSubject) mailSubject.value = '';
    if (mailText) mailText.value = '';
    if (urgentCheck) urgentCheck.checked = false;
}

function loadUserSettings() {
    if (!currentUser) return;
    
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    
    if (settingsName) {
        settingsName.value = currentUser.displayName || '';
    }
    
    if (settingsEmail) {
        settingsEmail.value = currentUser.email || '';
    }
}

async function saveUserSettings() {
    const settingsName = document.getElementById('settingsName')?.value;
    
    // Update UI
    const userNameElement = document.getElementById('userName');
    if (userNameElement && settingsName) {
        userNameElement.textContent = settingsName;
    }
    
    showToast('Settings saved', 'success');
    document.getElementById('settingsModal').classList.add('hidden');
}

function viewEmail(emailItem) {
    console.log('Viewing email:', emailItem);
    // Implementation for viewing email
}

function updateEmailSelection() {
    // Implementation for email selection
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initializeApp);
