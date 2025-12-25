// ====================== GLOBAL VARIABLES ======================
let currentUser = null;
let currentFolder = 'inbox';
let selectedEmails = new Set();
let emailsData = {
    inbox: [],
    important: [],
    sent: [],
    drafts: [],
    spam: [],
    trash: []
};
let emailView = 'list';
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;
let currentLanguage = 'en';
let currentTheme = 'dark';
let minimizedComposeWindows = [];

// ====================== INITIAL EMAIL DATA ======================
const sampleEmails = [
    {
        id: 1,
        sender: "Support Team",
        senderEmail: "support@company.com",
        subject: "Welcome to Inbox Pro",
        preview: "Thank you for choosing our email service...",
        date: "Today, 10:30 AM",
        unread: true,
        important: true,
        folder: "inbox",
        attachments: 0,
        body: "<p>Welcome to Inbox Pro! We're excited to have you on board.</p><p>Your account has been successfully activated with all premium features enabled.</p><p>If you have any questions, please don't hesitate to contact our support team.</p>",
        to: ["user@example.com"],
        cc: [],
        bcc: []
    },
    {
        id: 2,
        sender: "John Smith",
        senderEmail: "john.smith@business.com",
        subject: "Meeting Tomorrow",
        preview: "Hi, let's discuss the project updates...",
        date: "Today, 09:15 AM",
        unread: true,
        important: false,
        folder: "inbox",
        attachments: 2,
        body: "<p>Hi team,</p><p>Let's meet tomorrow at 11 AM to discuss the project updates.</p><p>Please bring the latest reports.</p><p>Best regards,<br>John</p>",
        to: ["team@company.com"],
        cc: ["manager@company.com"],
        bcc: []
    },
    {
        id: 3,
        sender: "Newsletter",
        senderEmail: "news@tech.com",
        subject: "Weekly Tech Digest",
        preview: "Latest news in technology and innovation...",
        date: "Yesterday, 14:20",
        unread: true,
        important: false,
        folder: "inbox",
        attachments: 0,
        body: "<p>This week in tech:</p><ul><li>New AI breakthroughs</li><li>Latest smartphone releases</li><li>Cybersecurity updates</li></ul>",
        to: ["subscribers@tech.com"],
        cc: [],
        bcc: []
    },
    {
        id: 4,
        sender: "Alice Johnson",
        senderEmail: "alice@design.com",
        subject: "Design Mockups Ready",
        preview: "I've completed the design mockups for review...",
        date: "Yesterday, 11:45",
        unread: false,
        important: true,
        folder: "inbox",
        attachments: 3,
        body: "<p>Hello,</p><p>The design mockups are ready for your review. Please check the attachments.</p><p>Looking forward to your feedback.</p>",
        to: ["review@design.com"],
        cc: [],
        bcc: []
    },
    {
        id: 5,
        sender: "System Alert",
        senderEmail: "noreply@system.com",
        subject: "Security Update Required",
        preview: "Your account requires a security update...",
        date: "Mar 12, 08:30",
        unread: false,
        important: false,
        folder: "inbox",
        attachments: 1,
        body: "<p>Security Update Required</p><p>Please update your security settings to continue using all features.</p>",
        to: ["user@example.com"],
        cc: [],
        bcc: []
    }
];

