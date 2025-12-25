/* ====================== КОНФІГУРАЦІЯ ====================== */

// EMAILJS CONFIG
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'afzWbZbh3EJiObFmK',
    SERVICE_ID: 'service_a3mpspb',
    TEMPLATE_ID: 'xftxq1o'
};

/* ====================== ГЛОБАЛЬНІ ЗМІННІ ====================== */
let currentUser = null;
let auth = null;
let db = null;
let unsubscribeEmails = null;
let currentFolder = 'inbox';
let isInitialized = false;

/* ====================== ІНІЦІАЛІЗАЦІЯ ====================== */
function initializeApp() {
    if (isInitialized) return;
    
    console.log('🚀 Ініціалізація Inbox Pro...');
    
    // Ініціалізація Firebase (вже в HTML)
    auth = window.firebaseAuth;
    db = window.firebaseFirestore;
    
    if (!auth || !db) {
        console.error('❌ Firebase не ініціалізовано');
        showToast('Помилка підключення до сервера', 'error');
        setTimeout(() => location.reload(), 3000);
        return;
    }
    
    // Ініціалізація EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS ініціалізовано');
    }
    
    // Налаштування слухачів подій
    setupEventListeners();
    
    // Перевірка стану автентифікації
    checkAuthState();
    
    isInitialized = true;
    console.log('✅ Inbox Pro ініціалізовано');
}

/* ====================== АВТЕНТИФІКАЦІЯ ====================== */
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        const initialLoading = document.getElementById('initialLoading');
        if (initialLoading) initialLoading.style.display = 'none';
        
        if (user) {
            // Користувач авторизований
            handleUserSignedIn(user);
        } else {
            // Користувач не авторизований
            handleUserSignedOut();
        }
    });
}

async function handleUserSignedIn(user) {
    console.log('✅ Користувач авторизований:', user.email);
    
    currentUser = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        emailVerified: user.emailVerified
    };
    
    // Оновлення профілю користувача
    await updateUserProfile(user.uid);
    
    // Завантаження додаткових даних користувача
    await loadUserProfile(user.uid);
    
    // Оновлення інтерфейсу
    updateUserInterface();
    
    // Показати головний додаток
    showApp();
    
    // Налаштування реального часу для листів
    setupRealtimeEmails();
    
    // Показати повідомлення про успішний вхід
    if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        showToast('Ласкаво просимо до Inbox Pro!', 'success');
    } else {
        showToast('З поверненням!', 'success');
    }
}

function handleUserSignedOut() {
    console.log('🔒 Користувач не авторизований');
    currentUser = null;
    
    // Зупинити слухач реального часу
    if (unsubscribeEmails) {
        unsubscribeEmails();
        unsubscribeEmails = null;
    }
    
    // Показати екран входу
    showLoginScreen();
}

async function registerUser(email, password, name) {
    try {
        showLoading('Реєстрація...');
        
        // Перевірка чи email вже існує
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            hideLoading();
            showError('registerEmailError', 'Ця електронна пошта вже використовується');
            return false;
        }
        
        // Створення користувача
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Оновлення профілю
        await userCredential.user.updateProfile({ displayName: name });
        
        // Збереження додаткових даних користувача
        await db.collection('users').doc(userCredential.user.uid).set({
            email: email.toLowerCase(),
            name: name,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            emailVerified: false,
            storageUsed: 0,
            plan: 'free',
            settings: {
                theme: 'dark',
                language: 'ua',
                notifications: true,
                autoSave: true
            },
            profile: {
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
                bio: '',
                location: '',
                website: ''
            }
        });
        
        // Відправлення листа з підтвердженням
        await sendVerificationEmail(userCredential.user);
        
        hideLoading();
        showToast('Акаунт успішно створено! Перевірте пошту для підтвердження.', 'success');
        
        // Автоматичний вхід після реєстрації
        await loginUser(email, password, true);
        
        return true;
    } catch (error) {
        hideLoading();
        handleAuthError(error, 'register');
        return false;
    }
}

async function loginUser(email, password, rememberMe) {
    try {
        showLoading('Вхід в систему...');
        
        // Налаштування персистентності сесії
        const persistence = rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION;
        
        await auth.setPersistence(persistence);
        
        // Авторизація
        await auth.signInWithEmailAndPassword(email, password);
        
        hideLoading();
        return true;
    } catch (error) {
        hideLoading();
        handleAuthError(error, 'login');
        return false;
    }
}

