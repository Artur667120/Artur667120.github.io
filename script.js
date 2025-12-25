// ====================== GLOBAL VARIABLES ======================
let emails = JSON.parse(localStorage.getItem('inboxProEmails')) || [];
let currentFolder = 'inbox';
let currentUserEmail = localStorage.getItem('userEmail') || '';
let currentUserName = localStorage.getItem('userName') || 'User';
let currentUserAvatarColor = localStorage.getItem('avatarColor') || '#667eea';
let currentSelectedEmail = null;
let emailIdCounter = parseInt(localStorage.getItem('emailIdCounter')) || 1;
let selectedEmails = new Set();
let currentLanguage = localStorage.getItem('language') || 'en';

// ====================== TRANSLATION SYSTEM ======================
const translations = {
    en: {
        // Login/Register
        welcomeBack: 'Welcome Back',
        emailAddress: 'Email Address',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        newUser: 'New user?',
        createAccount: 'Create account',
        fullName: 'Full Name',
        confirmPassword: 'Confirm Password',
        createAccountBtn: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        
        // App
        compose: 'Compose',
        inbox: 'Inbox',
        important: 'Important',
        sent: 'Sent',
        drafts: 'Drafts',
        spam: 'Spam',
        trash: 'Trash',
        labels: 'Labels',
        searchPlaceholder: 'Search emails...',
        emptyInbox: 'Inbox is empty',
        noEmails: 'No emails to display',
        selectEmail: 'Select an email',
        attachments: 'Attachments',
        emptyTrash: 'Empty Trash',
        quickReply: 'Quick Reply',
        print: 'Print',
        delete: 'Delete',
        view: 'View',
        download: 'Download',
        from: 'From',
        date: 'Date',
        
        // Modals
        userSettings: 'User Settings',
        newMail: 'New Message',
        toEmail: 'To',
        subject: 'Subject',
        message: 'Write your message here...',
        addAttachment: 'Add Attachment',
        send: 'Send',
        save: 'Save Changes',
        close: 'Close',
        cancel: 'Cancel',
        discard: 'Discard',
        
        // Messages
        emailSaved: 'Email saved successfully!',
        emailSent: 'Email sent successfully!',
        emailDeleted: 'Email moved to trash',
        trashEmptied: 'Trash emptied',
        confirmDelete: 'Delete this email?',
        confirmEmptyTrash: 'Empty trash? This action cannot be undone.',
        missingRecipient: 'Please enter recipient email',
        invalidEmail: 'Invalid email format',
        fileTooLarge: 'File is too large (max 5MB)',
        maxFiles: 'Maximum 5 files allowed',
        loginSuccess: 'Welcome back!',
        registerSuccess: 'Account created successfully!',
        loginError: 'Invalid email or password',
        registerError: 'Please fill all fields correctly',
        passwordMismatch: 'Passwords do not match',
        weakPassword: 'Password must be at least 8 characters with letters and numbers'
    },
    
    ua: {
        welcomeBack: 'Ласкаво просимо',
        emailAddress: 'Електронна адреса',
        password: 'Пароль',
        rememberMe: 'Запам\'ятати мене',
        forgotPassword: 'Забули пароль?',
        signIn: 'Увійти',
        newUser: 'Новий користувач?',
        createAccount: 'Створити акаунт',
        fullName: 'Повне ім\'я',
        confirmPassword: 'Підтвердіть пароль',
        createAccountBtn: 'Створити акаунт',
        alreadyHaveAccount: 'Вже маєте акаунт?',
        
        compose: 'Створити',
        inbox: 'Вхідні',
        important: 'Важливі',
        sent: 'Надіслані',
        drafts: 'Чернетки',
        spam: 'Спам',
        trash: 'Кошик',
        labels: 'Мітки',
        searchPlaceholder: 'Пошук листів...',
        emptyInbox: 'Вхідні порожні',
        noEmails: 'Листів немає',
        selectEmail: 'Виберіть лист',
        attachments: 'Вкладення',
        emptyTrash: 'Очистити кошик',
        quickReply: 'Швидка відповідь',
        print: 'Друк',
        delete: 'Видалити',
        view: 'Переглянути',
        download: 'Скачати',
        from: 'Від',
        date: 'Дата',
        
        userSettings: 'Налаштування',
        newMail: 'Новий лист',
        toEmail: 'Кому',
        subject: 'Тема',
        message: 'Напишіть ваше повідомлення...',
        addAttachment: 'Додати файл',
        send: 'Надіслати',
        save: 'Зберегти зміни',
        close: 'Закрити',
        cancel: 'Скасувати',
        discard: 'Скасувати',
        
        emailSaved: 'Email збережено!',
        emailSent: 'Лист надіслано!',
        emailDeleted: 'Лист переміщено в кошик',
        trashEmptied: 'Кошик очищено',
        confirmDelete: 'Видалити цей лист?',
        confirmEmptyTrash: 'Очистити кошик? Цю дію не можна скасувати.',
        missingRecipient: 'Введіть адресу отримувача',
        invalidEmail: 'Невірний формат email',
        fileTooLarge: 'Файл занадто великий (макс. 5MB)',
        maxFiles: 'Максимум 5 файлів',
        loginSuccess: 'Ласкаво просимо!',
        registerSuccess: 'Акаунт успішно створено!',
        loginError: 'Невірний email або пароль',
        registerError: 'Заповніть всі поля правильно',
        passwordMismatch: 'Паролі не співпадають',
        weakPassword: 'Пароль має бути щонайменше 8 символів з літерами та цифрами'
    },
    
    ru: {
        welcomeBack: 'Добро пожаловать',
        emailAddress: 'Электронная почта',
        password: 'Пароль',
        rememberMe: 'Запомнить меня',
        forgotPassword: 'Забыли пароль?',
        signIn: 'Войти',
        newUser: 'Новый пользователь?',
        createAccount: 'Создать аккаунт',
        fullName: 'Полное имя',
        confirmPassword: 'Подтвердите пароль',
        createAccountBtn: 'Создать аккаунт',
        alreadyHaveAccount: 'Уже есть аккаунт?',
        
        compose: 'Создать',
        inbox: 'Входящие',
        important: 'Важные',
        sent: 'Отправленные',
        drafts: 'Черновики',
        spam: 'Спам',
        trash: 'Корзина',
        labels: 'Метки',
        searchPlaceholder: 'Поиск писем...',
        emptyInbox: 'Входящие пусты',
        noEmails: 'Писем нет',
        selectEmail: 'Выберите письмо',
        attachments: 'Вложения',
        emptyTrash: 'Очистить корзину',
        quickReply: 'Быстрый ответ',
        print: 'Печать',
        delete: 'Удалить',
        view: 'Просмотреть',
        download: 'Скачать',
        from: 'От',
        date: 'Дата',
        
        userSettings: 'Настройки',
        newMail: 'Новое сообщение',
        toEmail: 'Кому',
        subject: 'Тема',
        message: 'Напишите ваше сообщение...',
        addAttachment: 'Добавить файл',
        send: 'Отправить',
        save: 'Сохранить изменения',
        close: 'Закрыть',
        cancel: 'Отменить',
        discard: 'Отменить',
        
        emailSaved: 'Email сохранен!',
        emailSent: 'Письмо отправлено!',
        emailDeleted: 'Письмо перемещено в корзину',
        trashEmptied: 'Корзина очищена',
        confirmDelete: 'Удалить это письмо?',
        confirmEmptyTrash: 'Очистить корзину? Это действие нельзя отменить.',
        missingRecipient: 'Введите адрес получателя',
        invalidEmail: 'Неверный формат email',
        fileTooLarge: 'Файл слишком большой (макс. 5MB)',
        maxFiles: 'Максимум 5 файлов',
        loginSuccess: 'Добро пожаловать!',
        registerSuccess: 'Аккаунт успешно создан!',
        loginError: 'Неверный email или пароль',
        registerError: 'Заполните все поля правильно',
        passwordMismatch: 'Пароли не совпадают',
        weakPassword: 'Пароль должен быть не менее 8 символов с буквами и цифрами'
    },
    
    de: {
        welcomeBack: 'Willkommen zurück',
        emailAddress: 'E-Mail-Adresse',
        password: 'Passwort',
        rememberMe: 'Angemeldet bleiben',
        forgotPassword: 'Passwort vergessen?',
        signIn: 'Anmelden',
        newUser: 'Neuer Benutzer?',
        createAccount: 'Konto erstellen',
        fullName: 'Vollständiger Name',
        confirmPassword: 'Passwort bestätigen',
        createAccountBtn: 'Konto erstellen',
        alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
        
        compose: 'Verfassen',
        inbox: 'Posteingang',
        important: 'Wichtig',
        sent: 'Gesendet',
        drafts: 'Entwürfe',
        spam: 'Spam',
        trash: 'Papierkorb',
        labels: 'Labels',
        searchPlaceholder: 'E-Mails suchen...',
        emptyInbox: 'Posteingang ist leer',
        noEmails: 'Keine E-Mails vorhanden',
        selectEmail: 'Wählen Sie eine E-Mail',
        attachments: 'Anhänge',
        emptyTrash: 'Papierkorb leeren',
        quickReply: 'Schnelle Antwort',
        print: 'Drucken',
        delete: 'Löschen',
        view: 'Ansehen',
        download: 'Herunterladen',
        from: 'Von',
        date: 'Datum',
        
        userSettings: 'Benutzereinstellungen',
        newMail: 'Neue Nachricht',
        toEmail: 'An',
        subject: 'Betreff',
        message: 'Schreiben Sie Ihre Nachricht...',
        addAttachment: 'Anhang hinzufügen',
        send: 'Senden',
        save: 'Änderungen speichern',
        close: 'Schließen',
        cancel: 'Abbrechen',
        discard: 'Verwerfen',
        
        emailSaved: 'E-Mail gespeichert!',
        emailSent: 'E-Mail gesendet!',
        emailDeleted: 'E-Mail in Papierkorb verschoben',
        trashEmptied: 'Papierkorb geleert',
        confirmDelete: 'Diese E-Mail löschen?',
        confirmEmptyTrash: 'Papierkorb leeren? Diese Aktion kann nicht rückgängig gemacht werden.',
        missingRecipient: 'Bitte geben Sie die Empfänger-E-Mail ein',
        invalidEmail: 'Ungültiges E-Mail-Format',
        fileTooLarge: 'Datei ist zu groß (max. 5MB)',
        maxFiles: 'Maximal 5 Dateien erlaubt',
        loginSuccess: 'Willkommen zurück!',
        registerSuccess: 'Konto erfolgreich erstellt!',
        loginError: 'Ungültige E-Mail oder Passwort',
        registerError: 'Bitte füllen Sie alle Felder korrekt aus',
        passwordMismatch: 'Passwörter stimmen nicht überein',
        weakPassword: 'Passwort muss mindestens 8 Zeichen mit Buchstaben und Zahlen enthalten'
    }
};

