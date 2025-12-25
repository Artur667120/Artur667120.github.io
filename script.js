// ====================== GLOBAL VARIABLES ======================
let emails = [];
let currentFolder = 'inbox';
let currentUser = null;
let currentSelectedEmail = null;
let selectedEmails = new Set();
let currentLanguage = localStorage.getItem('language') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

// ====================== TRANSLATION SYSTEM ======================
const translations = {
    en: {
        // Login/Register
        subtitle: "Smart email client with AI features",
        welcomeBack: "Welcome Back",
        emailAddress: "Email Address",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        signIn: "Sign In",
        newUser: "New user?",
        createAccount: "Create account",
        fullName: "Full Name",
        confirmPassword: "Confirm Password",
        createAccountBtn: "Create Account",
        alreadyHaveAccount: "Already have an account?",
        aiFilter: "AI Spam Filter",
        smartSorting: "Smart Sorting",
        securePrivate: "Secure & Private",
        
        // App
        online: "Online",
        compose: "Compose",
        inbox: "Inbox",
        important: "Important",
        sent: "Sent",
        drafts: "Drafts",
        spam: "Spam",
        trash: "Trash",
        labels: "Labels",
        searchPlaceholder: "Search emails...",
        emptyInbox: "Inbox is empty",
        noEmails: "No emails to display",
        selectEmail: "Select an email",
        selectEmailDesc: "Select an email to read its content",
        attachments: "Attachments",
        emptyTrash: "Empty Trash",
        quickReply: "Quick Reply",
        print: "Print",
        delete: "Delete",
        view: "View",
        download: "Download",
        from: "From",
        date: "Date",
        systemOperational: "All systems operational",
        aiOrganizing: "AI is organizing your inbox. <strong>15</strong> emails sorted automatically.",
        storage: "Storage",
        kyiv: "Kyiv",
        
        // Themes
        lightTheme: "Light",
        darkTheme: "Dark",
        oledTheme: "OLED",
        blueTheme: "Ocean",
        
        // Settings
        userSettings: "User Settings",
        profileTab: "Profile",
        appearanceTab: "Appearance",
        notificationsTab: "Notifications",
        securityTab: "Security",
        avatarColor: "Avatar Color",
        themeSettings: "Theme Settings",
        notificationsDesc: "Configure your notification preferences",
        securityDesc: "Security and privacy settings",
        
        // Compose
        newMail: "New Message",
        toEmail: "To",
        subject: "Subject",
        message: "Write your message here...",
        addAttachment: "Add Attachment",
        send: "Send",
        close: "Close",
        save: "Save Changes",
        cancel: "Cancel",
        discard: "Discard",
        
        // Messages
        emailSaved: "Email saved successfully!",
        emailSent: "Email sent successfully!",
        emailDeleted: "Email moved to trash",
        trashEmptied: "Trash emptied",
        confirmDelete: "Delete this email?",
        confirmEmptyTrash: "Empty trash? This action cannot be undone.",
        missingRecipient: "Please enter recipient email",
        invalidEmail: "Invalid email format",
        fileTooLarge: "File is too large (max 5MB)",
        maxFiles: "Maximum 5 files allowed",
        loginSuccess: "Welcome back!",
        registerSuccess: "Account created successfully!",
        loginError: "Invalid email or password",
        registerError: "Please fill all fields correctly",
        passwordMismatch: "Passwords do not match",
        weakPassword: "Password must be at least 8 characters with letters and numbers"
    },
    
    ua: {
        subtitle: "Розумний клієнт електронної пошти з AI",
        welcomeBack: "Ласкаво просимо",
        emailAddress: "Електронна адреса",
        password: "Пароль",
        rememberMe: "Запам'ятати мене",
        forgotPassword: "Забули пароль?",
        signIn: "Увійти",
        newUser: "Новий користувач?",
        createAccount: "Створити акаунт",
        fullName: "Повне ім'я",
        confirmPassword: "Підтвердіть пароль",
        createAccountBtn: "Створити акаунт",
        alreadyHaveAccount: "Вже маєте акаунт?",
        aiFilter: "AI фільтр спаму",
        smartSorting: "Розумне сортування",
        securePrivate: "Безпека та приватність",
        
        online: "Онлайн",
        compose: "Створити",
        inbox: "Вхідні",
        important: "Важливі",
        sent: "Надіслані",
        drafts: "Чернетки",
        spam: "Спам",
        trash: "Кошик",
        labels: "Мітки",
        searchPlaceholder: "Пошук листів...",
        emptyInbox: "Вхідні порожні",
        noEmails: "Листів немає",
        selectEmail: "Виберіть лист",
        selectEmailDesc: "Виберіть лист для перегляду",
        attachments: "Вкладення",
        emptyTrash: "Очистити кошик",
        quickReply: "Швидка відповідь",
        print: "Друк",
        delete: "Видалити",
        view: "Переглянути",
        download: "Скачати",
        from: "Від",
        date: "Дата",
        systemOperational: "Усі системи працюють",
        aiOrganizing: "AI організовує вашу пошту. <strong>15</strong> листів відсортовано.",
        storage: "Сховище",
        kyiv: "Київ",
        
        lightTheme: "Світла",
        darkTheme: "Темна",
        oledTheme: "OLED",
        blueTheme: "Океан",
        
        userSettings: "Налаштування",
        profileTab: "Профіль",
        appearanceTab: "Зовнішній вигляд",
        notificationsTab: "Сповіщення",
        securityTab: "Безпека",
        avatarColor: "Колір аватара",
        themeSettings: "Налаштування теми",
        notificationsDesc: "Налаштування сповіщень",
        securityDesc: "Налаштування безпеки та приватності",
        
        newMail: "Новий лист",
        toEmail: "Кому",
        subject: "Тема",
        message: "Напишіть ваше повідомлення...",
        addAttachment: "Додати файл",
        send: "Надіслати",
        close: "Закрити",
        save: "Зберегти зміни",
        cancel: "Скасувати",
        discard: "Скасувати",
        
        emailSaved: "Email збережено!",
        emailSent: "Лист надіслано!",
        emailDeleted: "Лист переміщено в кошик",
        trashEmptied: "Кошик очищено",
        confirmDelete: "Видалити цей лист?",
        confirmEmptyTrash: "Очистити кошик? Цю дію не можна скасувати.",
        missingRecipient: "Введіть адресу отримувача",
        invalidEmail: "Невірний формат email",
        fileTooLarge: "Файл занадто великий (макс. 5MB)",
        maxFiles: "Максимум 5 файлів",
        loginSuccess: "Ласкаво просимо!",
        registerSuccess: "Акаунт успішно створено!",
        loginError: "Невірний email або пароль",
        registerError: "Заповніть всі поля правильно",
        passwordMismatch: "Паролі не співпадають",
        weakPassword: "Пароль має бути щонайменше 8 символів з літерами та цифрами"
    },
    
    ru: {
        subtitle: "Умный email клиент с AI",
        welcomeBack: "Добро пожаловать",
        emailAddress: "Электронная почта",
        password: "Пароль",
        rememberMe: "Запомнить меня",
        forgotPassword: "Забыли пароль?",
        signIn: "Войти",
        newUser: "Новый пользователь?",
        createAccount: "Создать аккаунт",
        fullName: "Полное имя",
        confirmPassword: "Подтвердите пароль",
        createAccountBtn: "Создать аккаунт",
        alreadyHaveAccount: "Уже есть аккаунт?",
        aiFilter: "AI фильтр спама",
        smartSorting: "Умная сортировка",
        securePrivate: "Безопасность и приватность",
        
        online: "Онлайн",
        compose: "Создать",
        inbox: "Входящие",
        important: "Важные",
        sent: "Отправленные",
        drafts: "Черновики",
        spam: "Спам",
        trash: "Корзина",
        labels: "Метки",
        searchPlaceholder: "Поиск писем...",
        emptyInbox: "Входящие пусты",
        noEmails: "Писем нет",
        selectEmail: "Выберите письмо",
        selectEmailDesc: "Выберите письмо для просмотра",
        attachments: "Вложения",
        emptyTrash: "Очистить корзину",
        quickReply: "Быстрый ответ",
        print: "Печать",
        delete: "Удалить",
        view: "Просмотреть",
        download: "Скачать",
        from: "От",
        date: "Дата",
        systemOperational: "Все системы работают",
        aiOrganizing: "AI организует вашу почту. <strong>15</strong> писем отсортировано.",
        storage: "Хранилище",
        kyiv: "Киев",
        
        lightTheme: "Светлая",
        darkTheme: "Темная",
        oledTheme: "OLED",
        blueTheme: "Океан",
        
        userSettings: "Настройки",
        profileTab: "Профиль",
        appearanceTab: "Внешний вид",
        notificationsTab: "Уведомления",
        securityTab: "Безопасность",
        avatarColor: "Цвет аватара",
        themeSettings: "Настройки темы",
        notificationsDesc: "Настройки уведомлений",
        securityDesc: "Настройки безопасности и приватности",
        
        newMail: "Новое сообщение",
        toEmail: "Кому",
        subject: "Тема",
        message: "Напишите ваше сообщение...",
        addAttachment: "Добавить файл",
        send: "Отправить",
        close: "Закрыть",
        save: "Сохранить изменения",
        cancel: "Отменить",
        discard: "Отменить",
        
        emailSaved: "Email сохранен!",
        emailSent: "Письмо отправлено!",
        emailDeleted: "Письмо перемещено в корзину",
        trashEmptied: "Корзина очищена",
        confirmDelete: "Удалить это письмо?",
        confirmEmptyTrash: "Очистить корзину? Это действие нельзя отменить.",
        missingRecipient: "Введите адрес получателя",
        invalidEmail: "Неверный формат email",
        fileTooLarge: "Файл слишком большой (макс. 5MB)",
        maxFiles: "Максимум 5 файлов",
        loginSuccess: "Добро пожаловать!",
        registerSuccess: "Аккаунт успешно создан!",
        loginError: "Неверный email или пароль",
        registerError: "Заполните все поля правильно",
        passwordMismatch: "Пароли не совпадают",
        weakPassword: "Пароль должен быть не менее 8 символов с буквами и цифрами"
    },
    
    de: {
        subtitle: "Intelligenter E-Mail-Client mit KI",
        welcomeBack: "Willkommen zurück",
        emailAddress: "E-Mail-Adresse",
        password: "Passwort",
        rememberMe: "Angemeldet bleiben",
        forgotPassword: "Passwort vergessen?",
        signIn: "Anmelden",
        newUser: "Neuer Benutzer?",
        createAccount: "Konto erstellen",
        fullName: "Vollständiger Name",
        confirmPassword: "Passwort bestätigen",
        createAccountBtn: "Konto erstellen",
        alreadyHaveAccount: "Haben Sie bereits ein Konto?",
        aiFilter: "KI-Spam-Filter",
        smartSorting: "Intelligente Sortierung",
        securePrivate: "Sicher & Privat",
        
        online: "Online",
        compose: "Verfassen",
        inbox: "Posteingang",
        important: "Wichtig",
        sent: "Gesendet",
        drafts: "Entwürfe",
        spam: "Spam",
        trash: "Papierkorb",
        labels: "Labels",
        searchPlaceholder: "E-Mails suchen...",
        emptyInbox: "Posteingang ist leer",
        noEmails: "Keine E-Mails vorhanden",
        selectEmail: "Wählen Sie eine E-Mail",
        selectEmailDesc: "Wählen Sie eine E-Mail zum Lesen",
        attachments: "Anhänge",
        emptyTrash: "Papierkorb leeren",
        quickReply: "Schnelle Antwort",
        print: "Drucken",
        delete: "Löschen",
        view: "Ansehen",
        download: "Herunterladen",
        from: "Von",
        date: "Datum",
        systemOperational: "Alle Systeme funktionieren",
        aiOrganizing: "KI organisiert Ihren Posteingang. <strong>15</strong> E-Mails sortiert.",
        storage: "Speicher",
        kyiv: "Kiew",
        
        lightTheme: "Hell",
        darkTheme: "Dunkel",
        oledTheme: "OLED",
        blueTheme: "Ozean",
        
        userSettings: "Benutzereinstellungen",
        profileTab: "Profil",
        appearanceTab: "Erscheinungsbild",
        notificationsTab: "Benachrichtigungen",
        securityTab: "Sicherheit",
        avatarColor: "Avatar-Farbe",
        themeSettings: "Theme-Einstellungen",
        notificationsDesc: "Benachrichtigungseinstellungen konfigurieren",
        securityDesc: "Sicherheits- und Datenschutzeinstellungen",
        
        newMail: "Neue Nachricht",
        toEmail: "An",
        subject: "Betreff",
        message: "Schreiben Sie Ihre Nachricht...",
        addAttachment: "Anhang hinzufügen",
        send: "Senden",
        close: "Schließen",
        save: "Änderungen speichern",
        cancel: "Abbrechen",
        discard: "Verwerfen",
        
        emailSaved: "E-Mail gespeichert!",
        emailSent: "E-Mail gesendet!",
        emailDeleted: "E-Mail in Papierkorb verschoben",
        trashEmptied: "Papierkorb geleert",
        confirmDelete: "Diese E-Mail löschen?",
        confirmEmptyTrash: "Papierkorb leeren? Diese Aktion kann nicht rückgängig gemacht werden.",
        missingRecipient: "Bitte geben Sie die Empfänger-E-Mail ein",
        invalidEmail: "Ungültiges E-Mail-Format",
        fileTooLarge: "Datei ist zu groß (max. 5MB)",
        maxFiles: "Maximal 5 Dateien erlaubt",
        loginSuccess: "Willkommen zurück!",
        registerSuccess: "Konto erfolgreich erstellt!",
        loginError: "Ungültige E-Mail oder Passwort",
        registerError: "Bitte füllen Sie alle Felder korrekt aus",
        passwordMismatch: "Passwörter stimmen nicht überein",
        weakPassword: "Passwort muss mindestens 8 Zeichen mit Buchstaben und Zahlen enthalten"
    }
};

