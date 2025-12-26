/* ====================== ГЛОБАЛЬНІ ЗМІННІ ====================== */
let currentUser = null;
let currentFolder = 'inbox';
let authService = null;
let currentEmails = [];
let selectedEmails = new Set();

/* ====================== УТІЛІТИ ====================== */
function formatDate(dateString) {
    if (!dateString) return 'Невідомо';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'щойно';
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    if (diffDays < 7) return `${diffDays} дн тому`;
    
    return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
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
    if (number % 10 === 1 && number % 100 !== 11) return one;
    if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) return few;
    return many;
}

/* ====================== ІНІЦІАЛІЗАЦІЯ ====================== */
async function initializeApp() {
    console.log('🚀 Ініціалізація Inbox Pro...');
    
    try {
        const authModule = await import('./auth-service.js');
        authService = authModule.authService;
        
        if (authService) {
            authService.initAuthStateListener();
            authService.addAuthStateListener(handleAuthStateChange);
        }
    } catch (error) {
        console.error('Помилка ініціалізації:', error);
    }
    
    // Приховати завантаження
    setTimeout(() => {
        const initialLoading = document.getElementById('initialLoading');
        if (initialLoading) initialLoading.style.display = 'none';
    }, 1000);
    
    setupEventListeners();
    console.log('✅ Inbox Pro ініціалізовано');
}

function handleAuthStateChange(user) {
    console.log('Зміна стану автентифікації:', user ? 'Користувач увійшов' : 'Користувач вийшов');
    
    currentUser = user;
    
    if (user) {
        showApp();
        updateUserInterface(user);
        loadEmails();
        showToast(`Вітаємо, ${user.name || user.email}!`, 'success');
    } else {
        showLoginScreen();
    }
}

/* ====================== ІНТЕРФЕЙС ====================== */
function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const app = document.getElementById('app');
    
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
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (app) {
        app.style.display = 'flex';
        setTimeout(() => {
            app.style.opacity = '1';
        }, 10);
    }
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
        userAvatar.style.background = 'linear-gradient(135deg, #667eea, #48bb78)';
    }
    
    // Оновлення налаштувань
    updateSettingsForm(user);
}

function updateSettingsForm(user) {
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    
    if (settingsName) settingsName.value = user.name || '';
    if (settingsEmail) settingsEmail.value = user.email || '';
}

/* ====================== EMAIL FUNCTIONS ====================== */
function loadEmails() {
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
            folder: 'inbox',
            starred: false
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
            folder: 'inbox',
            starred: true
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
            folder: 'inbox',
            starred: false
        },
        {
            id: 4,
            from: 'billing@service.com',
            fromName: 'Billing Department',
            subject: 'Ваш рахунок готовий',
            body: 'Ваш щомісячний рахунок готовий до оплати. Термін оплати - до кінця місяця.',
            date: new Date(Date.now() - 172800000),
            read: true,
            important: false,
            attachments: 1,
            folder: 'inbox',
            starred: false
        },
        {
            id: 5,
            from: 'friend@example.com',
            fromName: 'Друг',
            subject: 'Давай зустрінемося!',
            body: 'Давно не бачилися! Давай зустрінемося на каві наступного тижня.',
            date: new Date(Date.now() - 259200000),
            read: true,
            important: false,
            attachments: 0,
            folder: 'inbox',
            starred: true
        }
    ];
    
    currentEmails = demoEmails;
    renderEmails();
}