// ====================== DOM ELEMENTS ======================
const elements = {
    // Login elements
    loginScreen: document.getElementById('loginScreen'),
    app: document.getElementById('app'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    registerName: document.getElementById('registerName'),
    registerEmail: document.getElementById('registerEmail'),
    registerPassword: document.getElementById('registerPassword'),
    registerConfirm: document.getElementById('registerConfirm'),
    
    // App elements
    menuToggle: document.getElementById('menuToggle'),
    sidebar: document.getElementById('sidebar'),
    themeToggle: document.getElementById('themeToggle'),
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    composeBtn: document.getElementById('composeBtn'),
    inboxCount: document.getElementById('inboxCount'),
    draftsCount: document.getElementById('draftsCount'),
    spamCount: document.getElementById('spamCount'),
    trashCount: document.getElementById('trashCount'),
    currentFolder: document.getElementById('currentFolder'),
    emailCount: document.getElementById('emailCount'),
    unreadCount: document.getElementById('unreadCount'),
    emailsList: document.getElementById('emailsList'),
    reader: document.getElementById('reader'),
    readerTitle: document.getElementById('readerTitle'),
    readerAvatar: document.getElementById('readerAvatar'),
    readerSender: document.getElementById('readerSender'),
    readerSenderEmail: document.getElementById('readerSenderEmail'),
    readerSubject: document.getElementById('readerSubject'),
    readerDate: document.getElementById('readerDate'),
    readerText: document.getElementById('readerText'),
    readerFiles: document.getElementById('readerFiles'),
    attachmentsList: document.getElementById('attachmentsList'),
    backToList: document.getElementById('backToList'),
    deleteEmailBtn: document.getElementById('deleteEmailBtn'),
    emptyTrashBtn: document.getElementById('emptyTrashBtn'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    markReadBtn: document.getElementById('markReadBtn'),
    deleteSelectedBtn: document.getElementById('deleteSelectedBtn'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    refreshBtn: document.getElementById('refreshBtn'),
    
    // Modal elements
    settingsModal: document.getElementById('settingsModal'),
    composeModal: document.getElementById('composeModal'),
    imageModal: document.getElementById('imageModal'),
    closeSettings: document.getElementById('closeSettings'),
    saveSettings: document.getElementById('saveSettings'),
    editName: document.getElementById('editName'),
    editEmail: document.getElementById('editEmail'),
    closeCompose: document.getElementById('closeCompose'),
    sendMail: document.getElementById('sendMail'),
    mailTo: document.getElementById('mailTo'),
    mailSubject: document.getElementById('mailSubject'),
    mailText: document.getElementById('mailText'),
    mailFile: document.getElementById('mailFile'),
    filePreview: document.getElementById('filePreview'),
    closeImage: document.getElementById('closeImage'),
    modalImage: document.getElementById('modalImage'),
    imageTitle: document.getElementById('imageTitle'),
    
    // Language
    langSelect: document.getElementById('langSelect'),
    
    // Toast container
    toastContainer: document.getElementById('toastContainer')
};

// ====================== INITIALIZATION ======================
function init() {
    loadUserData();
    applyLanguage();
    setupEventListeners();
    generateSampleEmails();
    updateUI();
    checkAutoLogin();
}

function loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        currentUserEmail = user.email;
        currentUserName = user.name;
        currentUserAvatarColor = user.avatarColor || '#667eea';
    }
}

function checkAutoLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (isLoggedIn && rememberMe) {
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');
        
        if (savedEmail && savedPassword) {
            elements.loginEmail.value = savedEmail;
            elements.loginPassword.value = savedPassword;
            performLogin(savedEmail, savedPassword);
        }
    }
}