// ====================== INITIALIZATION ======================
function init() {
    console.log('Inbox Pro loading...');
    
    // Load data from localStorage
    loadUserData();
    loadEmails();
    
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Setup event listeners
    setupEventListeners();
    
    // Apply language
    applyLanguage();
    
    // Check if user is logged in
    checkAutoLogin();
    
    console.log('Inbox Pro initialized');
}

function loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function loadEmails() {
    const savedEmails = localStorage.getItem('inboxProEmails');
    if (savedEmails) {
        emails = JSON.parse(savedEmails);
    } else {
        // Generate sample emails if none exist
        generateSampleEmails();
    }
}

function saveEmails() {
    localStorage.setItem('inboxProEmails', JSON.stringify(emails));
}

function checkAutoLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn && savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        updateUI();
        showToast(translations[currentLanguage].loginSuccess, 'success');
    }
}

// ====================== EVENT LISTENERS ======================
function setupEventListeners() {
    // Login/Register switches
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    });
    
    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });
    
    // Login button
    document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
    
    // Register button
    document.getElementById('registerBtn')?.addEventListener('click', handleRegister);
    
    // Compose button
    document.getElementById('composeBtn')?.addEventListener('click', openComposeModal);
    
    // Settings button
    document.getElementById('settingsBtn')?.addEventListener('click', openSettingsModal);
    
    // Menu toggle for mobile
    document.getElementById('menuToggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
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
    
    // Back to list button
    document.getElementById('backToList')?.addEventListener('click', () => {
        document.getElementById('reader').classList.remove('active');
        if (window.innerWidth <= 768) {
            document.querySelector('.emails').style.display = 'block';
        }
    });
    
    // Delete email button
    document.getElementById('deleteEmailBtn')?.addEventListener('click', deleteCurrentEmail);
    
    // Empty trash button
    document.getElementById('emptyTrashBtn')?.addEventListener('click', emptyTrash);
    
    // Select all button
    document.getElementById('selectAllBtn')?.addEventListener('click', toggleSelectAll);
    
    // Mark as read button
    document.getElementById('markReadBtn')?.addEventListener('click', markSelectedAsRead);
    
    // Delete selected button
    document.getElementById('deleteSelectedBtn')?.addEventListener('click', deleteSelectedEmails);
    
    // Search input
    document.getElementById('searchInput')?.addEventListener('input', handleSearch);
    
    // Search clear button
    document.getElementById('searchClear')?.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        handleSearch();
    });
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        updateUI();
        showToast('Refreshed', 'success');
    });
    
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
    
    // Theme menu buttons
    document.querySelectorAll('.theme-menu button').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
        });
    });
    
    // Language select
    document.getElementById('langSelect')?.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        applyLanguage();
        updateUI();
    });
    
    // Settings modal close
    document.getElementById('closeSettings')?.addEventListener('click', () => {
        closeModal(document.getElementById('settingsModal'));
    });
    
    // Settings save
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    
    // Compose modal close
    document.getElementById('closeCompose')?.addEventListener('click', () => {
        closeModal(document.getElementById('composeModal'));
        clearComposeForm();
    });
    
    // Send email button
    document.getElementById('sendMail')?.addEventListener('click', sendEmail);
    
    // Discard button
    document.getElementById('discardBtn')?.addEventListener('click', () => {
        closeModal(document.getElementById('composeModal'));
        clearComposeForm();
    });
    
    // File upload
    document.getElementById('mailFile')?.addEventListener('change', handleFileUpload);
    
    // Quick actions
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            handleQuickAction(action);
        });
    });
    
    // AI dismiss button
    document.querySelector('.ai-dismiss')?.addEventListener('click', () => {
        document.getElementById('aiStatusBar').style.display = 'none';
    });
    
    // Help button
    document.getElementById('helpBtn')?.addEventListener('click', () => {
        showToast('Help guide will be available soon!', 'info');
    });
    
    // Reply button
    document.getElementById('replyBtn')?.addEventListener('click', () => {
        if (currentSelectedEmail) {
            const email = emails.find(e => e.id === currentSelectedEmail);
            if (email) {
                openComposeModal();
                document.getElementById('mailTo').value = email.from;
                document.getElementById('mailSubject').value = `Re: ${email.subject}`;
                document.getElementById('mailText').value = `\n\n--- Original Message ---\nFrom: ${email.from}\nSubject: ${email.subject}\n\n`;
            }
        }
    });
    
    // Quick reply button
    document.getElementById('quickReplyBtn')?.addEventListener('click', () => {
        if (currentSelectedEmail) {
            const email = emails.find(e => e.id === currentSelectedEmail);
            if (email) {
                openComposeModal();
                document.getElementById('mailTo').value = email.from;
                document.getElementById('mailSubject').value = `Re: ${email.subject}`;
            }
        }
    });
    
    // Print button
    document.getElementById('printBtn')?.addEventListener('click', () => {
        window.print();
    });
    
    // Star button
    document.getElementById('starBtn')?.addEventListener('click', toggleStarEmail);
    
    // Close image modal
    document.getElementById('closeImage')?.addEventListener('click', () => {
        closeModal(document.getElementById('imageModal'));
    });
    
    // Cancel settings button
    document.getElementById('cancelSettings')?.addEventListener('click', () => {
        closeModal(document.getElementById('settingsModal'));
    });
    
    // Theme options in settings
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            applyTheme(theme);
            showToast(`Theme changed to ${theme}`, 'success');
        });
    });
    
    // Color picker for avatar
    document.querySelectorAll('.color-option').forEach(color => {
        color.addEventListener('click', () => {
            const selectedColor = color.dataset.color;
            document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
            color.classList.add('selected');
            if (currentUser) {
                currentUser.avatarColor = selectedColor;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserAvatar();
            }
        });
    });
    
    // Click outside to close sidebar on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle') &&
            document.getElementById('sidebar').classList.contains('active')) {
            document.getElementById('sidebar').classList.remove('active');
        }
    });
}

