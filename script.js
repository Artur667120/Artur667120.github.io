/* ====================== ІМПОРТ СЕРВІСІВ ====================== */

// Імпорт наших нових сервісів
import { authService } from './auth-service.js';
import { emailService } from './email-service.js';
import { storageService } from './storage-service.js';
import { 
    formatDate, 
    validateEmail, 
    validatePassword, 
    checkPasswordStrength,
    pluralize 
} from './utils.js';

// EMAILJS CONFIG - ТВОЇ КЛЮЧІ
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'afzWbZbh3EJiObFmK',
    SERVICE_ID: 'service_a3mpspb',
    TEMPLATE_ID: 'xftxq1o'
};

/* ====================== ГЛОБАЛЬНІ ЗМІННІ ====================== */
let currentUser = null;
let currentFolder = 'inbox';
let isInitialized = false;

/* ====================== ІНІЦІАЛІЗАЦІЯ ДОДАТКУ ====================== */
function initializeApp() {
    if (isInitialized) return;
    
    console.log('🚀 Ініціалізація Inbox Pro...');
    
    // Ініціалізація сервісу автентифікації
    authService.initAuthStateListener();
    
    // Додати слухача зміни стану автентифікації
    authService.addAuthStateListener((user) => {
        handleAuthStateChange(user);
    });
    
    // Ініціалізація EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS ініціалізовано');
    }
    
    // Налаштування слухачів подій
    setupEventListeners();
    
    // Приховати завантаження через 2 секунди
    setTimeout(() => {
        const initialLoading = document.getElementById('initialLoading');
        if (initialLoading) initialLoading.style.display = 'none';
    }, 2000);
    
    isInitialized = true;
    console.log('✅ Inbox Pro ініціалізовано');
}

function handleAuthStateChange(user) {
    const initialLoading = document.getElementById('initialLoading');
    if (initialLoading) initialLoading.style.display = 'none';
    
    if (user) {
        currentUser = user;
        showApp();
        updateUserInterface();
        emailService.setupRealtimeListener(user.uid, currentFolder);
        
        // Показати повідомлення про успішний вхід
        if (user.emailVerified) {
            showToast('З поверненням!', 'success');
        } else {
            showToast('Ласкаво просимо до Inbox Pro!', 'success');
        }
    } else {
        currentUser = null;
        showLoginScreen();
        emailService.stopRealtimeListener();
    }
}

/* ====================== ІНТЕРФЕЙС ====================== */
function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const app = document.getElementById('app');
    const initialLoading = document.getElementById('initialLoading');
    
    if (initialLoading) initialLoading.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    if (app) {
        app.style.display = 'none';
        app.style.opacity = '0';
    }
    
    resetAllForms();
}

function showApp() {
    const loginScreen = document.getElementById('loginScreen');
    const app = document.getElementById('app');
    const initialLoading = document.getElementById('initialLoading');
    
    if (initialLoading) initialLoading.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'none';
    if (app) {
        app.style.display = 'flex';
        setTimeout(() => {
            app.style.opacity = '1';
        }, 10);
    }
    
    initializeAppInterface();
}

function updateUserInterface() {
    if (!currentUser) return;
    
    // Оновлення імені користувача
    const userNameElements = document.querySelectorAll('#userName, .user-name');
    userNameElements.forEach(el => {
        if (el) el.textContent = currentUser.name;
    });
    
    // Оновлення email
    const userEmailElements = document.querySelectorAll('#userEmail, .user-email');
    userEmailElements.forEach(el => {
        if (el) el.textContent = currentUser.email;
    });
    
    // Оновлення аватара
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        if (currentUser.profile?.avatar) {
            userAvatar.style.backgroundImage = `url(${currentUser.profile.avatar})`;
            userAvatar.textContent = '';
        }
    }
    
    // Оновлення інформації про сховище
    updateStorageInfo();
}