async function logoutUser() {
    try {
        showLoading('Вихід...');
        
        // Зупинити слухач реального часу
        if (unsubscribeEmails) {
            unsubscribeEmails();
            unsubscribeEmails = null;
        }
        
        // Вийти з системи
        await auth.signOut();
        
        // Очистити дані користувача
        currentUser = null;
        localStorage.removeItem('userPreferences');
        
        hideLoading();
        showToast('Ви успішно вийшли з системи', 'success');
        
        // Показати екран входу
        showLoginScreen();
    } catch (error) {
        console.error('Помилка виходу:', error);
        showToast('Помилка при виході з системи', 'error');
        hideLoading();
    }
}

async function sendPasswordResetEmail(email) {
    try {
        showLoading('Надсилання листа...');
        await auth.sendPasswordResetEmail(email);
        hideLoading();
        showToast('Лист для відновлення пароля надіслано на вашу пошту', 'success');
        return true;
    } catch (error) {
        hideLoading();
        handleAuthError(error, 'reset');
        return false;
    }
}

async function checkEmailExists(email) {
    try {
        const methods = await auth.fetchSignInMethodsForEmail(email);
        return methods.length > 0;
    } catch (error) {
        console.error('Помилка перевірки email:', error);
        return false;
    }
}

async function sendVerificationEmail(user) {
    try {
        await user.sendEmailVerification();
        console.log('Лист з підтвердженням надіслано');
    } catch (error) {
        console.error('Помилка відправлення листа з підтвердженням:', error);
    }
}

async function updateUserProfile(uid) {
    try {
        await db.collection('users').doc(uid).update({
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Помилка оновлення профілю:', error);
    }
}

async function loadUserProfile(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            currentUser = { ...currentUser, ...userData };
            
            // Застосування налаштувань користувача
            applyUserSettings(userData.settings);
            
            console.log('Профіль користувача завантажено:', currentUser);
        }
    } catch (error) {
        console.error('Помилка завантаження профілю:', error);
    }
}

function applyUserSettings(settings) {
    if (!settings) return;
    
    // Тема
    if (settings.theme) {
        document.body.className = `${settings.theme}-theme`;
        localStorage.setItem('theme', settings.theme);
    }
    
    // Мова
    if (settings.language) {
        const langSelect = document.getElementById('langSelect');
        if (langSelect) langSelect.value = settings.language;
        localStorage.setItem('language', settings.language);
    }
}

/* ====================== УПРАВЛІННЯ ЛИСТАМИ ====================== */
function setupRealtimeEmails() {
    if (!currentUser || !db) return;
    
    // Зупинити попередній слухач
    if (unsubscribeEmails) {
        unsubscribeEmails();
    }
    
    unsubscribeEmails = db.collection('emails')
        .where('userId', '==', currentUser.uid)
        .where('folder', '==', currentFolder)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .onSnapshot((snapshot) => {
            const emails = [];
            snapshot.forEach((doc) => {
                emails.push({ id: doc.id, ...doc.data() });
            });
            
            updateEmailsList(emails);
            updateEmailCounts(emails);
            
            console.log('Оновлено список листів:', emails.length);
        }, (error) => {
            console.error('Помилка підписки на листи:', error);
            showToast('Помилка синхронізації листів', 'error');
        });
}

async function getEmailsFromDatabase(folder = 'inbox', limit = 50) {
    try {
        if (!currentUser || !db) return [];
        
        let query = db.collection('emails')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(limit);
        
        if (folder !== 'all') {
            query = query.where('folder', '==', folder);
        }
        
        const snapshot = await query.get();
        const emails = [];
        
        snapshot.forEach((doc) => {
            emails.push({ id: doc.id, ...doc.data() });
        });
        
        return emails;
    } catch (error) {
        console.error('Помилка отримання листів:', error);
        showToast('Помилка завантаження листів', 'error');
        return [];
    }
}

async function saveEmailToDatabase(emailData) {
    try {
        if (!currentUser || !db) return null;
        
        const email = {
            ...emailData,
            userId: currentUser.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false,
            folder: 'sent',
            important: emailData.important || false,
            starred: false,
            labels: emailData.labels || [],
            attachments: emailData.attachments || []
        };
        
        const docRef = await db.collection('emails').add(email);
        
        // Оновлення статистики сховища
        const emailSize = JSON.stringify(email).length;
        await updateUserStorage(currentUser.uid, emailSize);
        
        console.log('Лист збережено з ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Помилка збереження листа:', error);
        throw error;
    }
}

async function updateUserStorage(uid, size) {
    try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
            const currentStorage = userDoc.data().storageUsed || 0;
            await userRef.update({
                storageUsed: currentStorage + size,
                updatedAt: new Date().toISOString()
            });
            
            updateStorageInfo();
        }
    } catch (error) {
        console.error('Помилка оновлення сховища:', error);
    }
}