function renderEmails() {
    const emailsList = document.getElementById('emailsList');
    if (!emailsList) return;
    
    // Фільтрація за поточною папкою
    let filteredEmails = currentEmails.filter(email => email.folder === currentFolder);
    
    // Фільтрація за активним фільтром
    const activeFilter = document.querySelector('.filter-tag.active')?.dataset.filter;
    if (activeFilter) {
        switch(activeFilter) {
            case 'unread':
                filteredEmails = filteredEmails.filter(email => !email.read);
                break;
            case 'important':
                filteredEmails = filteredEmails.filter(email => email.important);
                break;
            case 'attachments':
                filteredEmails = filteredEmails.filter(email => email.attachments > 0);
                break;
        }
    }
    
    // Сортування
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        switch(sortSelect.value) {
            case 'newest':
                filteredEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredEmails.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'important':
                filteredEmails.sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));
                break;
            case 'unread':
                filteredEmails.sort((a, b) => (!b.read ? 1 : 0) - (!a.read ? 1 : 0));
                break;
        }
    }
    
    emailsList.innerHTML = '';
    
    if (filteredEmails.length === 0) {
        emailsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Немає листів</h3>
                <p>Натисніть "Написати" для створення нового листа</p>
            </div>
        `;
        return;
    }
    
    filteredEmails.forEach((email) => {
        const emailElement = createEmailElement(email);
        emailsList.appendChild(emailElement);
    });
    
    updateEmailCounts();
}

function createEmailElement(email) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'} ${email.important ? 'important' : ''}`;
    div.dataset.id = email.id;
    
    const avatarText = email.fromName ? email.fromName.charAt(0).toUpperCase() : '?';
    const date = formatDate(email.date);
    const preview = email.body.substring(0, 80) + (email.body.length > 80 ? '...' : '');
    const isSelected = selectedEmails.has(email.id);
    
    div.innerHTML = `
        <div class="email-checkbox">
            <input type="checkbox" class="email-select" ${isSelected ? 'checked' : ''} data-id="${email.id}">
        </div>
        <div class="email-avatar ${email.important ? 'important' : ''}">${avatarText}</div>
        <div class="email-content">
            <div class="email-header">
                <div class="email-sender">${email.fromName || email.from}</div>
                <div class="email-date">${date}</div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${preview}</div>
        </div>
        <div class="email-actions">
            <button class="email-action-btn star-btn ${email.starred ? 'starred' : ''}" data-id="${email.id}" title="${email.starred ? 'Unstar' : 'Star'}">
                <i class="${email.starred ? 'fas' : 'far'} fa-star"></i>
            </button>
        </div>
        ${email.attachments > 0 ? 
            '<div class="email-attachment"><i class="fas fa-paperclip"></i></div>' : ''}
    `;
    
    // Додаємо обробник кліку на лист
    div.addEventListener('click', (e) => {
        if (!e.target.classList.contains('email-select') && 
            !e.target.classList.contains('star-btn') &&
            !e.target.closest('.star-btn')) {
            showEmailDetails(email);
        }
    });
    
    // Обробник для зірочки
    const starBtn = div.querySelector('.star-btn');
    if (starBtn) {
        starBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleStar(email.id);
        });
    }
    
    // Обробник для чекбоксу
    const checkbox = div.querySelector('.email-select');
    if (checkbox) {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEmailSelection(email.id, checkbox.checked);
        });
    }
    
    return div;
}

function toggleEmailSelection(emailId, checked) {
    if (checked) {
        selectedEmails.add(emailId);
    } else {
        selectedEmails.delete(emailId);
    }
    updateSelectionActions();
}

function toggleStar(emailId) {
    const email = currentEmails.find(e => e.id === emailId);
    if (email) {
        email.starred = !email.starred;
        renderEmails();
        showToast(email.starred ? 'Додано до зірок' : 'Видалено з зірок', 'success');
    }
}

function updateSelectionActions() {
    const hasSelection = selectedEmails.size > 0;
    const actionBtns = document.querySelectorAll('.action-group .action-btn:not(#selectAllBtn)');
    
    actionBtns.forEach(btn => {
        btn.disabled = !hasSelection;
    });
    
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
        const allEmails = document.querySelectorAll('.email');
        const allSelected = allEmails.length > 0 && selectedEmails.size === allEmails.length;
        selectAllBtn.innerHTML = allSelected ? 
            '<i class="fas fa-minus-square"></i>' : 
            '<i class="fas fa-check-square"></i>';
    }
}

