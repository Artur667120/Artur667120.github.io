/* ====================== ІМПОРТ СЕРВІСІВ ====================== */

// ГЛОБАЛЬНІ ЗМІННІ
let currentUser = null;
let currentFolder = 'inbox';
let isInitialized = false;
let authService = null;
let emailService = null;
let storageService = null;

// Функції з utils.js (додаємо прямо сюди, щоб уникнути проблем з імпортом)
function formatDate(dateString) {
    if (!dateString) return 'Невідомо';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return 'щойно';
    } else if (diffMins < 60) {
        return `${diffMins} хв тому`;
    } else if (diffHours < 24) {
        return `${diffHours} год тому`;
    } else if (diffDays < 7) {
        return `${diffDays} дн тому`;
    } else {
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return {
        score: strength,
        level: strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong'
    };
}

function pluralize(number, one, few, many) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return one;
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return few;
    } else {
        return many;
    }
}

/* ====================== ІНІЦІАЛІЗАЦІЯ ДОДАТКУ ====================== */
async function initializeApp() {
    if (isInitialized) return;
    
    console.log('🚀 Ініціалізація Inbox Pro...');
    
    try {
        // Динамічний імпорт сервісів
        const authModule = await import('./auth-service.js');
        authService = authModule.authService;
        
        // Спроба імпортувати інші сервіси
        try {
            const emailModule = await import('./email-service.js');
            emailService = emailModule.emailService;
        } catch (e) {
            console.log('Email service не завантажено, використовуємо демо-дані');
        }
        
        try {
            const storageModule = await import('./storage-service.js');
            storageService = storageModule.storageService;
        } catch (e) {
            console.log('Storage service не завантажено');
        }
        
        // Ініціалізація сервісу автентифікації
        if (authService) {
            authService.initAuthStateListener();
            
            // Додати слухача зміни стану автентифікації
            authService.addAuthStateListener((user) => {
                handleAuthStateChange(user);
            });
        }
        
    } catch (error) {
        console.error('Помилка ініціалізації сервісів:', error);
        showErrorToUser('Помилка завантаження. Спробуйте оновити сторінку.');
    }
    
    // Приховати завантаження через 2 секунди
    setTimeout(() => {
        const initialLoading = document.getElementById('initialLoading');
        if (initialLoading) initialLoading.style.display = 'none';
        
        // Якщо немає користувача, показати екран входу
        if (!currentUser) {
            showLoginScreen();
        }
    }, 2000);
    
    // Налаштування слухачів подій
    setupEventListeners();
    
    isInitialized = true;
    console.log('✅ Inbox Pro ініціалізовано');
}

function handleAuthStateChange(user) {
    console.log('Зміна стану автентифікації:', user ? 'Користувач увійшов' : 'Користувач вийшов');
    
    const initialLoading = document.getElementById('initialLoading');
    if (initialLoading) initialLoading.style.display = 'none';
    
    currentUser = user;
    
    if (user) {
        showApp();
        updateUserInterface(user);
        
        if (emailService && user.uid) {
            try {
                emailService.setupRealtimeListener(user.uid, currentFolder);
            } catch (error) {
                console.log('Не вдалося налаштувати слухача листів:', error);
            }
        }
        
        showToast(`Вітаємо, ${user.name || user.email}!`, 'success');
    } else {
        showLoginScreen();
        if (emailService) {
            try {
                emailService.stopRealtimeListener();
            } catch (error) {
                console.log('Не вдалося зупинити слухача листів:', error);
            }
        }
    }
}