// ====================== LANGUAGE TRANSLATIONS ======================
const translations = {
    en: {
        // Login
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
        passwordHint: "Min. 8 characters with letters & numbers",
        createAccountBtn: "Create Account",
        alreadyHaveAccount: "Already have an account?",
        
        // Features
        aiFilter: "AI Spam Filter",
        smartSorting: "Smart Sorting",
        securePrivate: "Secure & Private",
        
        // Header
        aiActive: "AI Active",
        searchPlaceholder: "Search emails, contacts, subjects...",
        refresh: "Refresh",
        
        // Themes
        lightTheme: "Light",
        darkTheme: "Dark",
        oledTheme: "OLED",
        blueTheme: "Ocean",
        
        // AI Status
        aiOrganizing: "AI is organizing your inbox. <strong>15</strong> emails sorted automatically.",
        
        // Sidebar
        compose: "Compose",
        archive: "Archive",
        important: "Important",
        delete: "Delete",
        snooze: "Snooze",
        folders: "Folders",
        inbox: "Inbox",
        sent: "Sent",
        drafts: "Drafts",
        spam: "Spam",
        trash: "Trash",
        labels: "Labels",
        work: "Work",
        personal: "Personal",
        travel: "Travel",
        finance: "Finance",
        social: "Social",
        emailStats: "Email Stats",
        total: "Total",
        unread: "Unread",
        storage: "Storage",
        kyiv: "Kyiv, UA",
        
        // Content
        newest: "Newest first",
        oldest: "Oldest first",
        importantFirst: "Important first",
        unreadFirst: "Unread first",
        all: "All",
        withAttachments: "With Attachments",
        moreFilters: "More Filters",
        back: "Back",
        selectEmail: "Select an email",
        verified: "Verified",
        secure: "Secure",
        to: "To:",
        cc: "CC:",
        selectEmailDesc: "Select an email to read its content",
        attachments: "Attachments",
        downloadAll: "Download All",
        quickReply: "Quick Reply",
        print: "Print",
        report: "Report",
        replyPlaceholder: "Type your reply...",
        send: "Send",
        cancel: "Cancel",
        
        // Pagination
        previous: "Previous",
        next: "Next",
        
        // Bottom bar
        systemOperational: "All systems operational",
        syncing: "Syncing...",
        loading: "Loading...",
        
        // Settings
        userSettings: "User Settings",
        profile: "Profile",
        appearance: "Appearance",
        notifications: "Notifications",
        security: "Security",
        advanced: "Advanced",
        saveChanges: "Save Changes",
        
        // Compose
        newMessage: "New Message",
        to: "To",
        cc: "CC",
        bcc: "BCC",
        subject: "Subject",
        message: "Write your message here...",
        addAttachment: "Add Attachment",
        maxSize: "Max 25MB each",
        urgent: "Mark as Urgent",
        readReceipt: "Request read receipt",
        encrypt: "Encrypt message",
        schedule: "Schedule",
        discard: "Discard",
        emptyTrash: "Empty Trash"
    },
    ua: {
        welcomeBack: "З поверненням",
        emailAddress: "Електронна адреса",
        password: "Пароль",
        rememberMe: "Запам'ятати мене",
        forgotPassword: "Забули пароль?",
        signIn: "Увійти",
        newUser: "Новий користувач?",
        createAccount: "Створити акаунт",
        fullName: "Повне ім'я",
        confirmPassword: "Підтвердіть пароль",
        passwordHint: "Мін. 8 символів з буквами та цифрами",
        createAccountBtn: "Створити акаунт",
        alreadyHaveAccount: "Вже є акаунт?",
        aiFilter: "AI-фільтр спаму",
        smartSorting: "Розумне сортування",
        securePrivate: "Безпечно та приватно",
        aiActive: "AI активний",
        searchPlaceholder: "Пошук листів, контактів, тем...",
        refresh: "Оновити",
        lightTheme: "Світла",
        darkTheme: "Темна",
        oledTheme: "OLED",
        blueTheme: "Океан",
        aiOrganizing: "AI організовує вашу пошту. <strong>15</strong> листів відсортовано.",
        compose: "Написати",
        archive: "Архів",
        important: "Важливі",
        delete: "Видалити",
        snooze: "Відкласти",
        folders: "Папки",
        inbox: "Вхідні",
        sent: "Надіслані",
        drafts: "Чернетки",
        spam: "Спам",
        trash: "Сміття",
        labels: "Мітки",
        work: "Робота",
        personal: "Особисте",
        travel: "Подорожі",
        finance: "Фінанси",
        social: "Соціальне",
        emailStats: "Статистика",
        total: "Всього",
        unread: "Непрочитані",
        storage: "Сховище",
        kyiv: "Київ, UA",
        newest: "Спочатку нові",
        oldest: "Спочатку старі",
        importantFirst: "Спочатку важливі",
        unreadFirst: "Спочатку непрочитані",
        all: "Всі",
        withAttachments: "З вкладеннями",
        moreFilters: "Більше фільтрів",
        back: "Назад",
        selectEmail: "Виберіть лист",
        verified: "Підтверджено",
        secure: "Безпечно",
        to: "Кому:",
        cc: "Копія:",
        selectEmailDesc: "Виберіть лист для перегляду",
        attachments: "Вкладення",
        downloadAll: "Завантажити все",
        quickReply: "Швидка відповідь",
        print: "Друк",
        report: "Поскаржитися",
        replyPlaceholder: "Введіть вашу відповідь...",
        send: "Надіслати",
        cancel: "Скасувати",
        previous: "Назад",
        next: "Далі",
        systemOperational: "Всі системи працюють",
        syncing: "Синхронізація...",
        loading: "Завантаження...",
        userSettings: "Налаштування",
        profile: "Профіль",
        appearance: "Зовнішній вигляд",
        notifications: "Сповіщення",
        security: "Безпека",
        advanced: "Додатково",
        saveChanges: "Зберегти зміни",
        newMessage: "Нове повідомлення",
        to: "Кому",
        cc: "Копія",
        bcc: "Прихована копія",
        subject: "Тема",
        message: "Напишіть ваше повідомлення...",
        addAttachment: "Додати файл",
        maxSize: "Макс. 25MB кожен",
        urgent: "Позначити як термінове",
        readReceipt: "Запит підтвердження прочитання",
        encrypt: "Зашифрувати повідомлення",
        schedule: "Запланувати",
        discard: "Скасувати",
        emptyTrash: "Очистити сміття"
    },
    ru: {
        welcomeBack: "С возвращением",
        emailAddress: "Электронная почта",
        password: "Пароль",
        rememberMe: "Запомнить меня",
        forgotPassword: "Забыли пароль?",
        signIn: "Войти",
        newUser: "Новый пользователь?",
        createAccount: "Создать аккаунт",
        fullName: "Полное имя",
        confirmPassword: "Подтвердите пароль",
        passwordHint: "Мин. 8 символов с буквами и цифрами",
        createAccountBtn: "Создать аккаунт",
        alreadyHaveAccount: "Уже есть аккаунт?",
        aiFilter: "AI-фильтр спама",
        smartSorting: "Умная сортировка",
        securePrivate: "Безопасно и приватно",
        aiActive: "AI активен",
        searchPlaceholder: "Поиск писем, контактов, тем...",
        refresh: "Обновить",
        lightTheme: "Светлая",
        darkTheme: "Темная",
        oledTheme: "OLED",
        blueTheme: "Океан",
        aiOrganizing: "AI организует вашу почту. <strong>15</strong> писем отсортировано.",
        compose: "Написать",
        archive: "Архив",
        important: "Важные",
        delete: "Удалить",
        snooze: "Отложить",
        folders: "Папки",
        inbox: "Входящие",
        sent: "Отправленные",
        drafts: "Черновики",
        spam: "Спам",
        trash: "Корзина",
        labels: "Метки",
        work: "Работа",
        personal: "Личное",
        travel: "Путешествия",
        finance: "Финансы",
        social: "Социальное",
        emailStats: "Статистика",
        total: "Всего",
        unread: "Непрочитанные",
        storage: "Хранилище",
        kyiv: "Киев, UA",
        newest: "Сначала новые",
        oldest: "Сначала старые",
        importantFirst: "Сначала важные",
        unreadFirst: "Сначала непрочитанные",
        all: "Все",
        withAttachments: "С вложениями",
        moreFilters: "Больше фильтров",
        back: "Назад",
        selectEmail: "Выберите письмо",
        verified: "Подтверждено",
        secure: "Безопасно",
        to: "Кому:",
        cc: "Копия:",
        selectEmailDesc: "Выберите письмо для просмотра",
        attachments: "Вложения",
        downloadAll: "Скачать все",
        quickReply: "Быстрый ответ",
        print: "Печать",
        report: "Пожаловаться",
        replyPlaceholder: "Введите ваш ответ...",
        send: "Отправить",
        cancel: "Отмена",
        previous: "Назад",
        next: "Далее",
        systemOperational: "Все системы работают",
        syncing: "Синхронизация...",
        loading: "Загрузка...",
        userSettings: "Настройки",
        profile: "Профиль",
        appearance: "Внешний вид",
        notifications: "Уведомления",
        security: "Безопасность",
        advanced: "Дополнительно",
        saveChanges: "Сохранить изменения",
        newMessage: "Новое сообщение",
        to: "Кому",
        cc: "Копия",
        bcc: "Скрытая копия",
        subject: "Тема",
        message: "Напишите ваше сообщение...",
        addAttachment: "Добавить файл",
        maxSize: "Макс. 25MB каждый",
        urgent: "Пометить как срочное",
        readReceipt: "Запрос подтверждения прочтения",
        encrypt: "Зашифровать сообщение",
        schedule: "Запланировать",
        discard: "Отменить",
        emptyTrash: "Очистить корзину"
    }
};

