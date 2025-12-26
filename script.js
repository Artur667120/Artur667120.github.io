/* ====================== СПРОЩЕНИЙ SCRIPT.JS ====================== */

// ГЛОБАЛЬНІ ЗМІННІ
let currentUser = null;
let authService = null;

// Функції з utils.js
function formatDate(dateString) {
    if (!dateString) return 'Невідомо';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) {
        return 'щойно';
    } else if (diffMins < 60) {
        return `${diffMins} хв тому`;
    } else if (diffHours < 24) {
        return `${diffHours} год тому`;
    } else {
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short'
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

/* ====================== ІНІЦІАЛІЗАЦІЯ ====================== */
async function initializeApp() {
    console.log('🚀 Ініціалізація Inbox Pro...');
    
    try {
        // Динамічний імпорт auth-service
        const authModule = await import('./auth-service.js');
        authService = authModule.authService;
        
        // Ініціалізація сервісу автентифікації
        if (authService) {
            authService.initAuthStateListener();
            
            authService.addAuthStateListener((user) => {
                handleAuthStateChange(user);
            });
        }
        
    } catch (error) {
        console.error('Помилка ініціалізації:', error);
    }
    
    // Приховати завантаження
    setTimeout(() => {
        const initialLoading = document.getElementById('initialLoading');
        if (initialLoading) {
            initialLoading.style.display = 'none';
        }
    }, 1000);
    
    // Налаштування слухачів
    setupEventListeners();
    
    console.log('✅ Inbox Pro ініціалізовано');
}

function handleAuthStateChange(user) {
    console.log('Зміна стану автентифікації:', user ? 'Користувач увійшов' : 'Користувач вийшов');
    
    currentUser = user;
    
    if (user) {
        showApp();
        updateUserInterface(user);
        showToast(`Вітаємо, ${user.name || user.email}!`, 'success');
        loadDemoEmails();
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
    
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) userName.textContent = user.name || user.email;
    if (userEmail) userEmail.textContent = user.email;
    if (userAvatar) {
        const firstLetter = (user.name || user.email).charAt(0).toUpperCase();
        userAvatar.textContent = firstLetter;
    }
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
            important: true
        },
        {
            id: 2,
            from: 'team@company.com',
            fromName: 'Команда проєкту',
            subject: 'Запланована зустріч',
            body: 'Нагадуємо про заплановану зустріч завтра о 14:00.',
            date: new Date(Date.now() - 3600000),
            read: true,
            important: true
        }
    ];
    
    emailsList.innerHTML = '';
    
    demoEmails.forEach((email) => {
        const emailElement = createEmailElement(email);
        emailsList.appendChild(emailElement);
    });
}

function createEmailElement(email) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'} ${email.important ? 'important' : ''}`;
    
    const avatarText = email.fromName ? email.fromName.charAt(0).toUpperCase() : '?';
    const date = formatDate(email.date);
    const preview = email.body.substring(0, 80) + (email.body.length > 80 ? '...' : '');
    
    div.innerHTML = `
        <div class="email-avatar">${avatarText}</div>
        <div class="email-content">
            <div class="email-header">
                <div class="email-sender">${email.fromName || email.from}</div>
                <div class="email-date">${date}</div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${preview}</div>
        </div>
    `;
    
    div.addEventListener('click', () => {
        showEmailDetails(email);
    });
    
    return div;
}

function showEmailDetails(email) {
    alert(`Email від: ${email.fromName}\nТема: ${email.subject}\n\n${email.body}`);
}

/* ====================== ДОПОМІЖНІ ФУНКЦІЇ ====================== */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
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
    const acceptTerms = document.getElementById('acceptTerms')?.checked;
    
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
    
    if (!acceptTerms) {
        showError('termsError', 'Прийміть умови використання');
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
    // Прості модальні вікна
    document.getElementById('privacyPolicyBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Privacy Policy content would be here');
    });
    
    document.getElementById('privacyBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Privacy Policy content would be here');
    });
    
    document.getElementById('termsBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Terms of Service content would be here');
    });
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
            document.getElementById('composeModal').style.display = 'flex';
        });
    }
    
    const closeCompose = document.getElementById('closeCompose');
    if (closeCompose) {
        closeCompose.addEventListener('click', () => {
            document.getElementById('composeModal').style.display = 'none';
        });
    }
    
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
            
            document.getElementById('composeModal').style.display = 'none';
            showToast('Лист надіслано (демо)', 'success');
            
            // Очистити форму
            document.getElementById('mailTo').value = '';
            document.getElementById('mailSubject').value = '';
            document.getElementById('mailText').value = '';
        });
    }
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
