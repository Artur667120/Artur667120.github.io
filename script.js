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
let currentEmailFilter = 'all';

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
        attachments: 2,
        body: "<p>Welcome to Inbox Pro! We're excited to have you on board.</p><p>Your account has been successfully activated with all premium features enabled.</p><p>If you have any questions, please don't hesitate to contact our support team.</p>",
        to: ["user@example.com"],
        cc: [],
        bcc: [],
        labels: ["work"],
        size: "1.2 MB",
        deleted: false,
        deletedDate: null
    },
    {
        id: 2,
        sender: "John Smith",
        senderEmail: "john.smith@business.com",
        subject: "Meeting Tomorrow - Important Updates",
        preview: "Hi, let's discuss the project updates...",
        date: "Today, 09:15 AM",
        unread: true,
        important: true,
        folder: "inbox",
        attachments: 3,
        body: "<p>Hi team,</p><p>Let's meet tomorrow at 11 AM to discuss the project updates.</p><p>Please bring the latest reports and be prepared to present your findings.</p><p>Best regards,<br>John</p>",
        to: ["team@company.com"],
        cc: ["manager@company.com"],
        bcc: [],
        labels: ["work", "important"],
        size: "2.4 MB",
        deleted: false,
        deletedDate: null
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
        body: "<p>This week in tech:</p><ul><li>New AI breakthroughs announced</li><li>Latest smartphone releases reviewed</li><li>Cybersecurity updates and patches</li></ul><p>Stay tuned for more updates!</p>",
        to: ["subscribers@tech.com"],
        cc: [],
        bcc: [],
        labels: ["social"],
        size: "0.8 MB",
        deleted: false,
        deletedDate: null
    },
    {
        id: 4,
        sender: "Alice Johnson",
        senderEmail: "alice@design.com",
        subject: "Design Mockups Ready for Review",
        preview: "I've completed the design mockups for review...",
        date: "Yesterday, 11:45",
        unread: false,
        important: true,
        folder: "inbox",
        attachments: 1,
        body: "<p>Hello,</p><p>The design mockups are ready for your review. Please check the attachment.</p><p>Looking forward to your feedback.</p><p>Best,<br>Alice</p>",
        to: ["review@design.com"],
        cc: [],
        bcc: [],
        labels: ["work", "travel"],
        size: "3.1 MB",
        deleted: false,
        deletedDate: null
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
        body: "<p>Security Update Required</p><p>Please update your security settings to continue using all features.</p><p>Click the link below to proceed with the update.</p>",
        to: ["user@example.com"],
        cc: [],
        bcc: [],
        labels: ["finance"],
        size: "1.5 MB",
        deleted: false,
        deletedDate: null
    }
];

// ====================== MODELS DATA ======================
const attachmentModels = [
    {
        id: 1,
        name: "Project_Report.pdf",
        size: "2.4 MB",
        type: "pdf",
        icon: "fa-file-pdf",
        color: "#FF6B6B",
        date: "Today, 10:30 AM"
    },
    {
        id: 2,
        name: "Design_Mockup.fig",
        size: "5.7 MB",
        type: "figma",
        icon: "fa-figma",
        color: "#9D4EDD",
        date: "Today, 09:15 AM"
    },
    {
        id: 3,
        name: "Meeting_Notes.docx",
        size: "1.2 MB",
        type: "word",
        icon: "fa-file-word",
        color: "#2B579A",
        date: "Yesterday, 14:20"
    },
    {
        id: 4,
        name: "Budget_Spreadsheet.xlsx",
        size: "3.8 MB",
        type: "excel",
        icon: "fa-file-excel",
        color: "#217346",
        date: "Yesterday, 11:45"
    },
    {
        id: 5,
        name: "Presentation.pptx",
        size: "8.9 MB",
        type: "powerpoint",
        icon: "fa-file-powerpoint",
        color: "#D24726",
        date: "Mar 12, 08:30"
    },
    {
        id: 6,
        name: "Architecture_Diagram.zip",
        size: "12.5 MB",
        type: "archive",
        icon: "fa-file-archive",
        color: "#FFA726",
        date: "Mar 11, 16:45"
    },
    {
        id: 7,
        name: "Screenshot.png",
        size: "4.2 MB",
        type: "image",
        icon: "fa-file-image",
        color: "#4CAF50",
        date: "Mar 10, 12:30"
    },
    {
        id: 8,
        name: "Database_Backup.sql",
        size: "25.3 MB",
        type: "database",
        icon: "fa-database",
        color: "#2196F3",
        date: "Mar 9, 22:15"
    }
];