// ====================== UTILITY FUNCTIONS ======================
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function updateLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(element => {
        const key = element.getAttribute('data-i18n-ph');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (translations[lang] && translations[lang][key]) {
            element.title = translations[lang][key];
        }
    });
}

function updateTheme(theme) {
    currentTheme = theme;
    document.body.className = `${theme}-theme`;
    
    // Update theme menu active state
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        }
    });
    
    // Save to localStorage
    localStorage.setItem('inboxProTheme', theme);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ====================== EMAIL MANAGEMENT ======================
function initializeEmails() {
    // Clear existing emails
    Object.keys(emailsData).forEach(folder => {
        emailsData[folder] = [];
    });
    
    // Add sample emails to inbox
    emailsData.inbox = [...sampleEmails];
    
    // Add some emails to other folders
    emailsData.sent = [
        {
            id: 6,
            sender: currentUser ? currentUser.name : "You",
            senderEmail: currentUser ? currentUser.email : "you@example.com",
            subject: "Project Update",
            preview: "Here's the latest update on the project...",
            date: "Today, 08:00",
            unread: false,
            important: false,
            folder: "sent",
            attachments: 1
        }
    ];
    
    emailsData.drafts = [
        {
            id: 7,
            sender: currentUser ? currentUser.name : "You",
            senderEmail: currentUser ? currentUser.email : "you@example.com",
            subject: "Draft: Meeting Notes",
            preview: "Notes from yesterday's meeting...",
            date: "Yesterday, 16:30",
            unread: false,
            important: false,
            folder: "drafts",
            attachments: 0
        }
    ];
    
    emailsData.spam = [
        {
            id: 8,
            sender: "Spammer",
            senderEmail: "spam@fake.com",
            subject: "You won a prize!",
            preview: "Congratulations! You won $1,000,000...",
            date: "Mar 10, 23:45",
            unread: false,
            important: false,
            folder: "spam",
            attachments: 0
        }
    ];
    
    emailsData.important = emailsData.inbox.filter(email => email.important);
    emailsData.trash = [];
}