// ====================== EVENT LISTENERS SETUP ======================
function setupEventListeners() {
    // Login/Register
    elements.showRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        elements.loginForm.style.display = 'none';
        elements.registerForm.style.display = 'block';
    });
    
    elements.showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        elements.registerForm.style.display = 'none';
        elements.loginForm.style.display = 'block';
    });
    
    elements.loginBtn?.addEventListener('click', handleLogin);
    elements.registerBtn?.addEventListener('click', handleRegister);
    
    // Menu toggle
    elements.menuToggle?.addEventListener('click', () => {
        elements.sidebar.classList.toggle('active');
    });
    
    // Theme toggle
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // Compose
    elements.composeBtn?.addEventListener('click', () => {
        openComposeModal();
    });
    
    // Folder navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const folder = item.dataset.folder;
            switchFolder(folder);
            
            // Update active state
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Email actions
    elements.backToList?.addEventListener('click', () => {
        elements.reader.classList.remove('active');
        if (window.innerWidth <= 768) {
            document.querySelector('.emails').style.display = 'block';
        }
    });
    
    elements.deleteEmailBtn?.addEventListener('click', deleteCurrentEmail);
    elements.emptyTrashBtn?.addEventListener('click', emptyTrash);
    elements.selectAllBtn?.addEventListener('click', toggleSelectAll);
    elements.markReadBtn?.addEventListener('click', markSelectedAsRead);
    elements.deleteSelectedBtn?.addEventListener('click', deleteSelectedEmails);
    
    // Search
    elements.searchInput?.addEventListener('input', handleSearch);
    elements.searchClear?.addEventListener('click', () => {
        elements.searchInput.value = '';
        handleSearch();
    });
    
    // Refresh
    elements.refreshBtn?.addEventListener('click', () => {
        updateUI();
        showToast('Refreshed', 'success');
    });
    
    // Modals
    elements.closeSettings?.addEventListener('click', () => {
        closeModal(elements.settingsModal);
    });
    
    elements.saveSettings?.addEventListener('click', saveSettings);
    
    elements.closeCompose?.addEventListener('click', () => {
        closeModal(elements.composeModal);
        clearComposeForm();
    });
    
    elements.sendMail?.addEventListener('click', sendEmail);
    
    elements.closeImage?.addEventListener('click', () => {
        closeModal(elements.imageModal);
    });
    
    // Settings button
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        openSettingsModal();
    });
    
    // File upload
    elements.mailFile?.addEventListener('change', handleFileUpload);
    
    // Language select
    elements.langSelect?.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        applyLanguage();
        updateUI();
    });
    
    // Quick actions
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            handleQuickAction(action);
        });
    });
    
    // Click outside to close sidebar on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle') &&
            elements.sidebar.classList.contains('active')) {
            elements.sidebar.classList.remove('active');
        }
    });
}