function updateEmailCounts() {
    const inboxCount = currentEmails.filter(e => e.folder === 'inbox' && !e.read).length;
    const importantCount = currentEmails.filter(e => e.important).length;
    const totalCount = currentEmails.filter(e => e.folder === 'inbox').length;
    const unreadCount = currentEmails.filter(e => !e.read).length;
    
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
    
    // Оновлення статистики
    const totalEmailsElement = document.getElementById('totalEmails');
    const unreadEmailsElement = document.getElementById('unreadEmails');
    const importantEmailsElement = document.getElementById('importantEmails');
    
    if (totalEmailsElement) totalEmailsElement.textContent = totalCount;
    if (unreadEmailsElement) unreadEmailsElement.textContent = unreadCount;
    if (importantEmailsElement) importantEmailsElement.textContent = importantCount;
}

function showEmailDetails(email) {
    const reader = document.getElementById('reader');
    const readerTitle = document.getElementById('readerTitle');
    const readerSender = document.getElementById('readerSender');
    const readerSenderEmail = document.getElementById('readerSenderEmail');
    const readerDate = document.getElementById('readerDate');
    const readerSubject = document.getElementById('readerSubject');
    const readerText = document.getElementById('readerText');
    const readerAvatar = document.getElementById('readerAvatar');
    const starBtn = document.getElementById('starBtn');
    
    if (!reader || !readerTitle) return;
    
    // Оновлення даних
    readerTitle.textContent = email.subject;
    readerSender.textContent = email.fromName || email.from;
    readerSenderEmail.textContent = email.from;
    
    const dateElement = readerDate.querySelector('span');
    if (dateElement) dateElement.textContent = formatDate(email.date);
    
    readerSubject.textContent = email.subject;
    readerText.innerHTML = `<p>${email.body}</p>`;
    
    if (readerAvatar) {
        const avatarText = (email.fromName || email.from).charAt(0).toUpperCase();
        readerAvatar.textContent = avatarText;
    }
    
    if (starBtn) {
        starBtn.innerHTML = email.starred ? 
            '<i class="fas fa-star"></i>' : 
            '<i class="far fa-star"></i>';
        starBtn.dataset.id = email.id;
    }
    
    // Позначити як прочитаний
    if (!email.read) {
        email.read = true;
        renderEmails();
    }
    
    // На мобільних пристроях показуємо тільки переглядач
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'none';
        reader.style.display = 'flex';
    }
}

/* ====================== ДОПОМІЖНІ ФУНКЦІЇ ====================== */
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
        toast.remove();
    }, 3000);
}

function resetAllForms() {
    ['loginForm', 'registerForm', 'resetForm'].forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = '';
            });
        }
    });
    
    clearAllErrors();
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.innerHTML = '';
    });
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }
}

/* ====================== СЛУХАЧІ ПОДІЙ ====================== */
function setupEventListeners() {
    setupAuthForms();
    setupLogout();
    setupModals();
    setupMenu();
    setupCompose();
    setupSearch();
    setupThemes();
    setupLanguages();
    setupEmailActions();
    setupFolderSelection();
    setupFilters();
    setupViewToggle();
    setupSettings();
}