async function sendRealEmail(emailData) {
    return new Promise((resolve, reject) => {
        if (typeof emailjs === 'undefined') {
            reject(new Error('EmailJS не завантажений'));
            return;
        }

        const templateParams = {
            from_name: emailData.fromName || currentUser?.name || 'Користувач Inbox Pro',
            from_email: emailData.fromEmail || currentUser?.email || 'noreply@inboxpro.com',
            to_email: emailData.toEmail,
            subject: emailData.subject,
            message: emailData.message,
            reply_to: emailData.replyTo || emailData.fromEmail || currentUser?.email
        };

        emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        )
        .then(async (response) => {
            console.log('Лист відправлено успішно:', response);
            
            // Збереження листа в базі даних
            try {
                await saveEmailToDatabase({
                    from: emailData.fromEmail || currentUser?.email,
                    to: emailData.toEmail,
                    subject: emailData.subject,
                    body: emailData.message,
                    cc: emailData.cc,
                    bcc: emailData.bcc,
                    important: emailData.important || false
                });
            } catch (dbError) {
                console.warn('Не вдалося зберегти лист в базу даних:', dbError);
            }
            
            resolve(response);
        })
        .catch((error) => {
            console.error('Помилка відправлення листа:', error);
            reject(error);
        });
    });
}

async function updateEmailStatus(emailId, updates) {
    try {
        await db.collection('emails').doc(emailId).update({
            ...updates,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Помилка оновлення листа:', error);
        return false;
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
        updateEmailStatus(email.id, { read: true });
        div.classList.remove('unread');
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
    const unreadBadge = document.getElementById('unreadCount');
    
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

function formatDate(dateString) {
    if (!dateString) return 'Невідомо';
    
    const date = new Date(dateString);
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

function pluralize(number, one, few, many) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return one;
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return few;
    } else {
        return many;
    }
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
    
    return strength;
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
        
        await loginUser(email, password, rememberMe);
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
        
        await registerUser(email, password, name);
    });
    
    // Відновлення пароля
    document.getElementById('sendResetBtn')?.addEventListener('click', async () => {
        const email = document.getElementById('resetEmail').value.trim();
        
        clearAllErrors();
        
        if (!validateEmail(email)) {
            showError('resetEmailError', 'Введіть коректну електронну пошту');
            return;
        }
        
        await sendPasswordResetEmail(email);
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
            
            if (strength <= 1) {
                passwordStrength.classList.add('weak');
            } else if (strength <= 2) {
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
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Ви дійсно хочете вийти з акаунту?')) {
            logoutUser();
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
            const lang = langSelect.value;
            localStorage.setItem('language', lang);
            showToast('Мову змінено. Оновіть сторінку для застосування змін.', 'info');
        });
    }
}

function setupCompose() {
    const composeBtn = document.getElementById('composeBtn');
    const composeModal = document.getElementById('composeModal');
    const closeCompose = document.getElementById('closeCompose');
    const sendMailBtn = document.getElementById('sendMail');
    const discardBtn = document.getElementById('discardBtn');
    
    if (!composeBtn || !composeModal) return;
    
    composeBtn.addEventListener('click', () => {
        showModal('composeModal');
        setTimeout(() => {
            document.getElementById('mailTo')?.focus();
        }, 100);
    });
    
    closeCompose?.addEventListener('click', () => {
        hideModal('composeModal');
        clearComposeForm();
    });
    
    sendMailBtn?.addEventListener('click', async () => {
        const toEmail = document.getElementById('mailTo')?.value.trim();
        const subject = document.getElementById('mailSubject')?.value.trim();
        const message = document.getElementById('mailText')?.value.trim();
        
        if (!toEmail || !subject || !message) {
            showToast('Будь ласка, заповніть всі обов\'язкові поля', 'error');
            return;
        }
        
        if (!validateEmail(toEmail)) {
            showToast('Невірний email одержувача', 'error');
            return;
        }
        
        try {
            sendMailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
            sendMailBtn.disabled = true;
            
            const emailData = {
                fromName: currentUser?.name || 'Користувач Inbox Pro',
                fromEmail: currentUser?.email || '',
                toEmail: toEmail,
                subject: subject,
                message: message,
                important: document.getElementById('urgentCheck')?.checked || false
            };
            
            await sendRealEmail(emailData);
            
            showToast('Лист успішно відправлено!', 'success');
            hideModal('composeModal');
            clearComposeForm();
            
        } catch (error) {
            console.error('Помилка відправки:', error);
            showToast('Помилка відправки листа: ' + (error.text || error.message), 'error');
        } finally {
            sendMailBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Надіслати';
            sendMailBtn.disabled = false;
        }
    });
    
    discardBtn?.addEventListener('click', () => {
        if (confirm('Ви дійсно хочете скасувати написання листа? Всі зміни будуть втрачені.')) {
            clearComposeForm();
            hideModal('composeModal');
        }
    });
}

function setupFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            // Тут можна додати логіку фільтрації листів
        });
    });
    
    const filterToggle = document.getElementById('filterToggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            showToast('Додаткові фільтри скоро будуть доступні', 'info');
        });
    }
}

