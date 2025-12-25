// ====================== GLOBAL VARIABLES ======================
let emails = [];
let currentFolder = 'inbox';
let currentUser = null;
let currentSelectedEmail = null;
let currentLanguage = 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

// ====================== TRANSLATIONS ======================
const translations = {
    en: {
        inbox: 'Inbox',
        important: 'Important',
        sent: 'Sent',
        spam: 'Spam',
        trash: 'Trash',
        emptyInbox: 'Inbox is empty',
        noEmails: 'No emails to display',
        selectEmail: 'Select an email',
        compose: 'Compose',
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
        alreadyHaveAccount: 'Already have an account?'
    },
    ua: {
        inbox: 'Вхідні',
        important: 'Важливі',
        sent: 'Надіслані',
        spam: 'Спам',
        trash: 'Кошик',
        emptyInbox: 'Вхідні порожні',
        noEmails: 'Листів немає',
        selectEmail: 'Виберіть лист',
        compose: 'Створити',
        welcomeBack: 'Ласкаво просимо',
        emailAddress: 'Електронна адреса',
        password: 'Пароль',
        rememberMe: "Запам'ятати мене",
        forgotPassword: 'Забули пароль?',
        signIn: 'Увійти',
        newUser: 'Новий користувач?',
        createAccount: 'Створити акаунт',
        fullName: "Повне ім'я",
        confirmPassword: 'Підтвердіть пароль',
        createAccountBtn: 'Створити акаунт',
        alreadyHaveAccount: 'Вже маєте акаунт?'
    },
    ru: {
        inbox: 'Входящие',
        important: 'Важные',
        sent: 'Отправленные',
        spam: 'Спам',
        trash: 'Корзина',
        emptyInbox: 'Входящие пусты',
        noEmails: 'Писем нет',
        selectEmail: 'Выберите письмо',
        compose: 'Создать',
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
        alreadyHaveAccount: 'Уже есть аккаунт?'
    },
    de: {
        inbox: 'Posteingang',
        important: 'Wichtig',
        sent: 'Gesendet',
        spam: 'Spam',
        trash: 'Papierkorb',
        emptyInbox: 'Posteingang ist leer',
        noEmails: 'Keine E-Mails vorhanden',
        selectEmail: 'Wählen Sie eine E-Mail',
        compose: 'Verfassen',
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
        alreadyHaveAccount: 'Haben Sie bereits ein Konto?'
    }
};

// ====================== INITIALIZATION ======================
function init() {
    console.log('Inbox Pro starting...');
    
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Generate sample emails
    generateSampleEmails();
    
    // Setup event listeners
    setupEventListeners();
    
    // Apply language
    applyLanguage();
    
    console.log('Inbox Pro ready');
}

function generateSampleEmails() {
    if (emails.length > 0) return;
    
    emails = [
        {
            id: 1,
            from: 'support@inboxpro.com',
            fromName: 'Inbox Pro Support',
            to: 'user@example.com',
            subject: 'Welcome to Inbox Pro!',
            body: 'Welcome to Inbox Pro! Your smart email client is ready to use.\n\nFeatures:\n✓ AI-powered spam filtering\n✓ Smart email sorting\n✓ Multiple themes\n✓ 4 language support\n\nGet started by composing your first email!',
            date: new Date().toISOString(),
            folder: 'inbox',
            read: false,
            important: true
        },
        {
            id: 2,
            from: 'news@techworld.com',
            fromName: 'Tech World News',
            to: 'user@example.com',
            subject: 'Weekly Tech Digest',
            body: 'Top stories this week:\n1. AI breakthrough in natural language processing\n2. New smartphone with foldable display\n3. Cybersecurity threats increase\n4. Cloud computing trends for 2024',
            date: new Date(Date.now() - 3600000).toISOString(),
            folder: 'inbox',
            read: false,
            important: false
        },
        {
            id: 3,
            from: 'billing@services.com',
            fromName: 'Service Billing',
            to: 'user@example.com',
            subject: 'Invoice for January 2024',
            body: 'Dear customer,\n\nYour monthly invoice is now available.\nAmount: $49.99\nDue date: February 15, 2024\n\nPlease log in to view and pay.\n\nThank you!',
            date: new Date(Date.now() - 86400000).toISOString(),
            folder: 'inbox',
            read: true,
            important: false
        },
        {
            id: 4,
            from: 'user@example.com',
            fromName: 'You',
            to: 'colleague@company.com',
            subject: 'Meeting Notes',
            body: 'Here are the notes from our meeting:\n\n1. Project timeline discussion\n2. Resource allocation\n3. Next steps\n\nPlease review and let me know your thoughts.',
            date: new Date(Date.now() - 43200000).toISOString(),
            folder: 'sent',
            read: true,
            important: true
        },
        {
            id: 5,
            from: 'lottery@winbig.com',
            fromName: 'Mega Lottery',
            to: 'user@example.com',
            subject: 'YOU WON $1,000,000!',
            body: 'CONGRATULATIONS! You have won $1,000,000 in our lottery!\n\nClick here to claim your prize.',
            date: new Date(Date.now() - 7200000).toISOString(),
            folder: 'spam',
            read: false,
            important: false
        }
    ];
}