function setupAuthForms() {
    // Перемикання форм
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
    document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
    
    // Реєстрація
    document.getElementById('registerBtn')?.addEventListener('click', handleRegister);
    
    // Відновлення пароля
    document.getElementById('sendResetBtn')?.addEventListener('click', handleResetPassword);
    
    // Сила пароля
    const passwordInput = document.getElementById('registerPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener('input', () => {
            const strength = checkPasswordStrength(passwordInput.value);
            passwordStrength.className = 'password-strength';
            
            if (passwordInput.value.length === 0) return;
            
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
    ['loginForm', 'registerForm', 'resetForm'].forEach(formId => {
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
    ['loginForm', 'registerForm', 'resetForm'].forEach(id => {
        const form = document.getElementById(id);
        if (form) {
            form.style.display = id === formId ? 'block' : 'none';
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
    
    if (!authService) {
        showError('loginEmailError', 'Сервіс не доступний');
        return;
    }
    
    try {
        const result = await authService.login(email, password);
        
        if (result.success) {
            showToast('Успішний вхід!', 'success');
        } else {
            showError('loginEmailError', result.error);
        }
    } catch (error) {
        showError('loginEmailError', 'Помилка сервера');
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName')?.value.trim();
    const email = document.getElementById('registerEmail')?.value.trim();
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('registerConfirm')?.value;
    
    clearAllErrors();
    
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
    
    if (!authService) {
        showError('registerEmailError', 'Сервіс не доступний');
        return;
    }
    
    try {
        const result = await authService.register(email, password, name);
        
        if (result.success) {
            showToast('Акаунт створено!', 'success');
        } else {
            showError('registerEmailError', result.error);
        }
    } catch (error) {
        showError('registerEmailError', 'Помилка сервера');
    }
}

async function handleResetPassword() {
    const email = document.getElementById('resetEmail')?.value.trim();
    
    clearAllErrors();
    
    if (!email || !validateEmail(email)) {
        showError('resetEmailError', 'Введіть коректну електронну пошту');
        return;
    }
    
    if (!authService) {
        showError('resetEmailError', 'Сервіс не доступний');
        return;
    }
    
    try {
        const result = await authService.resetPassword(email);
        
        if (result.success) {
            showToast('Лист надіслано!', 'success');
            switchAuthForm('loginForm');
        } else {
            showError('resetEmailError', result.error);
        }
    } catch (error) {
        showError('resetEmailError', 'Помилка сервера');
    }
}

function setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Вийти з акаунту?')) {
            if (!authService) return;
            
            try {
                await authService.logout();
                showToast('Ви вийшли', 'success');
            } catch (error) {
                showToast('Помилка виходу', 'error');
            }
        }
    });
}

function setupModals() {
    // Композ
    const composeBtn = document.getElementById('composeBtn');
    const closeCompose = document.getElementById('closeCompose');
    const sendMailBtn = document.getElementById('sendMail');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    
    if (composeBtn) composeBtn.addEventListener('click', () => showModal('composeModal'));
    if (closeCompose) closeCompose.addEventListener('click', () => hideModal('composeModal'));
    
    if (sendMailBtn) {
        sendMailBtn.addEventListener('click', () => {
            const to = document.getElementById('mailTo').value;
            const subject = document.getElementById('mailSubject').value;
            const text = document.getElementById('mailText').value;
            const important = document.getElementById('urgentCheck').checked;
            
            if (!to || !subject || !text) {
                showToast('Заповніть всі поля', 'error');
                return;
            }
            
            const newEmail = {
                id: Date.now(),
                from: currentUser?.email || 'you@example.com',
                fromName: currentUser?.name || 'You',
                subject: subject,
                body: text,
                date: new Date(),
                read: true,
                important: important,
                attachments: 0,
                folder: 'sent',
                starred: false
            };
            
            currentEmails.unshift(newEmail);
            hideModal('composeModal');
            renderEmails();
            showToast('Лист надіслано!', 'success');
            
            // Очистити форму
            document.getElementById('mailTo').value = '';
            document.getElementById('mailSubject').value = '';
            document.getElementById('mailText').value = '';
            document.getElementById('urgentCheck').checked = false;
        });
    }
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            showToast('Чернетку збережено', 'success');
            hideModal('composeModal');
        });
    }
    
    // Налаштування
    const settingsBtn = document.getElementById('userSettingsBtn');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettingsBtn = document.getElementById('saveSettings');
    
    if (settingsBtn) settingsBtn.addEventListener('click', () => showModal('settingsModal'));
    if (closeSettings) closeSettings.addEventListener('click', () => hideModal('settingsModal'));
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const newName = document.getElementById('settingsName').value;
            const theme = document.getElementById('settingsTheme').value;
            
            if (newName && currentUser) {
                currentUser.name = newName;
                updateUserInterface(currentUser);
            }
            
            changeTheme(theme);
            hideModal('settingsModal');
            showToast('Налаштування збережено', 'success');
        });
    }
    
    // Перемикання вкладок налаштувань
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            // Приховати всі вкладки
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Видалити активний клас з усіх кнопок
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Показати активну вкладку
            tab.classList.add('active');
            document.getElementById(tabId + 'Tab')?.classList.add('active');
        });
    });
    
    // Закриття модальних вікон при кліку поза ними
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
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
        
        // Закриття меню при кліку поза ним
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
                performSearch(searchInput.value);
            } else {
                searchClear.style.display = 'none';
                renderEmails();
            }
        });
        
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            renderEmails();
            searchInput.focus();
        });
    }
}