function updateEmailCounts() {
    // Update sidebar counts
    document.getElementById('inboxCount').textContent = emailsData.inbox.filter(e => e.unread).length;
    document.getElementById('importantCount').textContent = emailsData.important.length;
    document.getElementById('sentCount').textContent = emailsData.sent.length;
    document.getElementById('draftsCount').textContent = emailsData.drafts.length;
    document.getElementById('spamCount').textContent = emailsData.spam.length;
    document.getElementById('trashCount').textContent = emailsData.trash.length;
    
    // Update stats widget
    document.getElementById('totalEmails').textContent = emailsData.inbox.length;
    document.getElementById('unreadEmails').textContent = emailsData.inbox.filter(e => e.unread).length;
    document.getElementById('importantEmails').textContent = emailsData.important.length;
    
    // Update filter counts
    const folderEmails = emailsData[currentFolder] || [];
    document.querySelector('[data-filter="all"] .filter-count').textContent = folderEmails.length;
    document.querySelector('[data-filter="unread"] .filter-count').textContent = folderEmails.filter(e => e.unread).length;
    document.querySelector('[data-filter="important"] .filter-count').textContent = folderEmails.filter(e => e.important).length;
    document.querySelector('[data-filter="attachments"] .filter-count').textContent = folderEmails.filter(e => e.attachments > 0).length;
    
    // Update content header
    document.getElementById('emailCount').textContent = `${folderEmails.length} emails`;
    document.getElementById('unreadCount').textContent = `${folderEmails.filter(e => e.unread).length} unread`;
}

