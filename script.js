// ====================== GLOBAL VARIABLES ======================
let emails = [];
let currentFolder = 'inbox';
let currentUser = null;
let currentSelectedEmail = null;
let selectedEmails = new Set();
let currentLanguage = 'en';
let currentTheme = 'dark';

// ====================== SIMPLE TRANSLATIONS ======================
const translations = {
    en: {
        compose: 'Compose',
        inbox: 'Inbox',
        important: 'Important',
        sent: 'Sent',
        drafts: 'Drafts',
        spam: 'Spam',
        trash: 'Trash',
        emptyInbox: 'Inbox is empty',
        noEmails: 'No emails to display',
        selectEmail: 'Select an email',
        signIn: 'Sign In',
        createAccount: 'Create Account'
    },
    ua: {
        compose: 'Створити',
        inbox: 'Вхідні',
        important: 'Важливі',
        sent: 'Надіслані',
        drafts: 'Чернетки',
        spam: 'Спам',
        trash: 'Кошик',
        emptyInbox: 'Вхідні порожні',
        noEmails: 'Листів немає',
        selectEmail: 'Виберіть лист',
        signIn: 'Увійти',
        createAccount: 'Створити акаунт'
    }
};

// ====================== INITIALIZATION ======================
function init() {
    console.log('Inbox Pro starting...');
    
    // Setup event listeners first
    setupEventListeners();
    
    // Generate sample emails
    generateSampleEmails();
    
    // Show login screen
    showLoginScreen();
    
    console.log('Inbox Pro ready');
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

// ====================== EVENT LISTENERS ======================
function setupEventListeners() {
    // Login/Register switches
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        });
    }
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
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
            
            // Update user info
            updateUI();
            
            showToast('Welcome to Inbox Pro!', 'success');
        });
    }
    
    // Register button
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
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
    }
    
    // Compose button
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) {
        composeBtn.addEventListener('click', function() {
            document.getElementById('composeModal').style.display = 'flex';
        });
    }
    
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            document.getElementById('settingsModal').style.display = 'flex';
        });
    }
    
    // Close buttons
    const closeSettings = document.getElementById('closeSettings');
    if (closeSettings) {
        closeSettings.addEventListener('click', function() {
            document.getElementById('settingsModal').style.display = 'none';
        });
    }
    
    const closeCompose = document.getElementById('closeCompose');
    if (closeCompose) {
        closeCompose.addEventListener('click', function() {
            document.getElementById('composeModal').style.display = 'none';
            clearComposeForm();
        });
    }
    
    // Send email button
    const sendMail = document.getElementById('sendMail');
    if (sendMail) {
        sendMail.addEventListener('click', function() {
            const to = document.getElementById('mailTo').value.trim();
            const subject = document.getElementById('mailSubject').value.trim();
            
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
                body: document.getElementById('mailText').value,
                date: new Date().toISOString(),
                folder: 'sent',
                read: true,
                important: false,
                labels: []
            };
            
            emails.push(newEmail);
            
            document.getElementById('composeModal').style.display = 'none';
            clearComposeForm();
            
            // Switch to sent folder
            switchFolder('sent');
            
            showToast('Email sent successfully!', 'success');
        });
    }
    
    // Folder navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const folder = this.dataset.folder;
            switchFolder(folder);
            
            // Update active state
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Language select
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', function(e) {
            currentLanguage = e.target.value;
            applyLanguage();
            updateUI();
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('light')) {
                document.body.classList.remove('light');
                this.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.body.classList.add('light');
                this.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
}