const emailModels = [
    {
        id: 101,
        sender: "AI Assistant",
        senderEmail: "ai@inboxpro.com",
        subject: "Your Weekly Productivity Report",
        preview: "Here's how you used Inbox Pro this week...",
        date: "Today, 08:00",
        unread: true,
        important: true,
        folder: "inbox",
        attachments: 3,
        body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #667eea; margin-bottom: 20px;">📊 Weekly Productivity Report</h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0;">Hello ${currentUser ? currentUser.name : 'User'}!</h3>
                <p style="margin: 0; opacity: 0.9;">Here's your productivity overview for this week</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #667eea;">42</div>
                    <div style="font-size: 14px; color: #666;">Emails Processed</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #10b981;">8h 15m</div>
                    <div style="font-size: 14px; color: #666;">Time Saved</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">94%</div>
                    <div style="font-size: 14px; color: #666;">Inbox Clean</div>
                </div>
            </div>
            
            <h3 style="color: #333; margin-bottom: 15px;">🎯 Top Achievements</h3>
            <ul style="padding-left: 20px; margin-bottom: 25px;">
                <li>Cleared 15 spam emails automatically</li>
                <li>Sorted 8 important emails with AI</li>
                <li>Responded to 12 emails with smart replies</li>
                <li>Organized 5 projects with labels</li>
            </ul>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 10px 0; color: #1976d2;">💡 Pro Tip</h4>
                <p style="margin: 0;">Use the "Snooze" feature for emails that need attention later. This keeps your inbox focused on what matters now.</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">Keep up the great work!<br>Your AI Assistant 🤖</p>
        </div>`,
        to: ["user@example.com"],
        cc: [],
        bcc: [],
        labels: ["work", "ai"],
        size: "2.1 MB",
        deleted: false,
        deletedDate: null
    },
    {
        id: 102,
        sender: "Weather Service",
        senderEmail: "weather@forecast.com",
        subject: "Weather Alert: Storm Warning",
        preview: "Important weather update for your area...",
        date: "Today, 07:45",
        unread: true,
        important: true,
        folder: "inbox",
        attachments: 1,
        body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0;">⚠️ WEATHER ALERT</h2>
                <p style="margin: 0; opacity: 0.9;">Severe Storm Warning for Kyiv Area</p>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #ffc107;"></i>
                <div>
                    <h3 style="margin: 0 0 5px 0; color: #856404;">Warning Level: HIGH</h3>
                    <p style="margin: 0; color: #856404;">Issued: Today at 07:30 | Valid until: 18:00</p>
                </div>
            </div>
            
            <h3 style="color: #333; margin-bottom: 15px;">🌩️ Expected Conditions</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">🌧️</div>
                    <div style="font-weight: bold;">Heavy Rain</div>
                    <div style="font-size: 14px; color: #666;">40-60 mm</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">💨</div>
                    <div style="font-weight: bold;">Strong Winds</div>
                    <div style="font-size: 14px; color: #666;">70-90 km/h</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">⚡</div>
                    <div style="font-weight: bold;">Thunderstorms</div>
                    <div style="font-size: 14px; color: #666;">Likely</div>
                </div>
            </div>
            
            <h3 style="color: #333; margin-bottom: 15px;">🛡️ Safety Recommendations</h3>
            <ol style="padding-left: 20px; margin-bottom: 25px;">
                <li>Avoid unnecessary travel</li>
                <li>Secure outdoor objects</li>
                <li>Stay away from windows</li>
                <li>Keep electronic devices charged</li>
                <li>Monitor local news for updates</li>
            </ol>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #2e7d32;">ℹ️ Additional Information</h4>
                <p style="margin: 0;">This alert will be updated as conditions change. For emergency assistance, call 112.</p>
            </div>
        </div>`,
        to: ["residents@kyiv.ua"],
        cc: [],
        bcc: [],
        labels: ["travel", "important"],
        size: "1.8 MB",
        deleted: false,
        deletedDate: null
    },
    {
        id: 103,
        sender: "Finance Department",
        senderEmail: "finance@company.com",
        subject: "Monthly Expense Report & Invoice",
        preview: "Your monthly financial summary is ready...",
        date: "Yesterday, 16:30",
        unread: false,
        important: true,
        folder: "inbox",
        attachments: 2,
        body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0;">💰 Monthly Financial Report</h2>
                <p style="margin: 0; opacity: 0.9;">March 2024 - Summary & Analysis</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Total Income</div>
                    <div style="font-size: 24px; font-weight: bold; color: #10b981;">$12,450.00</div>
                    <div style="font-size: 12px; color: #10b981;">↑ 8.5% from last month</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Total Expenses</div>
                    <div style="font-size: 24px; font-weight: bold; color: #ef4444;">$8,720.50</div>
                    <div style="font-size: 12px; color: #ef4444;">↑ 3.2% from last month</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Net Profit</div>
                    <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">$3,729.50</div>
                    <div style="font-size: 12px; color: #3b82f6;">↑ 15.7% from last month</div>
                </div>
            </div>
            
            <h3 style="color: #333; margin-bottom: 15px;">📈 Expense Breakdown</h3>
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Office Supplies</span>
                    <span style="font-weight: bold;">$450.00</span>
                </div>
                <div style="height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 12px;">
                    <div style="width: 15%; height: 100%; background: #3b82f6; border-radius: 4px;"></div>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Software Subscriptions</span>
                    <span style="font-weight: bold;">$1,250.00</span>
                </div>
                <div style="height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 12px;">
                    <div style="width: 25%; height: 100%; background: #8b5cf6; border-radius: 4px;"></div>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Marketing & Advertising</span>
                    <span style="font-weight: bold;">$3,500.00</span>
                </div>
                <div style="height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 12px;">
                    <div style="width: 70%; height: 100%; background: #10b981; border-radius: 4px;"></div>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Travel & Entertainment</span>
                    <span style="font-weight: bold;">$1,200.00</span>
                </div>
                <div style="height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 12px;">
                    <div style="width: 24%; height: 100%; background: #f59e0b; border-radius: 4px;"></div>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Other Expenses</span>
                    <span style="font-weight: bold;">$2,320.50</span>
                </div>
                <div style="height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 12px;">
                    <div style="width: 46%; height: 100%; background: #ef4444; border-radius: 4px;"></div>
                </div>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">📋 Action Required</h4>
                <p style="margin: 0;">Please review the attached invoice and submit payment by <strong>March 31, 2024</strong>. Late payments may incur additional fees.</p>
            </div>
        </div>`,
        to: ["accounting@company.com"],
        cc: ["manager@company.com"],
        bcc: [],
        labels: ["finance", "work", "important"],
        size: "3.5 MB",
        deleted: false,
        deletedDate: null
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
        emptyTrash: "Empty Trash",
        signOut: "Sign Out",
        
        // Delete confirmation
        confirmDelete: "Confirm Delete",
        deleteMessage: "Are you sure you want to delete this email?",
        deleteMultipleMessage: "Are you sure you want to delete {count} emails?",
        deleteWarning: "Deleted emails will be moved to Trash and stored for 30 days before permanent deletion.",
        delete: "Delete",
        cancel: "Cancel",
        permanentlyDelete: "Permanently Delete",
        restore: "Restore",
        
        // Models
        models: "Models",
        documents: "Documents",
        images: "Images",
        archives: "Archives",
        allFiles: "All Files",
        recent: "Recent",
        starred: "Starred",
        shared: "Shared"
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
        emptyTrash: "Очистити сміття",
        signOut: "Вийти",
        confirmDelete: "Підтвердити видалення",
        deleteMessage: "Ви впевнені, що хочете видалити цей лист?",
        deleteMultipleMessage: "Ви впевнені, що хочете видалити {count} листів?",
        deleteWarning: "Видалені листи будуть переміщені в кошик та зберігатимуться 30 днів перед остаточним видаленням.",
        delete: "Видалити",
        cancel: "Скасувати",
        permanentlyDelete: "Видалити назавжди",
        restore: "Відновити",
        models: "Моделі",
        documents: "Документи",
        images: "Зображення",
        archives: "Архіви",
        allFiles: "Всі файли",
        recent: "Нещодавні",
        starred: "Помічені",
        shared: "Спільні"
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
        discard: "Отмена",
        emptyTrash: "Очистить корзину",
        signOut: "Выйти",
        confirmDelete: "Подтвердить удаление",
        deleteMessage: "Вы уверены, что хотите удалить это письмо?",
        deleteMultipleMessage: "Вы уверены, что хотите удалить {count} писем?",
        deleteWarning: "Удаленные письма будут перемещены в корзину и храниться 30 дней перед окончательным удалением.",
        delete: "Удалить",
        cancel: "Отмена",
        permanentlyDelete: "Удалить навсегда",
        restore: "Восстановить",
        models: "Модели",
        documents: "Документы",
        images: "Изображения",
        archives: "Архивы",
        allFiles: "Все файлы",
        recent: "Недавние",
        starred: "Отмеченные",
        shared: "Общие"
    },
    de: {
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
        passwordHint: "Mind. 8 Zeichen mit Buchstaben und Zahlen",
        createAccountBtn: "Konto erstellen",
        alreadyHaveAccount: "Bereits ein Konto?",
        aiFilter: "AI-Spamfilter",
        smartSorting: "Intelligente Sortierung",
        securePrivate: "Sicher und privat",
        aiActive: "AI aktiv",
        searchPlaceholder: "E-Mails, Kontakte, Betreffe suchen...",
        refresh: "Aktualisieren",
        lightTheme: "Hell",
        darkTheme: "Dunkel",
        oledTheme: "OLED",
        blueTheme: "Ozean",
        aiOrganizing: "AI organisiert Ihren Posteingang. <strong>15</strong> E-Mails automatisch sortiert.",
        compose: "Verfassen",
        archive: "Archiv",
        important: "Wichtig",
        delete: "Löschen",
        snooze: "Verschieben",
        folders: "Ordner",
        inbox: "Posteingang",
        sent: "Gesendet",
        drafts: "Entwürfe",
        spam: "Spam",
        trash: "Papierkorb",
        labels: "Labels",
        work: "Arbeit",
        personal: "Persönlich",
        travel: "Reisen",
        finance: "Finanzen",
        social: "Sozial",
        emailStats: "E-Mail-Statistik",
        total: "Gesamt",
        unread: "Ungelesen",
        storage: "Speicher",
        kyiv: "Kiew, UA",
        newest: "Neueste zuerst",
        oldest: "Älteste zuerst",
        importantFirst: "Wichtige zuerst",
        unreadFirst: "Ungelesene zuerst",
        all: "Alle",
        withAttachments: "Mit Anhängen",
        moreFilters: "Mehr Filter",
        back: "Zurück",
        selectEmail: "Wählen Sie eine E-Mail",
        verified: "Verifiziert",
        secure: "Sicher",
        to: "An:",
        cc: "CC:",
        selectEmailDesc: "Wählen Sie eine E-Mail zum Lesen",
        attachments: "Anhänge",
        downloadAll: "Alle herunterladen",
        quickReply: "Schnelle Antwort",
        print: "Drucken",
        report: "Melden",
        replyPlaceholder: "Geben Sie Ihre Antwort ein...",
        send: "Senden",
        cancel: "Abbrechen",
        previous: "Zurück",
        next: "Weiter",
        systemOperational: "Alle Systeme funktionieren",
        syncing: "Synchronisierung...",
        loading: "Laden...",
        userSettings: "Benutzereinstellungen",
        profile: "Profil",
        appearance: "Erscheinungsbild",
        notifications: "Benachrichtigungen",
        security: "Sicherheit",
        advanced: "Erweitert",
        saveChanges: "Änderungen speichern",
        newMessage: "Neue Nachricht",
        to: "An",
        cc: "CC",
        bcc: "BCC",
        subject: "Betreff",
        message: "Schreiben Sie Ihre Nachricht hier...",
        addAttachment: "Anhang hinzufügen",
        maxSize: "Max. 25MB pro Datei",
        urgent: "Als dringend markieren",
        readReceipt: "Lesebestätigung anfordern",
        encrypt: "Nachricht verschlüsseln",
        schedule: "Planen",
        discard: "Verwerfen",
        emptyTrash: "Papierkorb leeren",
        signOut: "Abmelden",
        confirmDelete: "Löschen bestätigen",
        deleteMessage: "Sind Sie sicher, dass Sie diese E-Mail löschen möchten?",
        deleteMultipleMessage: "Sind Sie sicher, dass Sie {count} E-Mails löschen möchten?",
        deleteWarning: "Gelöschte E-Mails werden in den Papierkorb verschoben und 30 Tage lang aufbewahrt, bevor sie endgültig gelöscht werden.",
        delete: "Löschen",
        cancel: "Abbrechen",
        permanentlyDelete: "Endgültig löschen",
        restore: "Wiederherstellen",
        models: "Modelle",
        documents: "Dokumente",
        images: "Bilder",
        archives: "Archive",
        allFiles: "Alle Dateien",
        recent: "Kürzlich",
        starred: "Favorisiert",
        shared: "Geteilt"
    }
};

// ====================== UTILITY FUNCTIONS ======================
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
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
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

function updateLanguage(lang) {
    currentLanguage = lang;
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = lang;
    
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
    try {
        localStorage.setItem('inboxProTheme', theme);
    } catch (e) {
        console.log('Could not save theme to localStorage:', e);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

// ====================== EMAIL MANAGEMENT ======================
function initializeEmails() {
    // Clear existing emails
    Object.keys(emailsData).forEach(folder => {
        emailsData[folder] = [];
    });
    
    // Add sample emails to inbox
    emailsData.inbox = [...sampleEmails];
    
    // Add model emails
    emailsData.inbox.push(...emailModels);
    
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
            attachments: 1,
            body: "<p>Hi team,</p><p>Here's the latest project update as promised.</p><p>Best regards,<br>" + (currentUser ? currentUser.name : "You") + "</p>",
            to: ["team@company.com"],
            cc: [],
            bcc: [],
            labels: ["work"],
            size: "1.8 MB",
            deleted: false,
            deletedDate: null
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
            attachments: 0,
            body: "<p>Meeting notes from yesterday...</p>",
            to: ["colleague@company.com"],
            cc: [],
            bcc: [],
            labels: ["work"],
            size: "0.5 MB",
            deleted: false,
            deletedDate: null
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
            attachments: 0,
            body: "<p>This is a spam email.</p>",
            to: ["user@example.com"],
            cc: [],
            bcc: [],
            labels: [],
            size: "0.2 MB",
            deleted: false,
            deletedDate: null
        }
    ];
    
    emailsData.important = emailsData.inbox.filter(email => email.important);
    emailsData.trash = [];
}

function updateEmailCounts() {
    // Update sidebar counts
    const inboxCount = document.getElementById('inboxCount');
    const importantCount = document.getElementById('importantCount');
    const sentCount = document.getElementById('sentCount');
    const draftsCount = document.getElementById('draftsCount');
    const spamCount = document.getElementById('spamCount');
    const trashCount = document.getElementById('trashCount');
    
    if (inboxCount) inboxCount.textContent = emailsData.inbox.filter(e => e.unread).length;
    if (importantCount) importantCount.textContent = emailsData.important.length;
    if (sentCount) sentCount.textContent = emailsData.sent.length;
    if (draftsCount) draftsCount.textContent = emailsData.drafts.length;
    if (spamCount) spamCount.textContent = emailsData.spam.length;
    if (trashCount) trashCount.textContent = emailsData.trash.length;
    
    // Update stats widget
    const totalEmails = document.getElementById('totalEmails');
    const unreadEmails = document.getElementById('unreadEmails');
    const importantEmails = document.getElementById('importantEmails');
    
    if (totalEmails) totalEmails.textContent = emailsData.inbox.length;
    if (unreadEmails) unreadEmails.textContent = emailsData.inbox.filter(e => e.unread).length;
    if (importantEmails) importantEmails.textContent = emailsData.important.length;
    
    // Update filter counts
    const folderEmails = emailsData[currentFolder] || [];
    
    const allFilter = document.querySelector('[data-filter="all"] .filter-count');
    const unreadFilter = document.querySelector('[data-filter="unread"] .filter-count');
    const importantFilter = document.querySelector('[data-filter="important"] .filter-count');
    const attachmentsFilter = document.querySelector('[data-filter="attachments"] .filter-count');
    
    if (allFilter) allFilter.textContent = folderEmails.length;
    if (unreadFilter) unreadFilter.textContent = folderEmails.filter(e => e.unread).length;
    if (importantFilter) importantFilter.textContent = folderEmails.filter(e => e.important).length;
    if (attachmentsFilter) attachmentsFilter.textContent = folderEmails.filter(e => e.attachments > 0).length;
    
    // Update content header
    const emailCount = document.getElementById('emailCount');
    const unreadCount = document.getElementById('unreadCount');
    
    if (emailCount) emailCount.textContent = `${folderEmails.length} emails`;
    if (unreadCount) unreadCount.textContent = `${folderEmails.filter(e => e.unread).length} unread`;
}

function getFilteredEmails() {
    let folderEmails = emailsData[currentFolder] || [];
    
    // Apply filter
    if (currentEmailFilter === 'unread') {
        folderEmails = folderEmails.filter(email => email.unread);
    } else if (currentEmailFilter === 'important') {
        folderEmails = folderEmails.filter(email => email.important);
    } else if (currentEmailFilter === 'attachments') {
        folderEmails = folderEmails.filter(email => email.attachments > 0);
    }
    
    return folderEmails;
}

function displayEmails() {
    const emailsList = document.getElementById('emailsList');
    const folderEmails = getFilteredEmails();
    
    if (!emailsList) return;
    
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
        
        // Check if email has AI label
        const hasAI = email.labels && email.labels.includes('ai');
        
        emailElement.innerHTML = `
            <div class="email-checkbox">
                <input type="checkbox" class="email-select" data-id="${email.id}" ${selectedEmails.has(email.id) ? 'checked' : ''}>
            </div>
            <div class="email-avatar" style="${hasAI ? 'background: linear-gradient(135deg, #667eea, #9d4edd);' : ''}">
                ${initials}
                ${hasAI ? '<div class="ai-badge"><i class="fas fa-robot"></i></div>' : ''}
            </div>
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
    
    if (!readerTitle || !readerSender || !readerText) return;
    
    // Update email info
    readerTitle.textContent = email.subject;
    readerSender.textContent = email.sender;
    if (readerSenderEmail) readerSenderEmail.textContent = email.senderEmail;
    if (readerDate) {
        const dateSpan = readerDate.querySelector('span');
        if (dateSpan) dateSpan.textContent = email.date;
    }
    if (readerSubject) readerSubject.textContent = email.subject;
    readerText.innerHTML = email.body || `<p>${translations[currentLanguage].selectEmailDesc}</p>`;
    if (emailTo) emailTo.textContent = email.to.join(', ');
    if (emailCc) emailCc.textContent = email.cc && email.cc.length > 0 ? email.cc.join(', ') : '—';
    
    // Update avatar
    const initials = email.sender.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    if (readerAvatar) {
        readerAvatar.textContent = initials;
        // Check if email has AI label
        const hasAI = email.labels && email.labels.includes('ai');
        if (hasAI) {
            readerAvatar.style.background = 'linear-gradient(135deg, #667eea, #9d4edd)';
            readerAvatar.innerHTML = `${initials}<div class="ai-badge"><i class="fas fa-robot"></i></div>`;
        }
    }
    
    // Update email size
    if (emailSize) {
        const sizeSpan = emailSize.querySelector('span');
        if (sizeSpan && email.size) sizeSpan.textContent = email.size;
    }
    
    // Update attachments
    const attachmentsList = document.getElementById('attachmentsList');
    const attachmentCount = document.querySelector('.attachment-count');
    
    if (email.attachments > 0) {
        if (attachmentCount) attachmentCount.textContent = `(${email.attachments})`;
        if (attachmentsList) {
            attachmentsList.innerHTML = '';
            
            // Create attachments from models
            for (let i = 0; i < Math.min(email.attachments, attachmentModels.length); i++) {
                const model = attachmentModels[i];
                const attachmentItem = document.createElement('div');
                attachmentItem.className = 'attachment-item';
                attachmentItem.innerHTML = `
                    <div class="attachment-info">
                        <div class="attachment-icon" style="color: ${model.color};">
                            <i class="fas ${model.icon}"></i>
                        </div>
                        <div class="attachment-details">
                            <div class="attachment-name">${model.name}</div>
                            <div class="attachment-size">${model.size} • ${model.date}</div>
                        </div>
                    </div>
                    <div class="attachment-actions">
                        <button class="action-btn download-attachment-btn" data-filename="${model.name}" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="action-btn preview-attachment-btn" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                `;
                attachmentsList.appendChild(attachmentItem);
            }
            
            // Add download functionality
            document.querySelectorAll('.download-attachment-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const filename = this.getAttribute('data-filename');
                    downloadAttachment(filename);
                });
            });
            
            // Add preview functionality
            document.querySelectorAll('.preview-attachment-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showToast(`Previewing ${this.closest('.attachment-item').querySelector('.attachment-name').textContent}`, 'info');
                });
            });
        }
    } else {
        if (attachmentCount) attachmentCount.textContent = '(0)';
        if (attachmentsList) attachmentsList.innerHTML = '<p class="no-attachments">No attachments</p>';
    }
    
    // Update email labels
    const emailLabels = document.getElementById('emailLabels');
    if (emailLabels && email.labels && email.labels.length > 0) {
        emailLabels.innerHTML = email.labels.map(label => 
            `<span class="label ${label}-label">${translations[currentLanguage][label] || label}</span>`
        ).join('');
    }
    
    // Mark as read
    if (email.unread) {
        email.unread = false;
        updateEmailCounts();
        displayEmails();
    }
    
    // Update star button
    const starBtn = document.getElementById('starBtn');
    if (starBtn) {
        if (email.important) {
            starBtn.innerHTML = '<i class="fas fa-star"></i>';
            starBtn.style.color = 'var(--warning)';
        } else {
            starBtn.innerHTML = '<i class="far fa-star"></i>';
            starBtn.style.color = '';
        }
    }
    
    // Set current email ID for actions
    starBtn.dataset.emailId = email.id;
    const deleteEmailBtn = document.getElementById('deleteEmailBtn');
    if (deleteEmailBtn) deleteEmailBtn.dataset.emailId = email.id;
    
    // Show email reader on mobile
    if (window.innerWidth <= 768) {
        const emailsDiv = document.querySelector('.emails');
        const emailReader = document.querySelector('.email-reader');
        const backToList = document.querySelector('.back-to-list');
        
        if (emailsDiv) emailsDiv.style.display = 'none';
        if (emailReader) emailReader.style.display = 'flex';
        if (backToList) backToList.style.display = 'flex';
    }
}