// ====================== LOGIN/REGISTER FUNCTIONS ======================
function handleLogin() {
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showToast(translations[currentLanguage].loginError, 'error');
        return;
    }
    
    performLogin(email, password, rememberMe);
}

function performLogin(email, password, rememberMe = false) {
    // In a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }
        
        currentUserEmail = user.email;
        currentUserName = user.name;
        currentUserAvatarColor = user.avatarColor || '#667eea';
        
        // Switch to app
        elements.loginScreen.style.display = 'none';
        elements.app.style.display = 'block';
        
        showToast(translations[currentLanguage].loginSuccess, 'success');
        updateUI();
    } else {
        showToast(translations[currentLanguage].loginError, 'error');
    }
}

function handleRegister() {
    const name = elements.registerName.value.trim();
    const email = elements.registerEmail.value.trim();
    const password = elements.registerPassword.value;
    const confirm = elements.registerConfirm.value;
    
    // Validation
    if (!name || !email || !password || !confirm) {
        showToast(translations[currentLanguage].registerError, 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast(translations[currentLanguage].passwordMismatch, 'error');
        return;
    }
    
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        showToast(translations[currentLanguage].weakPassword, 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast(translations[currentLanguage].invalidEmail, 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        showToast('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In real app, this should be hashed!
        avatarColor: '#667eea',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    performLogin(email, password);
    
    showToast(translations[currentLanguage].registerSuccess, 'success');
}

// ====================== EMAIL FUNCTIONS ======================
function generateSampleEmails() {
    if (emails.length > 0) return;
    
    const sampleEmails = [
        {
            id: emailIdCounter++,
            from: 'support@inboxpro.com',
            fromName: 'Inbox Pro Support',
            to: currentUserEmail,
            subject: 'Welcome to Inbox Pro!',
            body: 'Welcome to Inbox Pro, your new smart email client! We\'re excited to have you on board.\n\nHere are some tips to get started:\n1. Click "Compose" to write a new email\n2. Use the sidebar to navigate between folders\n3. Try the AI features for smart email organization\n4. Customize your theme in settings\n\nIf you have any questions, feel free to reply to this email.\n\nBest regards,\nThe Inbox Pro Team',
            date: new Date(Date.now() - 3600000).toISOString(),
            folder: 'inbox',
            read: false,
            important: true,
            attachments: []
        },
        {
            id: emailIdCounter++,
            from: 'news@technews.com',
            fromName: 'Tech News Daily',
            to: currentUserEmail,
            subject: 'Latest Tech Updates',
            body: 'Here are today\'s top tech stories:\n\n1. AI breakthrough in natural language processing\n2. New smartphone with foldable display announced\n3. Cybersecurity threats on the rise\n4. Cloud computing trends for 2024\n\nRead more on our website!',
            date: new Date(Date.now() - 7200000).toISOString(),
            folder: 'inbox',
            read: false,
            important: false,
            attachments: []
        },
        {
            id: emailIdCounter++,
            from: 'billing@services.com',
            fromName: 'Service Billing',
            to: currentUserEmail,
            subject: 'Your monthly invoice',
            body: 'Dear customer,\n\nYour monthly invoice for January 2024 is now available.\n\nAmount: $49.99\nDue date: February 15, 2024\n\nPlease log in to your account to view and pay the invoice.\n\nThank you for your business!',
            date: new Date(Date.now() - 86400000).toISOString(),
            folder: 'inbox',
            read: true,
            important: false,
            attachments: [
                { name: 'invoice_january.pdf', size: '245 KB', type: 'pdf' }
            ]
        },
        {
            id: emailIdCounter++,
            from: 'travel@agency.com',
            fromName: 'Travel Agency',
            to: currentUserEmail,
            subject: 'Your booking confirmation',
            body: 'Your flight and hotel booking has been confirmed!\n\nFlight: New York to Paris\nDate: March 15, 2024\n\nHotel: Luxury Hotel Paris\nCheck-in: March 15, 2024\nCheck-out: March 22, 2024\n\nPlease find attached your booking details.',
            date: new Date(Date.now() - 172800000).toISOString(),
            folder: 'inbox',
            read: true,
            important: true,
            attachments: [
                { name: 'flight_tickets.pdf', size: '512 KB', type: 'pdf' },
                { name: 'hotel_confirmation.pdf', size: '310 KB', type: 'pdf' }
            ]
        },
        {
            id: emailIdCounter++,
            from: 'noreply@social.com',
            fromName: 'Social Network',
            to: currentUserEmail,
            subject: 'Security alert: New login',
            body: 'We detected a new login to your account from:\n\nDevice: Chrome on Windows\nLocation: New York, USA\nTime: Today, 10:30 AM\n\nIf this was you, you can ignore this message. If not, please secure your account immediately.',
            date: new Date(Date.now() - 259200000).toISOString(),
            folder: 'inbox',
            read: true,
            important: true,
            attachments: []
        }
    ];
    
    emails.push(...sampleEmails);
    saveEmails();
    localStorage.setItem('emailIdCounter', emailIdCounter.toString());
}

function switchFolder(folder) {
    currentFolder = folder;
    selectedEmails.clear();
    updateUI();
    
    // Show/hide empty trash button
    elements.emptyTrashBtn.style.display = folder === 'trash' ? 'flex' : 'none';
    
    // Update folder icon in header
    const iconMap = {
        inbox: 'fa-inbox',
        important: 'fa-star',
        sent: 'fa-paper-plane',
        drafts: 'fa-file-alt',
        spam: 'fa-ban',
        trash: 'fa-trash'
    };
    
    const icon = iconMap[folder] || 'fa-inbox';
    elements.currentFolder.innerHTML = `<i class="fas ${icon}"></i> <span>${translations[currentLanguage][folder] || folder}</span>`;
}

function updateUI() {
    // Update user info
    elements.userName.textContent = currentUserName;
    elements.userEmail.textContent = currentUserEmail;
    elements.userAvatar.textContent = getInitials(currentUserName);
    elements.userAvatar.style.background = currentUserAvatarColor;
    
    // Update counts
    updateFolderCounts();
    
    // Display emails
    displayEmails();
    
    // Update reader if email is selected
    if (currentSelectedEmail) {
        const email = emails.find(e => e.id === currentSelectedEmail);
        if (email) {
            displayEmail(email);
        }
    }
}

function updateFolderCounts() {
    const inboxCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
    const draftsCount = emails.filter(e => e.folder === 'drafts').length;
    const spamCount = emails.filter(e => e.folder === 'spam').length;
    const trashCount = emails.filter(e => e.folder === 'trash').length;
    
    elements.inboxCount.textContent = inboxCount > 0 ? inboxCount : '';
    elements.draftsCount.textContent = draftsCount > 0 ? draftsCount : '';
    elements.spamCount.textContent = spamCount > 0 ? spamCount : '';
    elements.trashCount.textContent = trashCount > 0 ? trashCount : '';
    
    // Update folder stats
    const folderEmails = emails.filter(e => e.folder === currentFolder);
    const unreadInFolder = folderEmails.filter(e => !e.read).length;
    
    elements.emailCount.textContent = `${folderEmails.length} ${folderEmails.length === 1 ? 'email' : 'emails'}`;
    elements.unreadCount.textContent = `${unreadInFolder} unread`;
}

function displayEmails() {
    const container = elements.emailsList;
    const folderEmails = emails.filter(e => e.folder === currentFolder);
    
    if (folderEmails.length === 0) {
        container.innerHTML = `
            <div class="empty-state animate__animated animate__fadeIn">
                <i class="fas fa-inbox"></i>
                <h3 data-i18n="emptyInbox">${translations[currentLanguage].emptyInbox}</h3>
                <p data-i18n="noEmails">${translations[currentLanguage].noEmails}</p>
            </div>
        `;
        applyLanguage();
        return;
    }
    
    container.innerHTML = '';
    
    // Sort by date (newest first)
    folderEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    folderEmails.forEach((email, index) => {
        const emailElement = createEmailElement(email, index);
        container.appendChild(emailElement);
        
        // Animate with delay
        setTimeout(() => {
            emailElement.style.opacity = '1';
            emailElement.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function createEmailElement(email, index) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'} ${selectedEmails.has(email.id) ? 'selected' : ''}`;
    div.dataset.id = email.id;
    div.style.animationDelay = `${index * 50}ms`;
    
    const initials = getInitials(email.fromName || email.from);
    const date = formatDate(email.date);
    const preview = email.body.substring(0, 100) + (email.body.length > 100 ? '...' : '');
    
    div.innerHTML = `
        <div class="email-avatar" style="background: ${stringToColor(email.from)}">
            ${initials}
        </div>
        <div class="email-content">
            <div class="email-header">
                <div class="email-sender">${email.fromName || email.from}</div>
                <div class="email-date">${date}</div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${preview}</div>
        </div>
    `;
    
    div.addEventListener('click', (e) => {
        if (!e.target.closest('.email-actions')) {
            selectEmail(email.id);
            displayEmail(email);
            
            // Mark as read
            if (!email.read) {
                email.read = true;
                saveEmails();
                updateUI();
            }
        }
    });
    
    return div;
}

function displayEmail(email) {
    if (!email) {
        elements.readerTitle.textContent = translations[currentLanguage].selectEmail;
        elements.readerText.innerHTML = '<p>Select an email to read its content</p>';
        elements.readerFiles.style.display = 'none';
        return;
    }
    
    // Update reader view
    elements.readerTitle.textContent = email.subject;
    elements.readerAvatar.textContent = getInitials(email.fromName || email.from);
    elements.readerAvatar.style.background = stringToColor(email.from);
    elements.readerSender.textContent = email.fromName || email.from;
    elements.readerSenderEmail.textContent = email.from;
    elements.readerSubject.textContent = email.subject;
    elements.readerDate.textContent = formatDate(email.date, true);
    elements.readerText.innerHTML = email.body.replace(/\n/g, '<br>');
    
    // Show attachments if any
    if (email.attachments && email.attachments.length > 0) {
        elements.readerFiles.style.display = 'block';
        elements.attachmentsList.innerHTML = '';
        
        email.attachments.forEach(attachment => {
            const attachmentElement = createAttachmentElement(attachment);
            elements.attachmentsList.appendChild(attachmentElement);
        });
    } else {
        elements.readerFiles.style.display = 'none';
    }
    
    // Show reader on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'none';
        elements.reader.classList.add('active');
    }
    
    currentSelectedEmail = email.id;
}

function createAttachmentElement(attachment) {
    const div = document.createElement('div');
    div.className = 'attachment-item';
    
    const icon = getFileIcon(attachment.type || attachment.name.split('.').pop());
    
    div.innerHTML = `
        <div class="attachment-info">
            <i class="fas ${icon} attachment-icon"></i>
            <div class="attachment-details">
                <div class="attachment-name">${attachment.name}</div>
                <div class="attachment-size">${attachment.size}</div>
            </div>
        </div>
        <div class="attachment-actions">
            <button class="attachment-btn view" data-file="${attachment.name}">
                <i class="fas fa-eye"></i> ${translations[currentLanguage].view}
            </button>
            <button class="attachment-btn download" data-file="${attachment.name}">
                <i class="fas fa-download"></i> ${translations[currentLanguage].download}
            </button>
        </div>
    `;
    
    // Add event listeners for attachment buttons
    div.querySelector('.view').addEventListener('click', () => {
        if (isImageFile(attachment.name)) {
            openImagePreview(attachment.name, 'Sample image preview');
        } else {
            showToast('File preview not available for this file type', 'info');
        }
    });
    
    div.querySelector('.download').addEventListener('click', () => {
        showToast(`Downloading ${attachment.name}...`, 'info');
        // In a real app, this would trigger actual download
    });
    
    return div;
}

function selectEmail(id) {
    const email = emails.find(e => e.id === id);
    if (email) {
       