// ====================== EVENT LISTENERS ======================
function setupEventListeners() {
    // Login/Register switches
    document.getElementById('showRegister')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    });
    
    document.getElementById('showLogin')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });
    
    // Login button
    document.getElementById('loginBtn')?.addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showToast('Please enter email and password', 'error');
            return;
        }
        
        // Simple login for demo
        currentUser = {
            name: email.split('@')[0],
            email: email,
            avatarColor: '#667eea'
        };
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        updateUI();
        showToast('Welcome to Inbox Pro!', 'success');
    });
    
    // Register button
    document.getElementById('registerBtn')?.addEventListener('click', function() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        
        if (!name || !email || !password) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        currentUser = {
            name: name,
            email: email,
            avatarColor: '#667eea'
        };
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        updateUI();
        showToast('Account created successfully!', 'success');
    });
    
    // Compose button
    document.getElementById('composeBtn')?.addEventListener('click', openComposeModal);
    
    // Settings button
    document.getElementById('settingsBtn')?.addEventListener('click', openSettingsModal);
    
    // Send email button
    document.getElementById('sendMail')?.addEventListener('click', sendEmail);
    
    // Close modals
    document.getElementById('closeSettings')?.addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });
    
    document.getElementById('closeCompose')?.addEventListener('click', () => {
        document.getElementById('composeModal').style.display = 'none';
        clearComposeForm();
    });
    
    document.getElementById('cancelSettings')?.addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });
    
    document.getElementById('discardBtn')?.addEventListener('click', () => {
        document.getElementById('composeModal').style.display = 'none';
        clearComposeForm();
    });
    
    // Save settings
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    
    // Folder navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const folder = this.dataset.folder;
            switchFolder(folder);
            
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Theme selection
    document.getElementById('themeToggle')?.addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('themeMenu').classList.toggle('show');
    });
    
    document.querySelectorAll('.theme-menu button').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            applyTheme(theme);
            document.getElementById('themeMenu').classList.remove('show');
        });
    });
    
    // Close theme menu when clicking outside
    document.addEventListener('click', function() {
        document.getElementById('themeMenu')?.classList.remove('show');
    });
    
    // Language select
    document.getElementById('langSelect')?.addEventListener('change', function(e) {
        currentLanguage = e.target.value;
        applyLanguage();
        updateUI();
    });
    
    // Back to list button (mobile)
    document.getElementById('backToList')?.addEventListener('click', function() {
        document.getElementById('reader').classList.remove('active');
        document.querySelector('.emails').style.display = 'block';
    });
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', function() {
        updateUI();
        showToast('Refreshed', 'success');
    });
    
    // Mark as read button
    document.getElementById('markReadBtn')?.addEventListener('click', function() {
        markAllAsRead();
    });
    
    // Search input
    document.getElementById('searchInput')?.addEventListener('input', function() {
        displayEmails();
    });
}

// ====================== EMAIL FUNCTIONS ======================
function switchFolder(folder) {
    currentFolder = folder;
    updateUI();
    
    // Update folder icon in header
    const iconMap = {
        inbox: 'fa-inbox',
        important: 'fa-star',
        sent: 'fa-paper-plane',
        spam: 'fa-ban',
        trash: 'fa-trash'
    };
    
    const icon = iconMap[folder] || 'fa-inbox';
    document.getElementById('currentFolder').innerHTML = `<i class="fas ${icon}"></i> <span>${translations[currentLanguage][folder] || folder}</span>`;
}

function updateUI() {
    if (!currentUser) return;
    
    // Update user avatar
    document.getElementById('userAvatar').textContent = 
        currentUser.name.substring(0, 2).toUpperCase();
    
    // Update counts
    updateFolderCounts();
    
    // Display emails
    displayEmails();
}