function setupFolderSelection() {
    const menuItems = document.querySelectorAll('.menu-item[data-folder]');
    menuItems.forEach(item => {
        item.addEventListener('click', async () => {
            const folder = item.dataset.folder;
            
            // Оновлення активного елемента меню
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Оновлення поточної папки
            currentFolder = folder;
            
            // Оновлення заголовка
            const folderTitle = document.getElementById('currentFolder');
            if (folderTitle) {
                const iconMap = {
                    inbox: 'fa-inbox',
                    important: 'fa-star',
                    sent: 'fa-paper-plane',
                    drafts: 'fa-file-alt',
                    spam: 'fa-ban',
                    trash: 'fa-trash'
                };
                
                const folderName = item.querySelector('span')?.textContent || 'Папка';
                const icon = iconMap[folder] || 'fa-folder';
                
                folderTitle.innerHTML = `<i class="fas ${icon}"></i> <span>${folderName}</span>`;
            }
            
            // Показати/сховати кнопку очищення кошика
            const emptyTrashBtn = document.getElementById('emptyTrashBtn');
            if (emptyTrashBtn) {
                emptyTrashBtn.style.display = folder === 'trash' ? 'flex' : 'none';
            }
            
            // Перезавантажити листи
            if (unsubscribeEmails) {
                unsubscribeEmails();
                unsubscribeEmails = null;
            }
            
            // Завантажити листи для нової папки
            const emails = await getEmailsFromDatabase(folder, 50);
            updateEmailsList(emails);
            updateEmailCounts(emails);
            
            // Налаштувати слухач реального часу для нової папки
            setupRealtimeEmails();
        });
    });
}

function setupEmailReader() {
    const backToList = document.getElementById('backToList');
    if (backToList) {
        backToList.addEventListener('click', () => {
            document.querySelector('.emails').style.display = 'flex';
            document.getElementById('reader').style.display = 'none';
            backToList.style.display = 'none';
        });
    }
}

function setupGlobalEvents() {
    // Оновлення при зміні розміру вікна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.querySelector('.emails').style.display = 'flex';
            document.getElementById('reader').style.display = 'flex';
            const backBtn = document.getElementById('backToList');
            if (backBtn) backBtn.style.display = 'none';
        }
    });
    
    // Статус підключення до мережі
    window.addEventListener('online', () => {
        showToast('Підключення до інтернету відновлено', 'success');
        document.getElementById('statusText').textContent = 'All systems operational';
    });
    
    window.addEventListener('offline', () => {
        showToast('Втрачено підключення до інтернету', 'warning');
        document.getElementById('statusText').textContent = 'Connection lost';
    });
    
    // Обробка глобальних помилок
    window.addEventListener('error', (event) => {
        console.error('Глобальна помилка:', event.error);
        showToast('Сталася несподівана помилка', 'error');
    });
}

/* ====================== ДОПОМІЖНІ ФУНКЦІЇ ІНТЕРФЕЙСУ ====================== */
function switchAuthForm(formId) {
    const forms = ['loginForm', 'registerForm', 'resetForm'];
    forms.forEach(id => {
        const form = document.getElementById(id);
        if (form) {
            if (id === formId) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        }
    });
    clearAllErrors();
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
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

function changeTheme(theme) {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
    
    // Оновлення активної опції в меню
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function performSearch(query) {
    if (!query.trim()) return;
    
    showToast(`Пошук: "${query}"`, 'info');
    // Тут можна додати логіку пошуку листів
}

function initializeAppInterface() {
    // Завантажити початкові листи
    loadInitialEmails();
    
    // Налаштувати сортування
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            showToast('Сортування змінено', 'info');
            // Тут можна додати логіку сортування
        });
    }
    
    // Налаштувати вибір розміру сторінки
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', () => {
            showToast('Кількість листів на сторінці змінено', 'info');
            // Тут можна додати логіку пагінації
        });
    }
}

async function loadInitialEmails() {
    showLoading('Завантаження листів...');
    try {
        const emails = await getEmailsFromDatabase('inbox', 20);
        updateEmailsList(emails);
        updateEmailCounts(emails);
    } catch (error) {
        console.error('Помилка завантаження листів:', error);
        showToast('Помилка завантаження листів', 'error');
    } finally {
        hideLoading();
    }
}

/* ====================== ЗАПУСК ДОДАТКУ ====================== */
document.addEventListener('DOMContentLoaded', initializeApp);

// Експорт функцій для глобального використання
window.InboxPro = {
    logout: logoutUser,
    showToast: showToast,
    getCurrentUser: () => currentUser
};