function updateStorageInfo() {
    if (!currentUser) return;
    
    const storageUsed = currentUser.storageUsed || 0;
    const storageLimit = currentUser.plan === 'free' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    const percent = Math.min((storageUsed / storageLimit) * 100, 100);
    
    // Оновлення відсотка використаного сховища
    const storagePercentElements = document.querySelectorAll('.storage-percent');
    storagePercentElements.forEach(el => {
        if (el) el.textContent = `${Math.round(percent)}%`;
    });
    
    // Оновлення прогрес-бару
    const storageProgressElements = document.querySelectorAll('.storage-progress');
    storageProgressElements.forEach(el => {
        if (el) el.style.width = `${percent}%`;
    });
    
    // Оновлення тексту
    const storageTextElements = document.querySelectorAll('.storage-text');
    storageTextElements.forEach(el => {
        if (el) {
            const usedMB = (storageUsed / (1024 * 1024)).toFixed(1);
            const totalMB = (storageLimit / (1024 * 1024)).toFixed(0);
            el.textContent = `${usedMB}GB / ${totalMB}GB використано`;
        }
    });
}

function updateEmailsList(emails) {
    const emailsList = document.getElementById('emailsList');
    if (!emailsList) return;
    
    emailsList.innerHTML = '';
    
    if (emails.length === 0) {
        emailsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Немає листів</h3>
                <p>Натисніть "Написати" для створення нового листа</p>
            </div>
        `;
        return;
    }
    
    emails.forEach((email, index) => {
        const emailElement = createEmailElement(email, index);
        emailsList.appendChild(emailElement);
    });
}

function createEmailElement(email, index) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'} ${email.important ? 'important' : ''}`;
    div.style.animationDelay = `${index * 0.05}s`;
    div.dataset.id = email.id;
    
    const avatarText = email.from ? email.from.charAt(0).toUpperCase() : '?';
    const date = formatDate(email.createdAt);
    const preview = email.body ? email.body.substring(0, 100) + (email.body.length > 100 ? '...' : '') : '';
    
    div.innerHTML = `
        <div class="email-checkbox">
            <input type="checkbox" class="email-select" data-id="${email.id}">
        </div>
        <div class="email-avatar">${avatarText}</div>
        <div class="email-content">
            <div class="email-header">
                <div class="email-sender">${email.from || 'Невідомий відправник'}</div>
                <div class="email-date">${date}</div>
            </div>
            <div class="email-subject">${email.subject || 'Без теми'}</div>
            <div class="email-preview">${preview}</div>
        </div>
        ${email.attachments && email.attachments.length > 0 ? 
            '<div class="email-attachment"><i class="fas fa-paperclip"></i></div>' : ''}
    `;
    
    div.addEventListener('click', (e) => {
        if (!e.target.classList.contains('email-select')) {
            showEmailDetails(email);
        }
    });
    
    return div;
}

function showEmailDetails(email) {
    const reader = document.getElementById('reader');
    const readerTitle = document.getElementById('readerTitle');
    const readerSender = document.getElementById('readerSender');
    const readerSenderEmail = document.getElementById('readerSenderEmail');
    const readerDate = document.getElementById('readerDate');
    const readerSubject = document.getElementById('readerSubject');
    const readerText = document.getElementById('readerText');
    const emailTo = document.getElementById('emailTo');
    const emailCc = document.getElementById('emailCc');
    
    if (!reader || !readerTitle) return;
    
    // Оновлення заголовка
    readerTitle.textContent = email.subject || 'Без теми';
    
    // Оновлення інформації про відправника
    readerSender.textContent = email.fromName || email.from || 'Невідомий відправник';
    readerSenderEmail.textContent = email.from || '';
    
    // Оновлення дати
    const dateElement = readerDate.querySelector('span');
    if (dateElement) dateElement.textContent = formatDate(email.createdAt);
    
    // Оновлення теми та тіла листа
    readerSubject.textContent = email.subject || 'Без теми';
    readerText.innerHTML = `<p>${email.body || ''}</p>`;
    
    // Оновлення одержувачів
    if (emailTo) emailTo.textContent = email.to || '';
    if (emailCc) emailCc.textContent = email.cc || '';
    
    // Оновлення аватара
    const readerAvatar = document.getElementById('readerAvatar');
    if (readerAvatar) {
        const avatarText = email.from ? email.from.charAt(0).toUpperCase() : '?';
        readerAvatar.textContent = avatarText;
    }
    
    // Позначити лист як прочитаний
    if (!email.read) {
        emailService.updateEmail(email.id, { read: true });
        document.querySelector(`[data-id="${email.id}"]`)?.classList.remove('unread');
    }
    
    // На мобільних пристроях показуємо тільки переглядач
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'none';
        reader.style.display = 'flex';
        const backBtn = document.getElementById('backToList');
        if (backBtn) backBtn.style.display = 'flex';
    }
}