function displayEmails() {
    const emailsList = document.getElementById('emailsList');
    const folderEmails = emailsData[currentFolder] || [];
    
    // Clear existing emails
    emailsList.innerHTML = '';
    
    if (folderEmails.length === 0) {
        emailsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-envelope-open"></i>
                <h3>No emails</h3>
                <p>${translations[currentLanguage].selectEmailDesc}</p>
            </div>
        `;
        return;
    }
    
    // Display emails
    folderEmails.forEach(email => {
        const emailElement = document.createElement('div');
        emailElement.className = 'email';
        if (email.unread) emailElement.classList.add('unread');
        if (email.important) emailElement.classList.add('important');
        if (selectedEmails.has(email.id)) emailElement.classList.add('selected');
        
        // Get initials for avatar
        const initials = email.sender.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        emailElement.innerHTML = `
            <div class="email-checkbox">
                <input type="checkbox" class="email-select" data-id="${email.id}">
            </div>
            <div class="email-avatar">${initials}</div>
            <div class="email-content">
                <div class="email-header">
                    <div class="email-sender">${email.sender}</div>
                    <div class="email-date">${email.date}</div>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
                ${email.attachments > 0 ? `<div class="email-attachment"><i class="fas fa-paperclip"></i> ${email.attachments}</div>` : ''}
            </div>
        `;
        
        emailElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('email-select')) {
                selectEmail(email.id);
                displayEmailContent(email);
            }
        });
        
        emailsList.appendChild(emailElement);
    });
    
    // Update email checkboxes
    updateEmailCheckboxes();
}

function displayEmailContent(email) {
    const readerTitle = document.getElementById('readerTitle');
    const readerSender = document.getElementById('readerSender');
    const readerSenderEmail = document.getElementById('readerSenderEmail');
    const readerDate = document.getElementById('readerDate');
    const readerSubject = document.getElementById('readerSubject');
    const readerText = document.getElementById('readerText');
    const emailTo = document.getElementById('emailTo');
    const emailCc = document.getElementById('emailCc');
    const readerAvatar = document.getElementById('readerAvatar');
    const emailSize = document.getElementById('emailSize');
    
    // Update email info
    readerTitle.textContent = email.subject;
    readerSender.textContent = email.sender;
    readerSenderEmail.textContent = email.senderEmail;
    readerDate.innerHTML = `<i class="fas fa-clock"></i><span>${email.date}</span>`;
    readerSubject.textContent = email.subject;
    readerText.innerHTML = email.body || `<p>${translations[currentLanguage].selectEmailDesc}</p>`;
    emailTo.textContent = email.to.join(', ');
    emailCc.textContent = email.cc && email.cc.length > 0 ? email.cc.join(', ') : '—';
    
    // Update avatar
    const initials = email.sender.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    readerAvatar.textContent = initials;
    
    // Update attachments
    const attachmentsList = document.getElementById('attachmentsList');
    const attachmentCount = document.querySelector('.attachment-count');
    
    if (email.attachments > 0) {
        attachmentCount.textContent = `(${email.attachments})`;
        attachmentsList.innerHTML = `
            <div class="attachment-item">
                <div class="attachment-info">
                    <div class="attachment-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="attachment-details">
                        <div class="attachment-name">document.pdf</div>
                        <div class="attachment-size">1.2 MB</div>
                    </div>
                </div>
                <div class="attachment-actions">
                    <button class="action-btn" title="Download"><i class="fas fa-download"></i></button>
                    <button class="action-btn" title="Preview"><i class="fas fa-eye"></i></button>
                </div>
            </div>
        `;
    } else {
        attachmentCount.textContent = '(0)';
        attachmentsList.innerHTML = '<p class="no-attachments">No attachments</p>';
    }
    
    // Mark as read
    if (email.unread) {
        email.unread = false;
        updateEmailCounts();
        displayEmails();
    }
    
    // Update star button
    const starBtn = document.getElementById('starBtn');
    starBtn.innerHTML = email.important ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    
    // Show email reader on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'none';
        document.querySelector('.email-reader').style.display = 'flex';
        document.querySelector('.back-to-list').style.display = 'flex';
    }
}

function selectEmail(emailId) {
    if (selectedEmails.has(emailId)) {
        selectedEmails.delete(emailId);
    } else {
        selectedEmails.add(emailId);
    }
    displayEmails();
}

function selectAllEmails() {
    const folderEmails = emailsData[currentFolder] || [];
    if (selectedEmails.size === folderEmails.length) {
        selectedEmails.clear();
    } else {
        selectedEmails.clear();
        folderEmails.forEach(email => selectedEmails.add(email.id));
    }
    displayEmails();
}

function updateEmailCheckboxes() {
    document.querySelectorAll('.email-select').forEach(checkbox => {
        const emailId = parseInt(checkbox.dataset.id);
        checkbox.checked = selectedEmails.has(emailId);
        
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            if (checkbox.checked) {
                selectedEmails.add(emailId);
            } else {
                selectedEmails.delete(emailId);
            }
            displayEmails();
        });
    });
}

function markAsRead() {
    const folderEmails = emailsData[currentFolder] || [];
    folderEmails.forEach(email => {
        if (selectedEmails.has(email.id)) {
            email.unread = false;
        }
    });
    selectedEmails.clear();
    updateEmailCounts();
    displayEmails();
    showToast('Marked as read', 'success');
}

function markAsImportant() {
    const folderEmails = emailsData[currentFolder] || [];
    folderEmails.forEach(email => {
        if (selectedEmails.has(email.id)) {
            email.important = !email.important;
        }
    });
    
    // Update important folder
    emailsData.important = emailsData.inbox.filter(email => email.important);
    
    selectedEmails.clear();
    updateEmailCounts();
    displayEmails();
    showToast('Marked as important', 'success');
}

function deleteSelectedEmails() {
    if (selectedEmails.size === 0) return;
    
    const folderEmails = emailsData[currentFolder] || [];
    const emailsToDelete = folderEmails.filter(email => selectedEmails.has(email.id));
    
    // Move to trash
    emailsToDelete.forEach(email => {
        email.folder = 'trash';
        emailsData.trash.push(email);
    });
    
    // Remove from current folder
    emailsData[currentFolder] = folderEmails.filter(email => !selectedEmails.has(email.id));
    
    selectedEmails.clear();
    updateEmailCounts();
    displayEmails();
    showToast(`Moved ${emailsToDelete.length} email(s) to trash`, 'success');
}

function emptyTrash() {
    if (emailsData.trash.length === 0) {
        showToast('Trash is already empty', 'info');
        return;
    }
    
    if (confirm(`Are you sure you want to permanently delete ${emailsData.trash.length} email(s)?`)) {
        emailsData.trash = [];
        updateEmailCounts();
        displayEmails();
        showToast('Trash emptied', 'success');
    }
}

// ====================== FOLDER MANAGEMENT ======================
function switchFolder(folder) {
    currentFolder = folder;
    selectedEmails.clear();
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.folder === folder) {
            item.classList.add('active');
        }
    });
    
    // Update folder title
    const folderTitle = document.getElementById('currentFolder');
    const folderIcon = folder === 'inbox' ? 'fa-inbox' :
                      folder === 'important' ? 'fa-star' :
                      folder === 'sent' ? 'fa-paper-plane' :
                      folder === 'drafts' ? 'fa-file-alt' :
                      folder === 'spam' ? 'fa-ban' : 'fa-trash';
    
    folderTitle.innerHTML = `<i class="fas ${folderIcon}"></i> <span data-i18n="${folder}">${translations[currentLanguage][folder]}</span>`;
    
    // Show/hide empty trash button
    const emptyTrashBtn = document.getElementById('emptyTrashBtn');
    emptyTrashBtn.style.display = folder === 'trash' ? 'flex' : 'none';
    
    // Update UI
    updateEmailCounts();
    displayEmails();
    
    // Clear email reader
    document.getElementById('readerTitle').textContent = translations[currentLanguage].selectEmail;
    document.getElementById('readerText').innerHTML = `<p>${translations[currentLanguage].selectEmailDesc}</p>`;
    
    // On mobile, show emails list
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'flex';
        document.querySelector('.email-reader').style.display = 'none';
        document.querySelector('.back-to-list').style.display = 'none';
    }
}

// ====================== COMPOSE EMAIL ======================
function openComposeModal() {
    const modal = document.getElementById('composeModal');
    modal.style.display = 'flex';
    
    // Clear form
    document.getElementById('mailTo').value = '';
    document.getElementById('mailSubject').value = '';
    document.getElementById('mailText').value = '';
    document.getElementById('filePreview').innerHTML = '';
    
    // Focus on To field
    setTimeout(() => {
        document.getElementById('mailTo').focus();
    }, 100);
}

function sendEmail() {
    const to = document.getElementById('mailTo').value;
    const subject = document.getElementById('mailSubject').value;
    const body = document.getElementById('mailText').value;
    
    if (!to || !subject || !body) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Create new email
    const newEmail = {
        id: Date.now(),
        sender: currentUser ? currentUser.name : "You",
        senderEmail: currentUser ? currentUser.email : "you@example.com",
        subject: subject,
        preview: body.substring(0, 100) + '...',
        date: "Just now",
        unread: false,
        important: document.getElementById('urgentCheck').checked,
        folder: "sent",
        attachments: document.querySelectorAll('.file-preview-item').length,
        body: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
        to: to.split(',').map(e => e.trim())
    };
    
    // Add to sent folder
    emailsData.sent.unshift(newEmail);
    
    // Close modal
    closeComposeModal();
    
    // Show success message
    showToast('Email sent successfully', 'success');
    
    // Switch to sent folder
    switchFolder('sent');
}

function closeComposeModal() {
    document.getElementById('composeModal').style.display = 'none';
}

function toggleCcField() {
    const ccField = document.getElementById('ccField');
    ccField.style.display = ccField.style.display === 'none' ? 'block' : 'none';
    if (ccField.style.display === 'block') {
        document.getElementById('mailCc').focus();
    }
}

function toggleBccField() {
    const bccField = document.getElementById('bccField');
    bccField.style.display = bccField.style.display === 'none' ? 'block' : 'none';
    if (bccField.style.display === 'block') {
        document.getElementById('mailBcc').focus();
    }
}

// ====================== SETTINGS ======================
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'flex';
    showTab('profile');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

function showTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Show tab content
    const modalContent = document.querySelector('.modal-content');
    
    switch(tabName) {
        case 'profile':
            modalContent.innerHTML = `
                <div class="tab-content">
                    <div class="form-group">
                        <label for="settingsName"><i class="fas fa-user"></i> Full Name</label>
                        <input type="text" id="settingsName" value="${currentUser ? currentUser.name : ''}" placeholder="Your name">
                    </div>
                    <div class="form-group">
                        <label for="settingsEmail"><i class="fas fa-envelope"></i> Email Address</label>
                        <input type="email" id="settingsEmail" value="${currentUser ? currentUser.email : ''}" placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label for="settingsAvatar"><i class="fas fa-image"></i> Profile Picture</label>
                        <input type="file" id="settingsAvatar" accept="image/*">
                    </div>
                </div>
            `;
            break;
            
        case 'appearance':
            modalContent.innerHTML = `
                <div class="tab-content">
                    <h4>Theme</h4>
                    <div class="theme-options-settings">
                        <button class="theme-option-btn ${currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                            <i class="fas fa-sun"></i> Light
                        </button>
                        <button class="theme-option-btn ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                            <i class="fas fa-moon"></i> Dark
                        </button>
                        <button class="theme-option-btn ${currentTheme === 'oled' ? 'active' : ''}" data-theme="oled">
                            <i class="fas fa-circle"></i> OLED
                        </button>
                        <button class="theme-option-btn ${currentTheme === 'blue' ? 'active' : ''}" data-theme="blue">
                            <i class="fas fa-water"></i> Ocean
                        </button>
                    </div>
                    <h4>Density</h4>
                    <select id="densitySelect" class="settings-select">
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                        <option value="cozy">Cozy</option>
                    </select>
                </div>
            `;
            
            // Add event listeners for theme buttons
            document.querySelectorAll('.theme-option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.theme-option-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updateTheme(btn.dataset.theme);
                });
            });
            break;
            
        case 'notifications':
            modalContent.innerHTML = `
                <div class="tab-content">
                    <h4>Notification Settings</h4>
                    <label class="checkbox">
                        <input type="checkbox" id="notifyNewEmail" checked>
                        <span class="checkmark"></span>
                        <span>New email notifications</span>
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="notifyImportant" checked>
                        <span class="checkmark"></span>
                        <span>Important email alerts</span>
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="notifySound">
                        <span class="checkmark"></span>
                        <span>Play sound for notifications</span>
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="notifyDesktop">
                        <span class="checkmark"></span>
                        <span>Desktop notifications</span>
                    </label>
                </div>
            `;
            break;
            
        case 'security':
            modalContent.innerHTML = `
                <div class="tab-content">
                    <h4>Security Settings</h4>
                    <div class="form-group">
                        <label for="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" placeholder="••••••••">
                    </div>
                    <div class="form-group">
                        <label for="newPassword">New Password</label>
                        <input type="password" id="newPassword" placeholder="••••••••">
                    </div>
                    <div class="form-group">
                        <label for="confirmNewPassword">Confirm New Password</label>
                        <input type="password" id="confirmNewPassword" placeholder="••••••••">
                    </div>
                    <label class="checkbox">
                        <input type="checkbox" id="twoFactorAuth">
                        <span class="checkmark"></span>
                        <span>Two-factor authentication</span>
                    </label>
                </div>
            `;
            break;
            
        case 'advanced':
            modalContent.innerHTML = `
                <div class="tab-content">
                    <h4>Advanced Settings</h4>
                    <div class="form-group">
                        <label for="signature">Email Signature</label>
                        <textarea id="signature" rows="4" placeholder="Your email signature"></textarea>
                    </div>
                    <label class="checkbox">
                        <input type="checkbox" id="autoReply">
                        <span class="checkmark"></span>
                        <span>Auto-reply when away</span>
                    </label>
                    <div class="form-group">
                        <label for="replyMessage">Auto-reply Message</label>
                        <textarea id="replyMessage" rows="3" placeholder="I'm currently away from my email..."></textarea>
                    </div>
                    <label class="checkbox">
                        <input type="checkbox" id="spamFilter">
                        <span class="checkmark"></span>
                        <span>Aggressive spam filter</span>
                    </label>
                </div>
            `;
            break;
    }
}

function saveSettings() {
    // Update user info if changed
    if (currentUser) {
        const nameInput = document.getElementById('settingsName');
        const emailInput = document.getElementById('settingsEmail');
        
        if (nameInput) currentUser.name = nameInput.value;
        if (emailInput) currentUser.email = emailInput.value;
        
        // Update UI
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
    }
    
    showToast('Settings saved successfully', 'success');
    closeSettingsModal();
}

// ====================== EVENT LISTENERS ======================
function initializeEventListeners() {
    // Login/Register
    document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
    document.getElementById('registerBtn')?.addEventListener('click', handleRegister);
    document.getElementById('showRegister')?.addEventListener('click', showRegisterForm);
    document.getElementById('showLogin')?.addEventListener('click', showLoginForm);
    
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeMenu = document.getElementById('themeMenu');
        themeMenu.classList.toggle('show');
    });
    
    // Theme options
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            updateTheme(option.dataset.theme);
            document.getElementById('themeMenu').classList.remove('show');
        });
    });
    
    // Close theme menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-selector')) {
            document.getElementById('themeMenu').classList.remove('show');
        }
    });
    
    // Menu toggle for mobile
    document.getElementById('menuToggle')?.addEventListener('click', toggleSidebar);
    
    // Compose button
    document.getElementById('composeBtn')?.addEventListener('click', openComposeModal);
    
    // Compose modal
    document.getElementById('closeCompose')?.addEventListener('click', closeComposeModal);
    document.getElementById('sendMail')?.addEventListener('click', sendEmail);
    document.getElementById('addCcBtn')?.addEventListener('click', toggleCcField);
    document.getElementById('addBccBtn')?.addEventListener('click', toggleBccField);
    
    // File upload for compose
    document.getElementById('mailFile')?.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const preview = document.getElementById('filePreview');
        
        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-preview-item';
            item.innerHTML = `
                <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button class="remove-file" data-name="${file.name}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(item);
        });
    });
    
    // Settings
    document.getElementById('settingsBtn')?.addEventListener('click', openSettingsModal);
    document.getElementById('closeSettings')?.addEventListener('click', closeSettingsModal);
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    document.getElementById('cancelSettings')?.addEventListener('click', closeSettingsModal);
    
    // Settings tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });
    
    // Email actions
    document.getElementById('selectAllBtn')?.addEventListener('click', selectAllEmails);
    document.getElementById('markReadBtn')?.addEventListener('click', markAsRead);
    document.getElementById('archiveBtn')?.addEventListener('click', () => showToast('Archived', 'success'));
    document.getElementById('deleteSelectedBtn')?.addEventListener('click', deleteSelectedEmails);
    document.getElementById('emptyTrashBtn')?.addEventListener('click', emptyTrash);
    
    // Star button
    document.getElementById('starBtn')?.addEventListener('click', markAsImportant);
    
    // Delete email button
    document.getElementById('deleteEmailBtn')?.addEventListener('click', deleteSelectedEmails);
    
    // Back to list (mobile)
    document.getElementById('backToList')?.addEventListener('click', () => {
        document.querySelector('.emails').style.display = 'flex';
        document.querySelector('.email-reader').style.display = 'none';
        document.querySelector('.back-to-list').style.display = 'none';
    });
    
    // Quick actions in sidebar
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            switch(action) {
                case 'archive':
                    showToast('Archived', 'success');
                    break;
                case 'important':
                    markAsImportant();
                    break;
                case 'delete':
                    deleteSelectedEmails();
                    break;
                case 'snooze':
                    showToast('Snoozed until tomorrow', 'info');
                    break;
            }
        });
    });
    
    // Folder navigation
    document.querySelectorAll('.menu-item[data-folder]').forEach(item => {
        item.addEventListener('click', () => switchFolder(item.dataset.folder));
    });
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            emailView = this.dataset.view;
            // Here you would implement different view layouts
            showToast(`Switched to ${emailView} view`, 'info');
        });
    });
    
    // Filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // Here you would implement filtering logic
            showToast(`Filter: ${this.dataset.filter}`, 'info');
        });
    });
    
    // Language selector
    document.getElementById('langSelect')?.addEventListener('change', function() {
        updateLanguage(this.value);
    });
    
    // Sort selector
    document.getElementById('sortSelect')?.addEventListener('change', function() {
        showToast(`Sorted by: ${this.options[this.selectedIndex].text}`, 'info');
    });
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showToast('Inbox refreshed', 'success');
        }, 1000);
    });
    
    // Search
    document.getElementById('searchInput')?.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        // Here you would implement search logic
        if (searchTerm.length > 0) {
            showToast(`Searching for: ${searchTerm}`, 'info');
        }
    });
    
    document.getElementById('searchClear')?.addEventListener('click', function() {
        document.getElementById('searchInput').value = '';
    });
    
    // AI dismiss
    document.getElementById('aiDismiss')?.addEventListener('click', function() {
        document.getElementById('aiStatusBar').style.display = 'none';
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.querySelector('.sidebar').classList.remove('active');
            document.querySelector('.emails').style.display = 'flex';
            document.querySelector('.email-reader').style.display = 'flex';
            document.querySelector('.back-to-list').style.display = 'none';
        }
    });
}