// ====================== EMAIL FUNCTIONS ======================
function generateSampleEmails() {
    if (emails.length > 0) return;
    
    emails = [
        {
            id: 1,
            from: 'support@inboxpro.com',
            fromName: 'Inbox Pro Support',
            to: 'user@example.com',
            subject: 'Welcome to Inbox Pro!',
            body: 'Welcome to Inbox Pro! Your smart email client is ready to use.',
            date: new Date().toISOString(),
            folder: 'inbox',
            read: false,
            important: true,
            labels: ['work']
        },
        {
            id: 2,
            from: 'news@tech.com',
            fromName: 'Tech News',
            to: 'user@example.com',
            subject: 'Latest Tech Updates',
            body: 'Check out the latest technology news and updates.',
            date: new Date(Date.now() - 3600000).toISOString(),
            folder: 'inbox',
            read: false,
            important: false,
            labels: []
        },
        {
            id: 3,
            from: 'billing@company.com',
            fromName: 'Billing Department',
            to: 'user@example.com',
            subject: 'Your Invoice',
            body: 'Your monthly invoice is now available.',
            date: new Date(Date.now() - 86400000).toISOString(),
            folder: 'inbox',
            read: true,
            important: false,
            labels: ['bills']
        },
        {
            id: 4,
            from: 'spam@example.com',
            fromName: 'Spammer',
            to: 'user@example.com',
            subject: 'You won a prize!',
            body: 'This is a spam email.',
            date: new Date(Date.now() - 7200000).toISOString(),
            folder: 'spam',
            read: false,
            important: false,
            labels: []
        },
        {
            id: 5,
            from: 'user@example.com',
            fromName: 'You',
            to: 'friend@example.com',
            subject: 'Meeting Notes',
            body: 'Here are the notes from our meeting.',
            date: new Date(Date.now() - 43200000).toISOString(),
            folder: 'sent',
            read: true,
            important: true,
            labels: ['work']
        }
    ];
}

function switchFolder(folder) {
    currentFolder = folder;
    selectedEmails.clear();
    currentSelectedEmail = null;
    
    // Update UI
    updateUI();
    
    // Show/hide empty trash button
    const emptyTrashBtn = document.getElementById('emptyTrashBtn');
    if (emptyTrashBtn) {
        emptyTrashBtn.style.display = folder === 'trash' ? 'flex' : 'none';
    }
}

function updateUI() {
    if (!currentUser) return;
    
    // Update user info
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) userName.textContent = currentUser.name;
    if (userEmail) userEmail.textContent = currentUser.email;
    if (userAvatar) {
        userAvatar.textContent = currentUser.name.substring(0, 2).toUpperCase();
        userAvatar.style.background = currentUser.avatarColor;
    }
    
    // Display emails
    displayEmails();
    
    // Apply language
    applyLanguage();
}

function displayEmails() {
    const container = document.getElementById('emailsList');
    if (!container) return;
    
    const folderEmails = emails.filter(e => e.folder === currentFolder);
    
    if (folderEmails.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>${translations[currentLanguage].emptyInbox || 'Inbox is empty'}</h3>
                <p>${translations[currentLanguage].noEmails || 'No emails to display'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    // Sort by date (newest first)
    folderEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    folderEmails.forEach(email => {
        const emailElement = createEmailElement(email);
        container.appendChild(emailElement);
    });
}

function createEmailElement(email) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'}`;
    div.dataset.id = email.id;
    
    const initials = getInitials(email.fromName || email.from);
    const date = formatDate(email.date);
    const preview = email.body.substring(0, 60) + (email.body.length > 60 ? '...' : '');
    
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
        displayEmail(email);
        
        // Mark as read
        if (!email.read) {
            email.read = true;
            displayEmails();
        }
    });
    
    return div;
}

function displayEmail(email) {
    if (!email) return;
    
    const readerTitle = document.getElementById('readerTitle');
    const readerSender = document.getElementById('readerSender');
    const readerDate = document.getElementById('readerDate');
    const readerSubject = document.getElementById('readerSubject');
    const readerText = document.getElementById('readerText');
    
    if (readerTitle) readerTitle.textContent = email.subject;
    if (readerSender) readerSender.textContent = `${email.fromName || email.from} (${email.from})`;
    if (readerDate) readerDate.textContent = formatDate(email.date, true);
    if (readerSubject) readerSubject.textContent = email.subject;
    if (readerText) readerText.innerHTML = email.body.replace(/\n/g, '<br>');
    
    currentSelectedEmail = email.id;
}

function selectEmail(id) {
    currentSelectedEmail = id;
}

// ====================== UTILITY FUNCTIONS ======================
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function stringToColor(str) {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateString, full = false) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (full) return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return date.toLocaleDateString();
}

function applyLanguage() {
    // Apply to all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLanguage;
    }
}

function clearComposeForm() {
    const mailTo = document.getElementById('mailTo');
    const mailSubject = document.getElementById('mailSubject');
    const mailText = document.getElementById('mailText');
    
    if (mailTo) mailTo.value = '';
    if (mailSubject) mailSubject.value = '';
    if (mailText) mailText.value = '';
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ====================== START APPLICATION ======================
// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