function downloadAttachment(filename) {
    showToast(`Downloading ${filename}...`, 'info');
    
    // Simulate download
    setTimeout(() => {
        showToast(`${filename} downloaded successfully`, 'success');
        
        // In a real app, this would trigger an actual download
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,' + btoa('fake pdf content for demo');
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 1000);
}

function downloadAllAttachments() {
    const attachmentsList = document.getElementById('attachmentsList');
    if (!attachmentsList) return;
    
    const attachmentItems = attachmentsList.querySelectorAll('.attachment-item');
    if (attachmentItems.length === 0) {
        showToast('No attachments to download', 'info');
        return;
    }
    
    showLoading();
    showToast(`Downloading ${attachmentItems.length} attachments...`, 'info');
    
    // Simulate batch download
    setTimeout(() => {
        hideLoading();
        showToast(`All ${attachmentItems.length} attachments downloaded`, 'success');
    }, 2000);
}

// ====================== DELETE CONFIRMATION MODAL ======================
function showDeleteConfirmation(emailCount = 1, permanent = false) {
    return new Promise((resolve) => {
        // Create modal if it doesn't exist
        let deleteModal = document.getElementById('deleteConfirmationModal');
        if (!deleteModal) {
            deleteModal = document.createElement('div');
            deleteModal.id = 'deleteConfirmationModal';
            deleteModal.className = 'modal';
            deleteModal.innerHTML = `
                <div class="modal-box delete-modal">
                    <div class="modal-header">
                        <h3><i class="fas fa-trash"></i> <span data-i18n="confirmDelete">Confirm Delete</span></h3>
                        <button class="modal-close" id="closeDeleteModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <div class="delete-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h4 id="deleteMessage"></h4>
                        <p id="deleteWarning" style="color: var(--text-secondary); margin: 15px 0; line-height: 1.5;"></p>
                        <div class="delete-options" style="margin-top: 20px;">
                            <label class="checkbox" style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="dontAskAgain">
                                <span class="checkmark"></span>
                                <span>Don't ask again</span>
                            </label>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" id="cancelDelete">
                            <span data-i18n="cancel">Cancel</span>
                        </button>
                        <button class="btn-primary danger" id="confirmDeleteBtn" style="background: var(--danger);">
                            <i class="fas fa-trash"></i> <span data-i18n="${permanent ? 'permanentlyDelete' : 'delete'}">${permanent ? 'Permanently Delete' : 'Delete'}</span>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(deleteModal);
            
            // Add event listeners
            document.getElementById('closeDeleteModal')?.addEventListener('click', () => {
                deleteModal.style.display = 'none';
                resolve(false);
            });
            
            document.getElementById('cancelDelete')?.addEventListener('click', () => {
                deleteModal.style.display = 'none';
                resolve(false);
            });
            
            document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
                deleteModal.style.display = 'none';
                resolve(true);
            });
            
            // Close on outside click
            deleteModal.addEventListener('click', (e) => {
                if (e.target === deleteModal) {
                    deleteModal.style.display = 'none';
                    resolve(false);
                }
            });
        }
        
        // Update modal content
        const deleteMessage = document.getElementById('deleteMessage');
        const deleteWarning = document.getElementById('deleteWarning');
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        
        if (emailCount === 1) {
            deleteMessage.textContent = translations[currentLanguage].deleteMessage;
        } else {
            deleteMessage.textContent = translations[currentLanguage].deleteMultipleMessage.replace('{count}', emailCount);
        }
        
        deleteWarning.textContent = translations[currentLanguage].deleteWarning;
        
        if (permanent) {
            confirmBtn.innerHTML = `<i class="fas fa-trash"></i> <span>${translations[currentLanguage].permanentlyDelete}</span>`;
            deleteWarning.textContent = "This action cannot be undone. Emails will be permanently deleted.";
        }
        
        // Show modal
        deleteModal.style.display = 'flex';
        
        // Update translations
        updateLanguage(currentLanguage);
    });
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
    const folderEmails = getFilteredEmails();
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
    const folderEmails = getFilteredEmails();
    let markedCount = 0;
    
    folderEmails.forEach(email => {
        if (selectedEmails.has(email.id) && email.unread) {
            email.unread = false;
            markedCount++;
        }
    });
    
    if (markedCount > 0) {
        selectedEmails.clear();
        updateEmailCounts();
        displayEmails();
        showToast(`Marked ${markedCount} email(s) as read`, 'success');
    } else {
        showToast('No unread emails selected', 'info');
    }
}

function markAsImportant() {
    const folderEmails = getFilteredEmails();
    let markedCount = 0;
    
    folderEmails.forEach(email => {
        if (selectedEmails.has(email.id)) {
            email.important = !email.important;
            markedCount++;
        }
    });
    
    // Update important folder
    emailsData.important = emailsData.inbox.filter(email => email.important);
    
    if (markedCount > 0) {
        selectedEmails.clear();
        updateEmailCounts();
        displayEmails();
        
        // Update current email if it's open
        const starBtn = document.getElementById('starBtn');
        if (starBtn && starBtn.dataset.emailId) {
            const emailId = parseInt(starBtn.dataset.emailId);
            const currentEmail = emailsData.inbox.find(e => e.id === emailId) || 
                               emailsData.sent.find(e => e.id === emailId) ||
                               emailsData.drafts.find(e => e.id === emailId);
            if (currentEmail) {
                if (currentEmail.important) {
                    starBtn.innerHTML = '<i class="fas fa-star"></i>';
                    starBtn.style.color = 'var(--warning)';
                } else {
                    starBtn.innerHTML = '<i class="far fa-star"></i>';
                    starBtn.style.color = '';
                }
            }
        }
        
        showToast(`Marked ${markedCount} email(s) as important`, 'success');
    }
}

async function deleteSelectedEmails() {
    let emailsToDelete = [];
    
    if (selectedEmails.size === 0) {
        // Check if we're deleting a single email from reader
        const deleteBtn = document.getElementById('deleteEmailBtn');
        if (deleteBtn && deleteBtn.dataset.emailId) {
            const emailId = parseInt(deleteBtn.dataset.emailId);
            selectedEmails.add(emailId);
        } else {
            showToast('No emails selected', 'info');
            return;
        }
    }
    
    const folderEmails = emailsData[currentFolder] || [];
    emailsToDelete = folderEmails.filter(email => selectedEmails.has(email.id));
    
    if (emailsToDelete.length === 0) {
        showToast('No emails to delete', 'info');
        return;
    }
    
    // Show confirmation dialog
    const confirmed = await showDeleteConfirmation(emailsToDelete.length, currentFolder === 'trash');
    
    if (!confirmed) {
        showToast('Deletion cancelled', 'info');
        return;
    }
    
    if (currentFolder === 'trash') {
        // Permanently delete from trash
        emailsData.trash = emailsData.trash.filter(email => !selectedEmails.has(email.id));
        showToast(`Permanently deleted ${emailsToDelete.length} email(s)`, 'success');
    } else {
        // Move to trash
        emailsToDelete.forEach(email => {
            email.folder = 'trash';
            email.deleted = true;
            email.deletedDate = new Date().toISOString();
            emailsData.trash.push(email);
        });
        
        // Remove from current folder
        emailsData[currentFolder] = folderEmails.filter(email => !selectedEmails.has(email.id));
        
        showToast(`Moved ${emailsToDelete.length} email(s) to trash`, 'success');
    }
    
    selectedEmails.clear();
    updateEmailCounts();
    displayEmails();
    
    // Clear email reader if we deleted the displayed email
    const readerTitle = document.getElementById('readerTitle');
    const readerText = document.getElementById('readerText');
    
    if (readerTitle) readerTitle.textContent = translations[currentLanguage].selectEmail;
    if (readerText) readerText.innerHTML = `<p>${translations[currentLanguage].selectEmailDesc}</p>`;
}

function emptyTrash() {
    if (emailsData.trash.length === 0) {
        showToast('Trash is already empty', 'info');
        return;
    }
    
    // Show confirmation for permanent deletion
    showDeleteConfirmation(emailsData.trash.length, true).then(confirmed => {
        if (confirmed) {
            emailsData.trash = [];
            updateEmailCounts();
            displayEmails();
            showToast('Trash emptied', 'success');
        }
    });
}

function restoreEmail(emailId) {
    const email = emailsData.trash.find(e => e.id === emailId);
    if (!email) return;
    
    // Move back to original folder (default to inbox)
    const originalFolder = email.originalFolder || 'inbox';
    email.folder = originalFolder;
    email.deleted = false;
    email.deletedDate = null;
    
    // Remove from trash
    emailsData.trash = emailsData.trash.filter(e => e.id !== emailId);
    
    // Add to original folder
    if (emailsData[originalFolder]) {
        emailsData[originalFolder].push(email);
    } else {
        emailsData.inbox.push(email);
    }
    
    updateEmailCounts();
    displayEmails();
    showToast('Email restored', 'success');
}

// ====================== FOLDER MANAGEMENT ======================
function switchFolder(folder) {
    currentFolder = folder;
    selectedEmails.clear();
    currentEmailFilter = 'all'; // Reset filter when switching folders
    
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
    
    if (folderTitle) {
        folderTitle.innerHTML = `<i class="fas ${folderIcon}"></i> <span data-i18n="${folder}">${translations[currentLanguage][folder]}</span>`;
    }
    
    // Show/hide empty trash button
    const emptyTrashBtn = document.getElementById('emptyTrashBtn');
    if (emptyTrashBtn) {
        emptyTrashBtn.style.display = folder === 'trash' ? 'flex' : 'none';
    }
    
    // Update active filter tag
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.dataset.filter === currentEmailFilter) {
            tag.classList.add('active');
        }
    });
    
    // Update UI
    updateEmailCounts();
    displayEmails();
    
    // Clear email reader
    const readerTitle = document.getElementById('readerTitle');
    const readerText = document.getElementById('readerText');
    
    if (readerTitle) readerTitle.textContent = translations[currentLanguage].selectEmail;
    if (readerText) readerText.innerHTML = `<p>${translations[currentLanguage].selectEmailDesc}</p>`;
    
    // On mobile, show emails list
    if (window.innerWidth <= 768) {
        const emailsDiv = document.querySelector('.emails');
        const emailReader = document.querySelector('.email-reader');
        const backToList = document.querySelector('.back-to-list');
        
        if (emailsDiv) emailsDiv.style.display = 'flex';
        if (emailReader) emailReader.style.display = 'none';
        if (backToList) backToList.style.display = 'none';
    }
}

// ====================== COMPOSE EMAIL ======================
function openComposeModal() {
    const modal = document.getElementById('composeModal');
    if (modal) modal.style.display = 'flex';
    
    // Clear form
    const mailTo = document.getElementById('mailTo');
    const mailSubject = document.getElementById('mailSubject');
    const mailText = document.getElementById('mailText');
    const filePreview = document.getElementById('filePreview');
    
    if (mailTo) mailTo.value = '';
    if (mailSubject) mailSubject.value = '';
    if (mailText) mailText.value = '';
    if (filePreview) filePreview.innerHTML = '';
    
    // Focus on To field
    setTimeout(() => {
        if (mailTo) mailTo.focus();
    }, 100);
}

function sendEmail() {
    const to = document.getElementById('mailTo')?.value;
    const subject = document.getElementById('mailSubject')?.value;
    const body = document.getElementById('mailText')?.value;
    
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
        important: document.getElementById('urgentCheck')?.checked || false,
        folder: "sent",
        attachments: document.querySelectorAll('.file-preview-item').length,
        body: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
        to: to.split(',').map(e => e.trim()),
        cc: [],
        bcc: [],
        labels: [],
        size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        deleted: false,
        deletedDate: null
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
    const modal = document.getElementById('composeModal');
    if (modal) modal.style.display = 'none';
}

function toggleCcField() {
    const ccField = document.getElementById('ccField');
    if (ccField) {
        ccField.style.display = ccField.style.display === 'none' ? 'block' : 'none';
        if (ccField.style.display === 'block') {
            const mailCc = document.getElementById('mailCc');
            if (mailCc) mailCc.focus();
        }
    }
}

function toggleBccField() {
    const bccField = document.getElementById('bccField');
    if (bccField) {
        bccField.style.display = bccField.style.display === 'none' ? 'block' : 'none';
        if (bccField.style.display === 'block') {
            const mailBcc = document.getElementById('mailBcc');
            if (mailBcc) mailBcc.focus();
        }
    }
}

// ====================== SETTINGS ======================
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'flex';
        showTab('profile');
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'none';
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
    if (!modalContent) return;
    
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
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
        if (userAvatar) {
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            userAvatar.innerHTML = `<span>${initials}</span><div class="user-status online"></div>`;
        }
    }
    
    showToast('Settings saved successfully', 'success');
    closeSettingsModal();
}

// ====================== AI FEATURES ======================
function simulateAISorting() {
    // Simulate AI sorting emails
    setTimeout(() => {
        emailsData.inbox.forEach(email => {
            // AI decides if email is important based on content
            if (email.subject.toLowerCase().includes('important') || 
                email.subject.toLowerCase().includes('urgent') ||
                email.subject.toLowerCase().includes('meeting') ||
                email.sender.toLowerCase().includes('support') ||
                email.sender.toLowerCase().includes('team')) {
                email.important = true;
            }
            
            // AI assigns labels based on content
            if (!email.labels) email.labels = [];
            
            if (email.subject.toLowerCase().includes('meeting') || 
                email.subject.toLowerCase().includes('project') ||
                email.sender.toLowerCase().includes('company')) {
                if (!email.labels.includes('work')) email.labels.push('work');
            }
            
            if (email.subject.toLowerCase().includes('travel') || 
                email.subject.toLowerCase().includes('flight') ||
                email.subject.toLowerCase().includes('hotel')) {
                if (!email.labels.includes('travel')) email.labels.push('travel');
            }
            
            if (email.subject.toLowerCase().includes('finance') || 
                email.subject.toLowerCase().includes('invoice') ||
                email.subject.toLowerCase().includes('payment')) {
                if (!email.labels.includes('finance')) email.labels.push('finance');
            }
        });
        
        // Update important folder
        emailsData.important = emailsData.inbox.filter(email => email.important);
        
        updateEmailCounts();
        if (currentFolder === 'inbox' || currentFolder === 'important') {
            displayEmails();
        }
        
        showToast('AI has sorted your emails', 'success');
    }, 2000);
}

// ====================== EVENT LISTENERS ======================
function initializeEventListeners() {
    // Login/Register
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (registerBtn) registerBtn.addEventListener('click', handleRegister);
    if (showRegister) showRegister.addEventListener('click', showRegisterForm);
    if (showLogin) showLogin.addEventListener('click', showLoginForm);
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const themeMenu = document.getElementById('themeMenu');
            if (themeMenu) themeMenu.classList.toggle('show');
        });
    }
    
    // Theme options
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            updateTheme(option.dataset.theme);
            const themeMenu = document.getElementById('themeMenu');
            if (themeMenu) themeMenu.classList.remove('show');
        });
    });
    
    // Close theme menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-selector')) {
            const themeMenu = document.getElementById('themeMenu');
            if (themeMenu) themeMenu.classList.remove('show');
        }
    });
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    
    // Compose button
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) composeBtn.addEventListener('click', openComposeModal);
    
    // Compose modal
    const closeCompose = document.getElementById('closeCompose');
    const sendMail = document.getElementById('sendMail');
    const addCcBtn = document.getElementById('addCcBtn');
    const addBccBtn = document.getElementById('addBccBtn');
    
    if (closeCompose) closeCompose.addEventListener('click', closeComposeModal);
    if (sendMail) sendMail.addEventListener('click', sendEmail);
    if (addCcBtn) addCcBtn.addEventListener('click', toggleCcField);
    if (addBccBtn) addBccBtn.addEventListener('click', toggleBccField);
    
    // File upload for compose
    const mailFile = document.getElementById('mailFile');
    if (mailFile) {
        mailFile.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const preview = document.getElementById('filePreview');
            
            if (preview) {
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
            }
        });
    }
    
    // Settings
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const cancelSettings = document.getElementById('cancelSettings');
    
    if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);
    if (closeSettings) closeSettings.addEventListener('click', closeSettingsModal);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
    if (cancelSettings) cancelSettings.addEventListener('click', closeSettingsModal);
    
    // User dropdown menu
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    const userSettingsBtn = document.getElementById('userSettingsBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
            
            // Close other dropdowns
            const notificationDropdown = document.getElementById('notificationDropdown');
            if (notificationDropdown) notificationDropdown.classList.remove('show');
        });
    }
    
    if (userSettingsBtn) {
        userSettingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSettingsModal();
            if (userDropdown) userDropdown.classList.remove('show');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (userDropdown) userDropdown.classList.remove('show');
        const notificationDropdown = document.getElementById('notificationDropdown');
        if (notificationDropdown) notificationDropdown.classList.remove('show');
        const moreActionsMenu = document.getElementById('moreActionsMenu');
        if (moreActionsMenu) moreActionsMenu.classList.remove('show');
    });
    
    // Notification bell
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function(e) {
            e.stopPropagation();
            const notificationDropdown = document.getElementById('notificationDropdown');
            if (notificationDropdown) {
                notificationDropdown.classList.toggle('show');
                
                // Close other dropdowns
                if (userDropdown) userDropdown.classList.remove('show');
            }
        });
    }
    
    // More actions dropdown
    const moreActionsBtn = document.getElementById('moreActionsBtn');
    if (moreActionsBtn) {
        moreActionsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const moreActionsMenu = document.getElementById('moreActionsMenu');
            if (moreActionsMenu) {
                moreActionsMenu.classList.toggle('show');
            }
        });
    }
    
    // Settings tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });
    
    // Email actions
    const selectAllBtn = document.getElementById('selectAllBtn');
    const markReadBtn = document.getElementById('markReadBtn');
    const archiveBtn = document.getElementById('archiveBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const emptyTrashBtn = document.getElementById('emptyTrashBtn');
    
    if (selectAllBtn) selectAllBtn.addEventListener('click', selectAllEmails);
    if (markReadBtn) markReadBtn.addEventListener('click', markAsRead);
    if (archiveBtn) archiveBtn.addEventListener('click', () => showToast('Archived', 'success'));
    if (deleteSelectedBtn) deleteSelectedBtn.addEventListener('click', deleteSelectedEmails);
    if (emptyTrashBtn) emptyTrashBtn.addEventListener('click', emptyTrash);
    
    // Star button
    const starBtn = document.getElementById('starBtn');
    if (starBtn) starBtn.addEventListener('click', markAsImportant);
    
    // Delete email button
    const deleteEmailBtn = document.getElementById('deleteEmailBtn');
    if (deleteEmailBtn) deleteEmailBtn.addEventListener('click', deleteSelectedEmails);
    
    // Download all attachments button
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    if (downloadAllBtn) downloadAllBtn.addEventListener('click', downloadAllAttachments);
    
    // Back to list (mobile)
    const backToList = document.getElementById('backToList');
    if (backToList) {
        backToList.addEventListener('click', () => {
            const emailsDiv = document.querySelector('.emails');
            const emailReader = document.querySelector('.email-reader');
            
            if (emailsDiv) emailsDiv.style.display = 'flex';
            if (emailReader) emailReader.style.display = 'none';
            if (backToList) backToList.style.display = 'none';
        });
    }
    
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
            showToast(`Switched to ${emailView} view`, 'info');
        });
    });
    
    // Filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentEmailFilter = this.dataset.filter;
            
            // Update filtered count display
            const filteredCount = document.getElementById('filteredCount');
            if (filteredCount) {
                if (currentEmailFilter === 'all') {
                    filteredCount.textContent = 'All';
                } else if (currentEmailFilter === 'unread') {
                    filteredCount.textContent = 'Unread';
                } else if (currentEmailFilter === 'important') {
                    filteredCount.textContent = 'Important';
                } else if (currentEmailFilter === 'attachments') {
                    filteredCount.textContent = 'With Attachments';
                }
            }
            
            displayEmails();
            showToast(`Filter: ${currentEmailFilter}`, 'info');
        });
    });
    
    // Language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            updateLanguage(this.value);
            
            // Update UI elements that might have changed
            updateEmailCounts();
            if (currentFolder) {
                switchFolder(currentFolder); // This will update folder title
            }
        });
    }
    
    // Sort selector
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            showToast(`Sorted by: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            showLoading();
            setTimeout(() => {
                hideLoading();
                simulateAISorting();
                showToast('Inbox refreshed', 'success');
            }, 1000);
        });
    }
    
    // Search
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 0) {
                if (searchClear) searchClear.style.display = 'flex';
                showToast(`Searching for: ${searchTerm}`, 'info');
            } else {
                if (searchClear) searchClear.style.display = 'none';
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            this.style.display = 'none';
            showToast('Search cleared', 'info');
        });
    }
    
    // AI dismiss
    const aiDismiss = document.getElementById('aiDismiss');
    if (aiDismiss) {
        aiDismiss.addEventListener('click', function() {
            const aiStatusBar = document.getElementById('aiStatusBar');
            if (aiStatusBar) aiStatusBar.style.display = 'none';
        });
    }
    
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
            const sidebar = document.querySelector('.sidebar');
            const emailsDiv = document.querySelector('.emails');
            const emailReader = document.querySelector('.email-reader');
            const backToList = document.querySelector('.back-to-list');
            
            if (sidebar) sidebar.classList.remove('active');
            if (emailsDiv) emailsDiv.style.display = 'flex';
            if (emailReader) emailReader.style.display = 'flex';
            if (backToList) backToList.style.display = 'none';
        }
    });
}