// ====================== LOGIN/REGISTER ======================
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }
    
    // Simulate login process
    showLoading();
    
    setTimeout(() => {
        currentUser = {
            name: "John Doe",
            email: email,
            avatar: "JD"
        };
        
        // Switch to app
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.opacity = '1';
        
        // Initialize app
        initializeApp();
        
        hideLoading();
        showToast('Login successful', 'success');
    }, 1500);
}

function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    
    if (!name || !email || !password || !confirm) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Simulate registration process
    showLoading();
    
    setTimeout(() => {
        currentUser = {
            name: name,
            email: email,
            avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        };
        
        // Switch to app
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.opacity = '1';
        
        // Initialize app
        initializeApp();
        
        hideLoading();
        showToast('Registration successful', 'success');
    }, 1500);
}

function showRegisterForm(e) {
    e.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

function showLoginForm(e) {
    e.preventDefault();
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// ====================== INITIALIZE APP ======================
function initializeApp() {
    console.log('Inbox Pro starting...');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('inboxProTheme');
    if (savedTheme) {
        updateTheme(savedTheme);
    }
    
    // Set current language
    updateLanguage(currentLanguage);
    
    // Initialize email data
    initializeEmails();
    
    // Update UI
    updateEmailCounts();
    displayEmails();
    
    // Update user info in header
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userAvatar').innerHTML = `<span>${currentUser.avatar}</span><div class="user-status online"></div>`;
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Inbox Pro!', 'success');
    }, 1000);
    
    console.log('Inbox Pro ready');
}

