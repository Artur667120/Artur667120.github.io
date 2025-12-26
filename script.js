/* ====================== СПРОЩЕНИЙ SCRIPT.JS ====================== */

// ГЛОБАЛЬНІ ЗМІННІ
let currentUser = null;
let currentFolder = 'inbox';
let isInitialized = false;

// Основні функції
async function initializeApp() {
    if (isInitialized) return;
    
    console.log('🚀 Ініціалізація Inbox Pro...');
    
    try {
        // Спробувати імпортувати сервіси динамічно
        const module = await import('./auth-service.js');
        const { authService } = module;
        
        // Ініціалізація сервісу автентифікації
        authService.initAuthStateListener();
        
        // Додати слухача зміни стану автентифікації
        authService.addAuthStateListener((user) => {
            handleAuthStateChange(user);
        });
        
    } catch (error) {
        console.error('Помилка ініціалізації сервісів:', error);
        // Показати помилку користувачу
        showErrorToUser('Помилка завантаження додатку. Спробуйте оновити сторінку.');
    }
    
    // Приховати завантаження через 2 секунди (навіть якщо помилка)
    setTimeout(() => {
        const initialLoading = document.getElementById('initialLoading');
        if (initialLoading) {
            initialLoading.style.display = 'none';
        }
        
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
        showToast(`Вітаємо, ${user.name || user.email}!`, 'success');
    } else {
        showLoginScreen();
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

// ІНТЕРФЕЙС ФУНКЦІЇ
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
        userAvatar.style.backgroundImage = `linear-gradient(135deg, #667eea, #48bb78)`;
    }
}

function initializeAppInterface() {
    // Завантажити демо-дані для листів
    loadDemoEmails();
    
    // Налаштувати перемикання папок
    setupFolderSelection();
    
    // Налаштувати пошук
    setupSearch();
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
            body: 'Дякуємо за реєстрацію в Inbox Pro. Ми раді вас бачити!',
            date: new Date(),
            read: false,
            important: true,
            attachments: 0
        },
        {
            id: 2,
            from: 'team@company.com',
            fromName: 'Команда проєкту',
            subject: 'Запланована зустріч',
            body: 'Нагадуємо про заплановану зустріч завтра о 14:00.',
            date: new Date(Date.now() - 3600000),
            read: true,
            important: true,
            attachments: 1
        },
        {
            id: 3,
            from: 'newsletter@tech.com',
            fromName: 'Tech Newsletter',
            subject: 'Останні новини технологій',
            body: 'Ознайомтеся з останніми новинами в світі технологій.',
            date: new Date(Date.now() - 86400000),
            read: false,
            important: false,
            attachments: 0
        }
    ];
    
    emailsList.innerHTML = '';
    
    demoEmails.forEach((email, index) => {
        const emailElement = createEmailElement(email, index);
        emailsList.appendChild(emailElement);
    });
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
    
    div.addEventListener('click', () => {
        showEmailDetails(email);
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
    
    if (!reader || !readerTitle) return;
    
    readerTitle.textContent = email.subject;
    readerSender.textContent = email.fromName || email.from;
    
    const dateElement = readerDate.querySelector('span');
    if (dateElement) dateElement.textContent = formatDate(email.date);
    
    readerSubject.textContent = email.subject;
    readerText.innerHTML = `<p>${email.body}</p>`;
    
    // Оновлення аватара
    const readerAvatar = document.getElementById('readerAvatar');
    if (readerAvatar) {
        const avatarText = (email.fromName || email.from).charAt(0).toUpperCase();
        readerAvatar.textContent = avatarText;
    }
    
    // Показати переглядач на мобільних пристроях
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'none';
        reader.style.display = 'flex';
    }
}

function formatDate(date) {
    if (!date) return '';
    
    const now = new Date();
    const emailDate = new Date(date);
    const diffMs = now - emailDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) {
        return 'щойно';
    } else if (diffMins < 60) {
        return `${diffMins} хв тому`;
    } else if (diffHours < 24) {
        return `${diffHours} год тому`;
    } else {
        return emailDate.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            year: emailDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

// ДОПОМІЖНІ ФУНКЦІЇ
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

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.innerHTML = '';
    });
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

// НАЛАШТУВАННЯ СЛУХАЧІВ ПОДІЙ
function setupEventListeners() {
    setupAuthForms();
    setupLogout();
    setupModals();
    setupMenu();
    setupCompose();
    setupBackToList();
}