function updateEmailCounts(emails) {
    if (!emails) return;
    
    const inboxCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
    const importantCount = emails.filter(e => e.important).length;
    const unreadCount = emails.filter(e => !e.read).length;
    const totalCount = emails.length;
    
    // Оновлення бейджів
    const inboxBadge = document.getElementById('inboxCount');
    const importantBadge = document.getElementById('importantCount');
    
    if (inboxBadge) inboxBadge.textContent = inboxCount > 0 ? inboxCount : '';
    if (importantBadge) importantBadge.textContent = importantCount > 0 ? importantCount : '';
    
    // Оновлення заголовків
    const emailCountElement = document.getElementById('emailCount');
    const unreadCountElement = document.getElementById('unreadCount');
    
    if (emailCountElement) {
        emailCountElement.textContent = `${totalCount} ${pluralize(totalCount, 'лист', 'листи', 'листів')}`;
    }
    
    if (unreadCountElement) {
        unreadCountElement.textContent = `${unreadCount} ${pluralize(unreadCount, 'непрочитаний', 'непрочитаних', 'непрочитаних')}`;
    }
    
    // Оновлення статистики в віджетах
    const totalEmailsElement = document.getElementById('totalEmails');
    const unreadEmailsElement = document.getElementById('unreadEmails');
    const importantEmailsElement = document.getElementById('importantEmails');
    
    if (totalEmailsElement) totalEmailsElement.textContent = totalCount;
    if (unreadEmailsElement) unreadEmailsElement.textContent = unreadCount;
    if (importantEmailsElement) importantEmailsElement.textContent = importantCount;
}

/* ====================== ДОПОМІЖНІ ФУНКЦІЇ ====================== */
function showLoading(text = 'Завантаження...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = loadingOverlay?.querySelector('.loading-text');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        if (loadingText) loadingText.textContent = text;
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        element.classList.add('show');
        
        // Автоматичне приховування через 5 секунд
        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.innerHTML = '';
    });
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Автоматичне видалення через 5 секунд
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

function resetAllForms() {
    const forms = ['loginForm', 'registerForm', 'resetForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('error');
            });
        }
    });
    
    clearAllErrors();
}

function handleAuthError(error, context) {
    console.error('Помилка автентифікації:', error);
    
    const errorMap = {
        'auth/email-already-in-use': { 
            register: ['registerEmailError', 'Ця електронна пошта вже використовується']
        },
        'auth/invalid-email': {
            login: ['loginEmailError', 'Невірний формат електронної пошти'],
            register: ['registerEmailError', 'Невірний формат електронної пошти'],
            reset: ['resetEmailError', 'Невірний формат електронної пошти']
        },
        'auth/user-not-found': {
            login: ['loginEmailError', 'Користувача з такою поштою не знайдено'],
            reset: ['resetEmailError', 'Користувача з такою поштою не знайдено']
        },
        'auth/wrong-password': {
            login: ['loginPasswordError', 'Невірний пароль']
        },
        'auth/weak-password': {
            register: ['registerPasswordError', 'Пароль занадто слабкий. Мінімум 6 символів']
        },
        'auth/user-disabled': {
            login: ['loginEmailError', 'Акаунт заблоковано']
        },
        'auth/too-many-requests': {
            login: ['loginEmailError', 'Забагато невдалих спроб. Спробуйте пізніше'],
            register: ['registerEmailError', 'Забагато спроб. Спробуйте пізніше']
        }
    };
    
    const errorConfig = errorMap[error.code];
    if (errorConfig && errorConfig[context]) {
        const [elementId, message] = errorConfig[context];
        showError(elementId, message);
    } else {
        const defaultMessages = {
            login: 'Невірний email або пароль',
            register: 'Помилка реєстрації. Спробуйте ще раз',
            reset: 'Помилка відновлення пароля'
        };
        
        const defaultElement = context === 'login' ? 'loginEmailError' : 
                              context === 'register' ? 'registerEmailError' : 'resetEmailError';
        
        showError(defaultElement, defaultMessages[context] || 'Сталася помилка. Спробуйте ще раз');
    }
}