// ====================== ON LOAD ======================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Check if user is already logged in (for demo purposes)
    const demoLogin = localStorage.getItem('inboxProDemoLogin');
    
    if (demoLogin === 'true') {
        // Auto-login for demo
        currentUser = {
            name: "John Doe",
            email: "john@example.com",
            avatar: "JD"
        };
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.opacity = '1';
        initializeApp();
    } else {
        // Show login screen
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('app').style.opacity = '0';
        
        // For demo purposes, pre-fill login form
        document.getElementById('loginEmail').value = 'demo@example.com';
        document.getElementById('loginPassword').value = 'password123';
    }
    
    // Add CSS for settings theme buttons
    const style = document.createElement('style');
    style.textContent = `
        .theme-options-settings {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .theme-option-btn {
            padding: 15px;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--text);
            cursor: pointer;
            transition: var(--transition);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .theme-option-btn:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
        }
        
        .theme-option-btn.active {
            background: var(--accent);
            color: white;
            border-color: var(--accent);
        }
        
        .theme-option-btn i {
            font-size: 1.5rem;
        }
        
        .settings-select {
            width: 100%;
            padding: 10px;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--text);
            margin-bottom: 20px;
        }
        
        .tab-content h4 {
            margin-bottom: 15px;
            color: var(--text);
        }
        
        .no-attachments {
            text-align: center;
            color: var(--text-secondary);
            padding: 20px;
            font-style: italic;
        }
        
        .email-checkbox {
            margin-right: 10px;
            display: flex;
            align-items: center;
        }
        
        .email-checkbox input {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        
        .email-attachment {
            position: absolute;
            right: 15px;
            bottom: 15px;
            color: var(--text-secondary);
            font-size: 0.8rem;
        }
        
        .remove-file {
            background: none;
            border: none;
            color: var(--danger);
            cursor: pointer;
            padding: 5px;
        }
        
        .remove-file:hover {
            color: var(--danger-hover);
        }
    `;
    document.head.appendChild(style);
});

// ====================== ERROR HANDLING ======================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// ====================== SERVICE WORKER (FOR PWA) ======================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ====================== OFFLINE SUPPORT ======================
window.addEventListener('online', function() {
    showToast('You are back online', 'success');
    document.getElementById('statusText').textContent = translations[currentLanguage].systemOperational;
});

window.addEventListener('offline', function() {
    showToast('You are offline', 'warning');
    document.getElementById('statusText').textContent = 'Offline - Some features may be unavailable';
});