function showErrorToUser(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
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

function updateUserInterface(user) {
    if (!user) return;
    
    // Оновлення імені користувача
    const userNameElements = document.querySelectorAll('#userName, .user-name');
    userNameElements.forEach(el => {
        if (el) el.textContent = user.name || user.email;
    });
    
    // Оновлення email
    const userEmailElements = document.querySelectorAll('#userEmail, .user-email');
    userEmailElements.forEach(el => {
        if (el) el.textContent = user.email;
    });
    
    // Оновлення аватара
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        const firstLetter = (user.name || user.email).charAt(0).toUpperCase();
        userAvatar.textContent = firstLetter;
        userAvatar.style.backgroundImage = user.profile?.avatar ? `url(${user.profile.avatar})` : 'linear-gradient(135deg, #667eea, #48bb78)';
        if (user.profile?.avatar) {
            userAvatar.textContent = '';
        }
    }
    
    // Оновлення інформації про сховище
    updateStorageInfo(user);
}

function updateStorageInfo(user) {
    if (!user) return;
    
    const storageUsed = user.storageUsed || 0;
    const storageLimit = user.plan === 'free' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
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

function initializeAppInterface() {
    // Завантажити демо-дані для листів
    loadDemoEmails();
    
    // Налаштувати перемикання папок
    setupFolderSelection();
    
    // Налаштувати пошук
    setupSearch();
    
    // Налаштувати теми
    setupThemes();
}

function loadDemoEmails() {
    const emailsList = document.getElementById('emailsList');
    if (!emailsList) return;
    
    const demoEmails = [
        {
            id: 1,
            from: 'support@inboxpro.com',
            fromName: 'Inbox Pro Support',
            subject: 'Ласкаво просимо до Inbox Pro!',
            body: 'Дякуємо за реєстрацію в Inbox Pro. Ми раді вас бачити! Ось кілька порад для початку роботи...',
            date: new Date(),
            read: false,
            important: true,
            attachments: 0,
            folder: 'inbox'
        },
        {
            id: 2,
            from: 'team@company.com',
            fromName: 'Команда проєкту',
            subject: 'Запланована зустріч',
            body: 'Нагадуємо про заплановану зустріч завтра о 14:00. Будь ласка, підготуйте ваші матеріали.',
            date: new Date(Date.now() - 3600000),
            read: true,
            important: true,
            attachments: 1,
            folder: 'inbox'
        },
        {
            id: 3,
            from: 'newsletter@tech.com',
            fromName: 'Tech Newsletter',
            subject: 'Останні новини технологій',
            body: 'Ознайомтеся з останніми новинами в світі технологій. Нові релізи, тренди та аналітика.',
            date: new Date(Date.now() - 86400000),
            read: false,
            important: false,
            attachments: 0,
            folder: 'inbox'
        }
    ];
    
    emailsList.innerHTML = '';
    
    if (demoEmails.length === 0) {
        emailsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Немає листів</h3>
                <p>Натисніть "Написати" для створення нового листа</p>
            </div>
        `;
        return;
    }
    
    demoEmails.forEach((email, index) => {
        const emailElement = createEmailElement(email, index);
        emailsList.appendChild(emailElement);
    });
    
    // Оновити лічильники
    updateEmailCounts(demoEmails);
}

function createEmailElement(email, index) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'} ${email.important ? 'important' : ''}`;
    div.dataset.id = email.id;
    
    const avatarText = email.fromName ? email.fromName.charAt(0).toUpperCase() : '?';
    const date = formatDate(email.date);
    const preview = email.body.substring(0, 80) + (email.body.length > 80 ? '...' : '');
    
    div.innerHTML = `
        <div class="email-checkbox">
            <input type="checkbox" class="email-select" data-id="${email.id}">
        </div>
        <div class="email-avatar">${avatarText}</div>
        <div class="email-content">
            <div class="email-header">
                <div class="email-sender">${email.fromName || email.from}</div>
                <div class="email-date">${date}</div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${preview}</div>
        </div>
        ${email.attachments > 0 ? 
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
    const readerDate = document.getElementById('readerDate');
    const readerSubject = document.getElementById('readerSubject');
    const readerText = document.getElementById('readerText');
    const emailTo = document.getElementById('emailTo');
    
    if (!reader || !readerTitle) return;
    
    readerTitle.textContent = email.subject;
    readerSender.textContent = email.fromName || email.from;
    
    const dateElement = readerDate.querySelector('span');
    if (dateElement) dateElement.textContent = formatDate(email.date);
    
    readerSubject.textContent = email.subject;
    readerText.innerHTML = `<p>${email.body}</p>`;
    
    if (emailTo) emailTo.textContent = currentUser?.email || 'you@example.com';
    
    // Оновлення аватара
    const readerAvatar = document.getElementById('readerAvatar');
    if (readerAvatar) {
        const avatarText = (email.fromName || email.from).charAt(0).toUpperCase();
        readerAvatar.textContent = avatarText;
    }
    
    // Позначити лист як прочитаний
    if (!email.read && emailService) {
        try {
            emailService.updateEmail(email.id, { read: true });
        } catch (error) {
            console.log('Не вдалося оновити статус листа:', error);
        }
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

/* ====================== НАЛАШТУВАННЯ СЛУХАЧІВ ПОДІЙ ====================== */
function setupEventListeners() {
    setupAuthForms();
    setupLogout();
    setupModals();
    setupMenu();
    setupSearch();
    setupThemes();
    setupLanguages();
    setupCompose();
    setupFilters();
    setupFolderSelection();
    setupEmailReader();
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
        
        clearAllErrors();
        
        if (!validateEmail(email)) {
            showError('loginEmailError', 'Введіть коректну електронну пошту');
            return;
        }
        
        if (!validatePassword(password)) {
            showError('loginPasswordError', 'Пароль повинен містити мінімум 6 символів');
            return;
        }
        
        if (!authService) {
            showError('loginEmailError', 'Сервіс не доступний');
            return;
        }
        
        showLoading('Вхід в систему...');
        try {
            const result = await authService.login(email, password);
            hideLoading();
            
            if (result.success) {
                showToast('Успішний вхід!', 'success');
            } else {
                showError('loginEmailError', result.error);
            }
        } catch (error) {
            hideLoading();
            showError('loginEmailError', 'Помилка сервера');
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
        
        if (!authService) {
            showError('registerEmailError', 'Сервіс не доступний');
            return;
        }
        
        showLoading('Реєстрація...');
        try {
            const result = await authService.register(email, password, name);
            hideLoading();
            
            if (result.success) {
                showToast('Акаунт успішно створено!', 'success');
            } else {
                showError('registerEmailError', result.error);
            }
        } catch (error) {
            hideLoading();
            showError('registerEmailError', 'Помилка сервера');
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
        
        if (!authService) {
            showError('resetEmailError', 'Сервіс не доступний');
            return;
        }
        
        showLoading('Надсилання листа...');
        try {
            const result = await authService.resetPassword(email);
            hideLoading();
            
            if (result.success) {
                showToast('Лист для відновлення пароля надіслано на вашу пошту', 'success');
                switchAuthForm('loginForm');
            } else {
                showError('resetEmailError', result.error);
            }
        } catch (error) {
            hideLoading();
            showError('resetEmailError', 'Помилка сервера');
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

function switchAuthForm(formId) {
    const forms = document.querySelectorAll('.login-form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
    
    const activeForm = document.getElementById(formId);
    if (activeForm) {
        activeForm.style.display = 'block';
    }
}

function setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Ви дійсно хочете вийти з акаунту?')) {
            if (!authService) {
                showToast('Помилка при виході з системи', 'error');
                return;
            }
            
            showLoading('Вихід...');
            try {
                const result = await authService.logout();
                hideLoading();
                
                if (result.success) {
                    showToast('Ви успішно вийшли з системи', 'success');
                } else {
                    showToast('Помилка при виході з системи', 'error');
                }
            } catch (error) {
                hideLoading();
                showToast('Помилка при виході', 'error');
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
    
    // Умови використання
    document.getElementById('termsBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('termsModal');
    });
    
    document.getElementById('closeTerms')?.addEventListener('click', () => {
        hideModal('termsModal');
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

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
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
                sidebar && 
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

function performSearch(term) {
    if (!term.trim()) return;
    
    showToast(`Пошук: ${term}`, 'info');
    // Тут буде реалізація пошуку
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

function changeTheme(theme) {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
    
    // Оновлення активного елемента в меню
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.toggle('active', option.dataset.theme === theme);
    });
}

function setupLanguages() {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        const savedLang = localStorage.getItem('language') || 'ua';
        langSelect.value = savedLang;
        
        langSelect.addEventListener('change', () => {
            const lang = langSelect.value;
            localStorage.setItem('language', lang);
            showToast(`Мова змінена на ${langSelect.options[langSelect.selectedIndex].text}`, 'info');
        });
    }
}

function setupCompose() {
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) {
        composeBtn.addEventListener('click', () => {
            showModal('composeModal');
        });
    }
    
    const closeCompose = document.getElementById('closeCompose');
    if (closeCompose) {
        closeCompose.addEventListener('click', () => hideModal('composeModal'));
    }
    
    // Проста відправка листа (демо)
    const sendMailBtn = document.getElementById('sendMail');
    if (sendMailBtn) {
        sendMailBtn.addEventListener('click', () => {
            const to = document.getElementById('mailTo').value;
            const subject = document.getElementById('mailSubject').value;
            const text = document.getElementById('mailText').value;
            
            if (!to || !subject || !text) {
                showToast('Заповніть всі поля', 'error');
                return;
            }
            
            hideModal('composeModal');
            showToast('Лист надіслано (демо)', 'success');
            
            // Очистити форму
            document.getElementById('mailTo').value = '';
            document.getElementById('mailSubject').value = '';
            document.getElementById('mailText').value = '';
        });
    }
}

function setupFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            const filter = tag.dataset.filter;
            // Тут буде фільтрація листів
            showToast(`Фільтр: ${filter}`, 'info');
        });
    });
}

function setupFolderSelection() {
    const folderItems = document.querySelectorAll('.menu-item[data-folder]');
    folderItems.forEach(item => {
        item.addEventListener('click', () => {
            // Видалити активний клас у всіх
            folderItems.forEach(i => i.classList.remove('active'));
            // Додати активний клас поточному
            item.classList.add('active');
            
            // Оновити поточну папку
            currentFolder = item.dataset.folder;
            
            // Оновити заголовок
            const folderTitle = document.getElementById('currentFolder');
            if (folderTitle) {
                const icon = item.querySelector('i')?.className || 'fas fa-inbox';
                const text = item.querySelector('span')?.textContent || 'Inbox';
                folderTitle.innerHTML = `<i class="${icon}"></i> <span>${text}</span>`;
            }
            
            // Завантажити листи для цієї папки
            loadDemoEmails();
        });
    });
}

function setupEmailReader() {
    const backBtn = document.getElementById('backToList');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const reader = document.getElementById('reader');
            const emails = document.querySelector('.emails');
            
            if (reader) reader.style.display = 'none';
            if (emails) emails.style.display = 'block';
        });
    }
}

function setupGlobalEvents() {
    // Оновлення при зміні розміру вікна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const reader = document.getElementById('reader');
            const emails = document.querySelector('.emails');
            
            if (reader) reader.style.display = 'flex';
            if (emails) emails.style.display = 'block';
        }
    });
}

/* ====================== ПОЧАТОК ВИКОНАННЯ ====================== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM завантажено, ініціалізація додатку...');
    
    // Показати форму входу за замовчуванням
    switchAuthForm('loginForm');
    
    // Запустити ініціалізацію додатку
    initializeApp();
    
    // Додати глобальний обробник помилок
    window.addEventListener('error', (event) => {
        console.error('Глобальна помилка:', event.error);
        showErrorToUser('Сталася несподівана помилка');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Необроблена проміс-помилка:', event.reason);
        showErrorToUser('Помилка завантаження');
    });
});

// Додати CSS для toastOut анімації
const style = document.createElement('style');
style.textContent = `
    @keyframes toastOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    
    .login-form {
        display: none;
    }
    
    .login-form.active {
        display: block;
    }
`;
document.head.appendChild(style);