function setupAuthForms() {
    // Перемикання між формами
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const showLoginFromReset = document.getElementById('showLoginFromReset');
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthForm('registerForm');
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthForm('loginForm');
        });
    }
    
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthForm('resetForm');
        });
    }
    
    if (showLoginFromReset) {
        showLoginFromReset.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthForm('loginForm');
        });
    }
    
    // Вхід
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Реєстрація
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
    
    // Відновлення пароля
    const sendResetBtn = document.getElementById('sendResetBtn');
    if (sendResetBtn) {
        sendResetBtn.addEventListener('click', handleResetPassword);
    }
    
    // Enter для форм
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    
    [loginForm, registerForm, resetForm].forEach(form => {
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
    const forms = ['loginForm', 'registerForm', 'resetForm'];
    forms.forEach(id => {
        const form = document.getElementById(id);
        if (form) {
            form.classList.toggle('active', id === formId);
        }
    });
    
    clearAllErrors();
}

async function handleLogin() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    
    clearAllErrors();
    
    if (!email || !validateEmail(email)) {
        showError('loginEmailError', 'Введіть коректну електронну пошту');
        return;
    }
    
    if (!password || password.length < 6) {
        showError('loginPasswordError', 'Пароль повинен містити мінімум 6 символів');
        return;
    }
    
    try {
        const module = await import('./auth-service.js');
        const { authService } = module;
        
        const result = await authService.login(email, password);
        
        if (result.success) {
            showToast('Успішний вхід!', 'success');
        } else {
            showError('loginEmailError', result.error);
        }
    } catch (error) {
        console.error('Помилка входу:', error);
        showError('loginEmailError', 'Помилка сервера. Спробуйте пізніше');
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName')?.value.trim();
    const email = document.getElementById('registerEmail')?.value.trim();
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('registerConfirm')?.value;
    const acceptTerms = document.getElementById('acceptTerms')?.checked;
    
    clearAllErrors();
    
    // Валідація
    if (!name) {
        showError('registerNameError', 'Введіть ваше ім\'я');
        return;
    }
    
    if (!email || !validateEmail(email)) {
        showError('registerEmailError', 'Введіть коректну електронну пошту');
        return;
    }
    
    if (!password || password.length < 6) {
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
    
    try {
        const module = await import('./auth-service.js');
        const { authService } = module;
        
        const result = await authService.register(email, password, name);
        
        if (result.success) {
            showToast('Акаунт успішно створено!', 'success');
        } else {
            showError('registerEmailError', result.error);
        }
    } catch (error) {
        console.error('Помилка реєстрації:', error);
        showError('registerEmailError', 'Помилка сервера. Спробуйте пізніше');
    }
}

async function handleResetPassword() {
    const email = document.getElementById('resetEmail')?.value.trim();
    
    clearAllErrors();
    
    if (!email || !validateEmail(email)) {
        showError('resetEmailError', 'Введіть коректну електронну пошту');
        return;
    }
    
    try {
        const module = await import('./auth-service.js');
        const { authService } = module;
        
        const result = await authService.resetPassword(email);
        
        if (result.success) {
            showToast('Лист для відновлення пароля надіслано на вашу пошту', 'success');
            switchAuthForm('loginForm');
        } else {
            showError('resetEmailError', result.error);
        }
    } catch (error) {
        console.error('Помилка відновлення пароля:', error);
        showError('resetEmailError', 'Помилка сервера. Спробуйте пізніше');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Ви дійсно хочете вийти з акаунту?')) {
                try {
                    const module = await import('./auth-service.js');
                    const { authService } = module;
                    
                    const result = await authService.logout();
                    
                    if (result.success) {
                        showToast('Ви успішно вийшли з системи', 'success');
                    } else {
                        showToast('Помилка при виході з системи', 'error');
                    }
                } catch (error) {
                    console.error('Помилка виходу:', error);
                    showToast('Помилка при виході', 'error');
                }
            }
        });
    }
}

function setupModals() {
    // Політика конфіденційності
    const privacyBtns = ['privacyPolicyBtn', 'privacyBtn'];
    privacyBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('privacyModal');
            });
        }
    });
    
    const closePrivacy = document.getElementById('closePrivacy');
    if (closePrivacy) {
        closePrivacy.addEventListener('click', () => hideModal('privacyModal'));
    }
    
    // Умови використання
    const termsBtn = document.getElementById('termsBtn');
    if (termsBtn) {
        termsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('termsModal');
        });
    }
    
    const closeTerms = document.getElementById('closeTerms');
    if (closeTerms) {
        closeTerms.addEventListener('click', () => hideModal('termsModal'));
    }
    
    // Закриття модальних вікон при кліку поза ними
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Закриття модальних вікон клавішею Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
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
}

function setupBackToList() {
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
    }
}

// ПОЧАТОК ВИКОНАННЯ
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM завантажено, ініціалізація додатку...');
    
    // Запустити ініціалізацію додатку
    initializeApp();
    
    // Додати глобальний обробник помилок
    window.addEventListener('error', (event) => {
        console.error('Глобальна помилка:', event.error);
        showErrorToUser('Сталася несподівана помилка. Спробуйте оновити сторінку.');
    });
    
    // Додати обробник для незавантажених ресурсів
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Необроблена проміс-помилка:', event.reason);
        showErrorToUser('Помилка завантаження. Спробуйте ще раз.');
    });
});