// ====================== LOGIN/REGISTER FUNCTIONS ======================
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showToast(translations[currentLanguage].loginError, 'error');
        return;
    }
    
    // Simple validation for demo
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Create or get user
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email);
    
    if (!user) {
        // Create new user for demo
        user = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            avatarColor: '#667eea',
            createdAt: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Set current user
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
    }
    
    // Switch to app
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    showToast(translations[currentLanguage].loginSuccess, 'success');
    updateUI();
}

function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    
    // Validation
    if (!name || !email || !password || !confirm) {
        showToast(translations[currentLanguage].registerError, 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast(translations[currentLanguage].passwordMismatch, 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast(translations[currentLanguage].weakPassword, 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast(translations[currentLanguage].invalidEmail, 'error');
        return;
    }
    
    // Check if user exists
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        showToast('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        avatarColor: '#667eea',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Switch to app
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    showToast(translations[currentLanguage].registerSuccess, 'success');
    updateUI();
}

// ====================== EMAIL FUNCTIONS ======================
function generateSampleEmails() {
    const sampleEmails = [
        {
            id: 1,
            from: 'support@inboxpro.com',
            fromName: 'Inbox Pro Support',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: translations[currentLanguage].welcomeBack + ' to Inbox Pro!',
            body: 'Welcome to Inbox Pro, your new smart email client!\n\nFeatures:\n✓ AI-powered spam filtering\n✓ Smart email sorting\n✓ Multiple themes\n✓ 4 language support\n✓ File attachments\n\nGet started by composing your first email!',
            date: new Date(Date.now() - 3600000).toISOString(),
            folder: 'inbox',
            read: false,
            important: true,
            labels: ['work'],
            attachments: []
        },
        {
            id: 2,
            from: 'news@techworld.com',
            fromName: 'Tech World News',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'Weekly Tech Digest',
            body: 'Top stories this week:\n1. AI breakthrough in natural language processing\n2. New smartphone with foldable display\n3. Cybersecurity threats increase\n4. Cloud computing trends for 2024\n\nRead more on our website!',
            date: new Date(Date.now() - 7200000).toISOString(),
            folder: 'inbox',
            read: false,
            important: false,
            labels: ['work'],
            attachments: []
        },
        {
            id: 3,
            from: 'billing@services.com',
            fromName: 'Service Billing',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'Invoice for January 2024',
            body: 'Dear customer,\n\nYour monthly invoice is now available.\nAmount: $49.99\nDue date: February 15, 2024\n\nPlease log in to view and pay.\n\nThank you!',
            date: new Date(Date.now() - 86400000).toISOString(),
            folder: 'inbox',
            read: true,
            important: false,
            labels: ['bills'],
            attachments: [
                { name: 'invoice_january.pdf', size: '245 KB', type: 'pdf' }
            ]
        },
        {
            id: 4,
            from: 'travel@agency.com',
            fromName: 'Travel Agency',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'Your Booking Confirmation',
            body: 'Your travel booking is confirmed!\n\nFlight: New York to Paris\nDate: March 15, 2024\n\nHotel: Luxury Hotel Paris\nCheck-in: March 15\nCheck-out: March 22\n\nSee attached documents.',
            date: new Date(Date.now() - 172800000).toISOString(),
            folder: 'inbox',
            read: true,
            important: true,
            labels: ['travel'],
            attachments: [
                { name: 'flight_tickets.pdf', size: '512 KB', type: 'pdf' },
                { name: 'hotel_confirmation.pdf', size: '310 KB', type: 'pdf' }
            ]
        },
        {
            id: 5,
            from: 'security@account.com',
            fromName: 'Account Security',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'New Login Detected',
            body: 'We detected a new login:\n\nDevice: Chrome on Windows\nLocation: New York, USA\nTime: Today, 10:30 AM\n\nIf this was you, ignore this message.',
            date: new Date(Date.now() - 259200000).toISOString(),
            folder: 'inbox',
            read: true,
            important: true,
            labels: [],
            attachments: []
        },
        {
            id: 6,
            from: currentUser ? currentUser.email : 'user@example.com',
            fromName: currentUser ? currentUser.name : 'You',
            to: 'colleague@company.com',
            subject: 'Meeting Notes',
            body: 'Here are the notes from our meeting:\n\n1. Project timeline discussion\n2. Resource allocation\n3. Next steps\n\nPlease review and let me know your thoughts.',
            date: new Date(Date.now() - 43200000).toISOString(),
            folder: 'sent',
            read: true,
            important: false,
            labels: ['work'],
            attachments: [
                { name: 'meeting_notes.docx', size: '128 KB', type: 'doc' }
            ]
        },
        {
            id: 7,
            from: currentUser ? currentUser.email : 'user@example.com',
            fromName: currentUser ? currentUser.name : 'You',
            to: 'friend@example.com',
            subject: 'Weekend Plans',
            body: 'Hey! What are you doing this weekend?\n\nI was thinking we could go hiking or maybe see a movie.\nLet me know what you think!\n\nCheers!',
            date: new Date(Date.now() - 86400000).toISOString(),
            folder: 'sent',
            read: true,
            important: false,
            labels: ['personal'],
            attachments: []
        },
        {
            id: 8,
            from: 'lottery@winbig.com',
            fromName: 'Mega Lottery',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'YOU WON $1,000,000!',
            body: 'CONGRATULATIONS! You have won $1,000,000 in our lottery!\n\nClick here to claim your prize: http://scam-site.com\n\nThis is a limited time offer!',
            date: new Date(Date.now() - 3600000).toISOString(),
            folder: 'spam',
            read: false,
            important: false,
            labels: [],
            attachments: []
        },
        {
            id: 9,
            from: 'noreply@pharmacy.com',
            fromName: 'Online Pharmacy',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'Special Offer on Medications',
            body: 'Buy medications without prescription!\n\nSpecial discounts available.\nWorldwide shipping.\n\nVisit our website now!',
            date: new Date(Date.now() - 7200000).toISOString(),
            folder: 'spam',
            read: false,
            important: false,
            labels: [],
            attachments: []
        },
        {
            id: 10,
            from: 'investment@opportunity.com',
            fromName: 'Investment Opportunity',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'Double Your Money in 30 Days',
            body: 'Exclusive investment opportunity!\n\nGuaranteed returns of 100% in 30 days.\nMinimum investment: $500.\n\nContact us immediately!',
            date: new Date(Date.now() - 10800000).toISOString(),
            folder: 'spam',
            read: true,
            important: false,
            labels: [],
            attachments: []
        },
        {