// ====================== LOGIN/REGISTER ======================
function handleLogin() {
    console.log('Login button clicked');
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        console.error('Login form elements not found');
        return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
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
        const loginScreen = document.getElementById('loginScreen');
        const app = document.getElementById('app');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (app) {
            app.style.opacity = '1';
            app.style.display = 'flex';
        }
        
        // Initialize app
        initializeApp();
        
        hideLoading();
        showToast('Login successful', 'success');
        
        // Save demo login
        try {
            localStorage.setItem('inboxProDemoLogin', 'true');
            localStorage.setItem('inboxProUserEmail', email);
        } catch (e) {
            console.log('Could not save to localStorage:', e);
        }
    }, 1500);
}

function handleRegister() {
    console.log('Register button clicked');
    
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmInput = document.getElementById('registerConfirm');
    
    if (!nameInput || !emailInput || !passwordInput || !confirmInput) {
        console.error('Register form elements not found');
        return;
    }
    
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
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
        const loginScreen = document.getElementById('loginScreen');
        const app = document.getElementById('app');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (app) {
            app.style.opacity = '1';
            app.style.display = 'flex';
        }
        
        // Initialize app
        initializeApp();
        
        hideLoading();
        showToast('Registration successful', 'success');
        
        // Save demo login
        try {
            localStorage.setItem('inboxProDemoLogin', 'true');
            localStorage.setItem('inboxProUserName', name);
            localStorage.setItem('inboxProUserEmail', email);
        } catch (e) {
            console.log('Could not save to localStorage:', e);
        }
    }, 1500);
}