/* ====================== НАЛАШТУВАННЯ СЛУХАЧІВ ПОДІЙ ====================== */
function setupEventListeners() {
    // Перемикання форм автентифікації
    setupAuthForms();
    
    // Кнопка виходу
    setupLogout();
    
    // Модальні вікна
    setupModals();
    
    // Бокове меню
    setupMenu();
    
    // Пошук
    setupSearch();
    
    // Темы
    setupThemes();
    
    // Мови
    setupLanguages();
    
    // Написати лист
    setupCompose();
    
    // Фільтри листів
    setupFilters();
    
    // Вибір папки
    setupFolderSelection();
    
    // Відкриття листа
    setupEmailReader();
    
    // Глобальні події
    setupGlobalEvents();
}

function setupAuthForms() {
    // Перемикання між формами
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('registerForm');
    });
    
    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('loginForm');
    });
    
    document.getElementById('forgotPasswordBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('resetForm');
    });
    
    document.getElementById('showLoginFromReset')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('loginForm');
    });
    
    // Вхід
    document.getElementById('loginBtn')?.addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        clearAllErrors();
        
        // Валідація
        if (!validateEmail(email)) {
            showError('loginEmailError', 'Введіть коректну електронну пошту');
            return;
        }
        
        if (!validatePassword(password)) {
            showError('loginPasswordError', 'Пароль повинен містити мінімум 6 символів');
            return;
        }
        
        showLoading('Вхід в систему...');
        const result = await authService.login(email, password);
        hideLoading();
        
        if (result.success) {
            showToast('Успішний вхід!', 'success');
        } else {
            showError('loginEmailError', result.error);
        }
    });
    
    // Реєстрація
    document.getElementById('registerBtn')?.addEventListener('click', async () => {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirm').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        clearAllErrors();
        
        // Валідація
        if (!name) {
            showError('registerNameError', 'Введіть ваше ім\'я');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('registerEmailError', 'Введіть коректну електронну пошту');
            return;
        }
        
        if (!validatePassword(password)) {
            showError('registerPasswordError', 'Пароль повинен містити мінімум 6 символів');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('registerConfirmError', 'Паролі не співпадають');
            return;
        }
        
        if (!acceptTerms) {
            showError('termsError', 'Ви повинні прийняти умови використання');
            return;
        }
        
        showLoading('Реєстрація...');
        const result = await authService.register(email, password, name);
        hideLoading();
        
        if (result.success) {
            showToast('Акаунт успішно створено!', 'success');
        } else {
            showError('registerEmailError', result.error);
        }
    });
    
    // Відновлення пароля
    document.getElementById('sendResetBtn')?.addEventListener('click', async () => {
        const email = document.getElementById('resetEmail').value.trim();
        
        clearAllErrors();
        
        if (!validateEmail(email)) {
            showError('resetEmailError', 'Введіть коректну електронну пошту');
            return;
        }
        
        showLoading('Надсилання листа...');
        const result = await authService.resetPassword(email);
        hideLoading();
        
        if (result.success) {
            showToast('Лист для відновлення пароля надіслано на вашу пошту', 'success');
            switchAuthForm('loginForm');
        } else {
            showError('resetEmailError', result.error);
        }
    });
    
    // Індикатор сили пароля
    const passwordInput = document.getElementById('registerPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener('input', () => {
            const strength = checkPasswordStrength(passwordInput.value);
            passwordStrength.className = 'password-strength';
            
            if (passwordInput.value.length === 0) {
                return;
            }
            
            if (strength.score <= 1) {
                passwordStrength.classList.add('weak');
            } else if (strength.score <= 2) {
                passwordStrength.classList.add('medium');
            } else {
                passwordStrength.classList.add('strong');
            }
        });
    }
    
    // Enter для форм
    const forms = ['loginForm', 'registerForm', 'resetForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const submitBtn = form.querySelector('button[type="button"]');
                    if (submitBtn) submitBtn.click();
                }
            });
        }
    });
}

function setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Ви дійсно хочете вийти з акаунту?')) {
            showLoading('Вихід...');
            const result = await authService.logout();
            hideLoading();
            
            if (result.success) {
                showToast('Ви успішно вийшли з системи', 'success');
            } else {
                showToast('Помилка при виході з системи', 'error');
            }
        }
    });
}

function setupModals() {
    // Політика конфіденційності
    document.getElementById('privacyPolicyBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('privacyModal');
    });
    
    document.getElementById('privacyBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('privacyModal');
    });
    
    document.getElementById('closePrivacy')?.addEventListener('click', () => {
        hideModal('privacyModal');
    });
    
    document.getElementById('acceptPrivacyBtn')?.addEventListener('click', () => {
        hideModal('privacyModal');
        const termsCheckbox = document.getElementById('acceptTerms');
        if (termsCheckbox) termsCheckbox.checked = true;
    });
    
    // Умови використання
    document.getElementById('termsBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('termsModal');
    });
    
    document.getElementById('closeTerms')?.addEventListener('click', () => {
        hideModal('termsModal');
    });
    
    document.getElementById('acceptTermsBtn')?.addEventListener('click', () => {
        hideModal('termsModal');
        const termsCheckbox = document.getElementById('acceptTerms');
        if (termsCheckbox) termsCheckbox.checked = true;
    });
    
    // Налаштування
    document.getElementById('userSettingsBtn')?.addEventListener('click', () => {
        showModal('settingsModal');
    });
    
    document.getElementById('closeSettings')?.addEventListener('click', () => {
        hideModal('settingsModal');
    });
    
    // Допомога
    document.getElementById('helpBtn')?.addEventListener('click', () => {
        showToast('Допомога скоро буде доступна', 'info');
    });
    
    // Зворотній зв'язок
    document.getElementById('feedbackBtn')?.addEventListener('click', () => {
        showToast('Форма зворотного зв\'язку скоро буде доступна', 'info');
    });
}

function setupMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // Закриття меню при кліку поза ним (на мобільних)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput && searchClear) {
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim()) {
                searchClear.style.display = 'flex';
            } else {
                searchClear.style.display = 'none';
            }
        });
        
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            searchInput.focus();
        });
        
        // Пошук при натисканні Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

function setupThemes() {
    const themeToggle = document.getElementById('themeToggle');
    const themeMenu = document.getElementById('themeMenu');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (themeToggle && themeMenu) {
        themeToggle.addEventListener('click', () => {
            themeMenu.classList.toggle('show');
        });
        
        // Закриття меню при кліку поза ним
        document.addEventListener('click', (e) => {
            if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
                themeMenu.classList.remove('show');
            }
        });
        
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                changeTheme(theme);
                themeMenu.classList.remove('show');
            });
        });
        
        // Відновлення збереженої теми
        const savedTheme = localStorage.getItem('theme') || 'dark';
        changeTheme(savedTheme);
    }
}

function setupLanguages() {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        const savedLang = localStorage.getItem('language') || 'ua';
        langSelect.value = savedLang;
        
        langSelect.addEventListener('change', () => {