function performSearch(term) {
    if (!term.trim()) return;
    
    const searchResults = currentEmails.filter(email => 
        email.subject.toLowerCase().includes(term.toLowerCase()) ||
        email.body.toLowerCase().includes(term.toLowerCase()) ||
        email.fromName.toLowerCase().includes(term.toLowerCase()) ||
        email.from.toLowerCase().includes(term.toLowerCase())
    );
    
    // Оновити список листів
    const emailsList = document.getElementById('emailsList');
    if (emailsList) {
        emailsList.innerHTML = '';
        
        if (searchResults.length === 0) {
            emailsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Нічого не знайдено</h3>
                    <p>Спробуйте інший пошуковий запит</p>
                </div>
            `;
            return;
        }
        
        searchResults.forEach((email) => {
            const emailElement = createEmailElement(email);
            emailsList.appendChild(emailElement);
        });
    }
}

function setupThemes() {
    const themeToggle = document.getElementById('themeToggle');
    const themeMenu = document.getElementById('themeMenu');
    
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
        
        // Зміна теми
        document.querySelectorAll('.theme-option').forEach(option => {
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
    
    // Оновлення селектора в налаштуваннях
    const settingsTheme = document.getElementById('settingsTheme');
    if (settingsTheme) {
        settingsTheme.value = theme;
    }
}

function setupLanguages() {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        const savedLang = localStorage.getItem('language') || 'ua';
        langSelect.value = savedLang;
        
        langSelect.addEventListener('change', () => {
            const lang = langSelect.value;
            localStorage.setItem('language', lang);
            showToast(`Мова змінена`, 'info');
        });
    }
}

function setupEmailActions() {
    // Виділити все
    document.getElementById('selectAllBtn')?.addEventListener('click', () => {
        const allEmails = document.querySelectorAll('.email');
        const allSelected = selectedEmails.size === allEmails.length;
        
        if (allSelected) {
            // Зняти виділення
            selectedEmails.clear();
            document.querySelectorAll('.email-select').forEach(checkbox => {
                checkbox.checked = false;
            });
        } else {
            // Виділити все
            currentEmails.forEach(email => {
                selectedEmails.add(email.id);
            });
            document.querySelectorAll('.email-select').forEach(checkbox => {
                checkbox.checked = true;
            });
        }
        
        updateSelectionActions();
    });
    
    // Позначити як прочитане
    document.getElementById('markReadBtn')?.addEventListener('click', () => {
        selectedEmails.forEach(emailId => {
            const email = currentEmails.find(e => e.id === emailId);
            if (email) email.read = true;
        });
        
        selectedEmails.clear();
        renderEmails();
        showToast('Позначено як прочитане', 'success');
    });
    
    // Архівувати
    document.getElementById('archiveBtn')?.addEventListener('click', () => {
        selectedEmails.forEach(emailId => {
            const email = currentEmails.find(e => e.id === emailId);
            if (email) email.folder = 'archive';
        });
        
        selectedEmails.clear();
        renderEmails();
        showToast('Переміщено в архів', 'success');
    });
    
    // Видалити
    document.getElementById('deleteSelectedBtn')?.addEventListener('click', () => {
        if (selectedEmails.size === 0) return;
        
        if (confirm(`Видалити ${selectedEmails.size} листів?`)) {
            selectedEmails.forEach(emailId => {
                const email = currentEmails.find(e => e.id === emailId);
                if (email) email.folder = 'trash';
            });
            
            selectedEmails.clear();
            renderEmails();
            showToast('Переміщено в кошик', 'success');
        }
    });
    
    // Оновити
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        loadEmails();
        showToast('Оновлено', 'info');
    });
    
    // Назад до списку
    document.getElementById('backToList')?.addEventListener('click', () => {
        const reader = document.getElementById('reader');
        const emails = document.querySelector('.emails');
        
        if (reader) reader.style.display = 'none';
        if (emails) emails.style.display = 'block';
    });
    
    // Зірочка в переглядачі
    document.getElementById('starBtn')?.addEventListener('click', () => {
        const emailId = parseInt(document.getElementById('starBtn').dataset.id);
        if (emailId) toggleStar(emailId);
    });
    
    // Видалити лист
    document.getElementById('deleteEmailBtn')?.addEventListener('click', () => {
        const emailId = parseInt(document.getElementById('starBtn').dataset.id);
        if (emailId) {
            const email = currentEmails.find(e => e.id === emailId);
            if (email) {
                email.folder = 'trash';
                renderEmails();
                showToast('Переміщено в кошик', 'success');
                
                // Повернутися до списку
                document.getElementById('backToList')?.click();
            }
        }
    });
    
    // AI Dismiss
    document.getElementById('aiDismiss')?.addEventListener('click', () => {
        document.getElementById('aiStatusBar').style.display = 'none';
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
            
            // Оновити листи
            selectedEmails.clear();
            renderEmails();
        });
    });
}

function setupFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderEmails();
        });
    });
    
    // Сортування
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            renderEmails();
        });
    }
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            
            // Оновити активну кнопку
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Змінити відображення листів
            const emailsList = document.getElementById('emailsList');
            if (emailsList) {
                emailsList.className = 'emails';
                emailsList.classList.add(`${view}-view`);
            }
        });
    });
}

function setupSettings() {
    // Допомога
    document.getElementById('helpBtn')?.addEventListener('click', () => {
        showToast('Допомога: Напишіть нам на support@inboxpro.com', 'info');
    });
}

/* ====================== ПОЧАТОК ====================== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM завантажено');
    
    // Показати форму входу
    switchAuthForm('loginForm');
    
    // Запустити ініціалізацію
    initializeApp();
    
    // Обробник помилок
    window.addEventListener('error', (event) => {
        console.error('Глобальна помилка:', event.error);
    });
});

// Додати CSS для додаткових класів
const style = document.createElement('style');
style.textContent = `
    .email.starred .email-action-btn.star-btn {
        color: #ffc107;
    }
    
    .email.starred .email-action-btn.star-btn i {
        color: #ffc107;
    }
    
    .list-view .email {
        display: flex;
        align-items: center;
        padding: 15px;
    }
    
    .grid-view .emails {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
    }
    
    .grid-view .email {
        flex-direction: column;
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 15px;
    }
    
    .grid-view .email-content {
        margin-top: 10px;
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    }
    
    .toast.success {
        border-left: 4px solid #48bb78;
    }
    
    .toast.error {
        border-left: 4px solid #f56565;
    }
    
    .toast.info {
        border-left: 4px solid #4299e1;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .tab-content {
        display: none;
    }
    
    .tab-content.active {
        display: block;
    }
    
    .theme-menu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 8px;
        z-index: 1000;
        min-width: 150px;
    }
    
    .theme-menu.show {
        display: block;
    }
    
    .user-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 8px;
        z-index: 1000;
        min-width: 200px;
    }
    
    .user-menu:hover .user-dropdown {
        display: block;
    }
`;
document.head.appendChild(style);