function handleLogout() {
    showLoading();
    
    setTimeout(() => {
        currentUser = null;
        
        // Clear localStorage
        try {
            localStorage.removeItem('inboxProDemoLogin');
            localStorage.removeItem('inboxProUserName');
            localStorage.removeItem('inboxProUserEmail');
        } catch (e) {
            console.log('Could not clear localStorage:', e);
        }
        
        // Switch to login screen
        const loginScreen = document.getElementById('loginScreen');
        const app = document.getElementById('app');
        
        if (loginScreen) {
            loginScreen.style.display = 'flex';
            // Reset login form
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            if (loginForm) loginForm.classList.add('active');
            if (registerForm) registerForm.classList.remove('active');
        }
        if (app) {
            app.style.opacity = '0';
            app.style.display = 'none';
        }
        
        hideLoading();
        showToast('Logged out successfully', 'success');
    }, 1000);
}

function showRegisterForm(e) {
    e.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.add('active');
}

function showLoginForm(e) {
    e.preventDefault();
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) registerForm.classList.remove('active');
    if (loginForm) loginForm.classList.add('active');
}

// ====================== INITIALIZE APP ======================
function initializeApp() {
    console.log('Inbox Pro starting...');
    
    // Load saved theme
    try {
        const savedTheme = localStorage.getItem('inboxProTheme');
        if (savedTheme) {
            updateTheme(savedTheme);
        }
    } catch (e) {
        console.log('Could not load theme from localStorage:', e);
    }
    
    // Load saved language
    try {
        const savedLang = localStorage.getItem('inboxProLanguage');
        if (savedLang && translations[savedLang]) {
            currentLanguage = savedLang;
        }
    } catch (e) {
        console.log('Could not load language from localStorage:', e);
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
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
        if (userAvatar) {
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            userAvatar.innerHTML = `<span>${initials}</span><div class="user-status online"></div>`;
        }
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Inbox Pro!', 'success');
        simulateAISorting();
    }, 1000);
    
    console.log('Inbox Pro ready');
}

// ====================== ON LOAD ======================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Add CSS for delete confirmation modal and AI badges
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
            color: var(--accent);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 4px;
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
        
        .email-labels {
            display: flex;
            gap: 5px;
            margin-top: 10px;
        }
        
        .email-labels .label {
            padding: 4px 8px;
            font-size: 0.75rem;
            border-radius: 12px;
        }
        
        /* Fix for login/register forms */
        .login-form {
            display: none;
        }
        
        .login-form.active {
            display: block;
        }
        
        /* Fix for modals */
        .modal {
            display: none;
        }
        
        .modal.show {
            display: flex;
        }
        
        /* Animation for infinite pulse */
        @keyframes pulseInfinite {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .animate__pulse {
            animation-name: pulseInfinite;
        }
        
        /* Delete confirmation modal */
        .delete-modal {
            max-width: 400px;
        }
        
        .delete-icon {
            text-align: center;
            font-size: 48px;
            color: var(--warning);
            margin-bottom: 20px;
        }
        
        .delete-modal h4
