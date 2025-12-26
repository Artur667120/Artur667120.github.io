// Inbox Pro - Main JavaScript
import { AuthService } from './auth-service.js';

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
        AuthService.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                console.log('✅ Користувач авторизований:', user.email);
                await showMainApp(user);
            } else {
                console.log('👤 Користувач не авторизований');
                showLoginScreen();
            }
        });
        
        // Hide loading screen
        setTimeout(() => {
            const loadingOverlay = document.getElementById('initialLoading');
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }
        }, 1000);
        
        console.log('✅ Inbox Pro ініціалізовано');
    } catch (error) {
        console.error('❌ Помилка ініціалізації:', error);
        showToast('Помилка ініціалізації додатку', 'error');
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
    
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (lang[key]) {
            element.textContent = lang[key];
        }
    });
    
    // Update specific elements
    const elements = {
        '#loadingText': 'loading',
        '#loginForm h2': 'welcomeBack',
        '#registerForm h2': 'createAccount',
        '#resetForm h2': 'resetPassword',
        '#rememberMeText': 'rememberMe',
        '#newUserText': 'newUser',
        '#haveAccountText': 'haveAccount',
        '#rememberPasswordText': 'rememberPassword',
        '.login-switch a[href="#"]': currentScreen === 'login' ? 'createAccount' : 'signIn',
        '#loginBtn .btn-text': 'signIn',
        '#registerBtn .btn-text': 'createAccountBtn',
        '#sendResetBtn .btn-text': 'sendResetLink',
        '.password-hint': 'passwordHint',
        '.ai-text': 'aiActive',
        '.ai-message': 'aiOrganizing',
        '.compose-text': 'compose',
        '.nav-text[data-folder="inbox"]': 'inbox',
        '.nav-text[data-folder="starred"]': 'starred',
        '.nav-text[data-folder="sent"]': 'sent',
        '.nav-text[data-folder="drafts"]': 'drafts',
        '.nav-text[data-folder="spam"]': 'spam',
        '.nav-text[data-folder="trash"]': 'trash',
        '#searchInput::placeholder': 'searchPlaceholder',
        '#composeModal h3': 'newMessage',
        '#mailTo::placeholder': 'to',
        '#mailSubject::placeholder': 'subject',
        '#mailText::placeholder': 'writeMessage',
        '#sendMail span': 'send',
        '#saveDraftBtn span': 'saveDraft',
        '#urgentCheck + span': 'important',
        '#settingsModal h3': 'settings',
        '.tab-btn[data-tab="profile"]': 'profile',
        '.tab-btn[data-tab="appearance"]': 'appearance',
        '.tab-btn[data-tab="notifications"]': 'notifications',
        '.tab-btn[data-tab="language"]': 'language',
        '#notificationsEnabled + span': 'enableNotifications',
        '#interfaceLanguageLabel': 'interfaceLanguage',
        '#saveSettings': 'saveChanges'
    };
    
    for (const selector in elements) {
        const key = elements[selector];
        const element = document.querySelector(selector);
        if (element && lang[key]) {
            if (selector.includes('::placeholder')) {
                element.setAttribute('placeholder', lang[key]);
            } else {
                element.textContent = lang[key];
            }
        }
    }
    
    // Update AI message with count
    const aiMessage = document.querySelector('.ai-message');
    if (aiMessage) {
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
            showToast(`Тема змінена на ${theme}`, 'info');
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

// ... (решта коду залишається аналогічною попередній версії, але з додаванням перекладу)

// В функціях showToast, updateTextElements додати переклад

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

// Initialize
document.addEventListener('DOMContentLoaded', initializeApp);