function updateFolderCounts() {
    const inboxCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
    const importantCount = emails.filter(e => e.folder === 'important').length;
    const sentCount = emails.filter(e => e.folder === 'sent').length;
    const spamCount = emails.filter(e => e.folder === 'spam').length;
    
    document.getElementById('inboxCount').textContent = inboxCount > 0 ? inboxCount : '';
    document.getElementById('importantCount').textContent = importantCount > 0 ? importantCount : '';
    document.getElementById('sentCount').textContent = sentCount > 0 ? sentCount : '';
    document.getElementById('spamCount').textContent = spamCount > 0 ? spamCount : '';
    
    // Update folder stats
    const folderEmails = emails.filter(e => e.folder === currentFolder);
    const unreadInFolder = folderEmails.filter(e => !e.read).length;
    
    document.getElementById('emailCount').textContent = `${folderEmails.length} emails`;
    document.getElementById('unreadCount').textContent = `${unreadInFolder} unread`;
}

function displayEmails() {
    const container = document.getElementById('emailsList');
    if (!container) return;
    
    let folderEmails = emails.filter(e => e.folder === currentFolder);
    
    // Apply search filter
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchTerm) {
        folderEmails = folderEmails.filter(email => 
            email.subject.toLowerCase().includes(searchTerm) ||
            email.fromName.toLowerCase().includes(searchTerm) ||
            email.body.toLowerCase().includes(searchTerm)
        );
    }
    
    if (folderEmails.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>${translations[currentLanguage]?.emptyInbox || 'Inbox is empty'}</h3>
                <p>${translations[currentLanguage]?.noEmails || 'No emails to display'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    // Sort by date (newest first)
    folderEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    folderEmails.forEach((email, index) => {
        const emailElement = createEmailElement(email, index);
        container.appendChild(emailElement);
    });
}

function createEmailElement(email, index) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'}`;
    div.dataset.id = email.id;
    
    const initials = getInitials(email.fromName || email.from);
    const date = formatDate(email.date);
    const preview = email.body.substring(0, 80) + (email.body.length > 80 ? '...' : '');
    
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
    
    div.addEventListener('click', function() {
        selectEmail(email.id);
        
        // Mark as read
        if (!email.read) {
            email.read = true;
            updateFolderCounts();
            this.classList.remove('unread');
        }
    });
    
    return div;
}

function selectEmail(id) {
    const email = emails.find(e => e.id === id);
    if (!email) return;
    
    currentSelectedEmail = id;
    
    // Update reader view
    document.getElementById('readerTitle').textContent = email.subject;
    document.getElementById('readerSender').textContent = email.fromName || email.from;
    document.getElementById('readerSenderEmail').textContent = email.from;
    document.getElementById('readerDate').textContent = formatDate(email.date, true);
    document.getElementById('readerSubject').textContent = email.subject;
    document.getElementById('readerText').innerHTML = email.body.replace(/\n/g, '<br>');
    
    // Show on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'none';
        document.getElementById('reader').classList.add('active');
    }
}

function markAllAsRead() {
    emails.forEach(email => {
        if (email.folder === currentFolder) {
            email.read = true;
        }
    });
    
    updateUI();
    showToast('All emails marked as read', 'success');
}

// ====================== MODAL FUNCTIONS ======================
function openComposeModal() {
    document.getElementById('composeModal').style.display = 'flex';
    document.getElementById('mailTo').focus();
}

function clearComposeForm() {
    document.getElementById('mailTo').value = '';
    document.getElementById('mailSubject').value = '';
    document.getElementById('mailText').value = '';
}

function sendEmail() {
    const to = document.getElementById('mailTo').value.trim();
    const subject = document.getElementById('mailSubject').value.trim();
    const body = document.getElementById('mailText').value.trim();
    
    if (!to || !subject) {
        showToast('Please enter recipient and subject', 'error');
        return;
    }
    
    // Create new email
    const newEmail = {
        id: Date.now(),
        from: currentUser ? currentUser.email : 'user@example.com',
        fromName: currentUser ? currentUser.name : 'You',
        to: to,
        subject: subject,
        body: body,
        date: new Date().toISOString(),
        folder: 'sent',
        read: true,
        important: false
    };
    
    emails.push(newEmail);
    
    // Close modal and clear form
    document.getElementById('composeModal').style.display = 'none';
    clearComposeForm();
    
    // Switch to sent folder
    switchFolder('sent');
    
    showToast('Email sent successfully!', 'success');
}

function openSettingsModal() {
    if (!currentUser) return;
    
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editEmail').value = currentUser.email;
    
    // Select current color
    document.querySelectorAll('.color-option').forEach(option => {
        if (option.dataset.color === currentUser.avatarColor) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    document.getElementById('settingsModal').style.display = 'flex';
}

function saveSettings() {
    if (!currentUser) return;
    
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    
    if (!name || !email) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    // Update
