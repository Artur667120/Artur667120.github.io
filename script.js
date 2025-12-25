// ====================== БАЗОВІ ФУНКЦІЇ ======================
let currentLanguage = localStorage.getItem('language') || 'en';
let currentUserEmail = '';

function init() {
    console.log('Inbox Pro запускається...');
    setupEventListeners();
    applyLanguage();
    checkAutoLogin();
}

function checkAutoLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (user.email) {
            currentUserEmail = user.email;
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            showToast('Авторизація успішна!', 'success');
        }
    }
}

function setupEventListeners() {
    // Перемикання між формою входу та реєстрації
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
    
    // Кнопка входу
    document.getElementById('loginBtn')?.addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showToast('Будь ласка, заповніть всі поля', 'error');
            return;
        }
        
        // Проста імітація входу
        const user = {
            email: email,
            name: email.split('@')[0],
            avatarColor: '#667eea'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        currentUserEmail = email;
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        showToast('Вхід успішний!', 'success');
    });
    
    // Кнопка реєстрації
    document.getElementById('registerBtn')?.addEventListener('click', function() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        
        if (!name || !email || !password) {
            showToast('Будь ласка, заповніть всі поля', 'error');
            return;
        }
        
        const user = {
            email: email,
            name: name,
            avatarColor: '#667eea'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        currentUserEmail = email;
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        showToast('Реєстрація успішна!', 'success');
    });
    
    // Кнопка створення листа
    document.getElementById('composeBtn')?.addEventListener('click', function() {
        document.getElementById('composeModal').style.display = 'flex';
    });
    
    // Закриття модальних вікон
    document.getElementById('closeCompose')?.addEventListener('click', function() {
        document.getElementById('composeModal').style.display = 'none';
    });
    
    // Надсилання листа
    document.getElementById('sendMail')?.addEventListener('click', function() {
        const to = document.getElementById('mailTo').value;
        const subject = document.getElementById('mailSubject').value;
        
        if (!to || !subject) {
            showToast('Заповніть поле "Кому" та "Тема"', 'error');
            return;
        }
        
        showToast('Лист надіслано!', 'success');
        document.getElementById('composeModal').style.display = 'none';
        
        // Очистити форму
        document.getElementById('mailTo').value = '';
        document.getElementById('mailSubject').value = '';
        document.getElementById('mailText').value = '';
    });
    
    // Зміна мови
    document.getElementById('langSelect')?.addEventListener('change', function(e) {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        applyLanguage();
    });
}

function applyLanguage() {
    const texts = document.querySelectorAll('[data-i18n]');
    texts.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Placeholders
    const placeholders = document.querySelectorAll('[data-i18n-ph]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-ph');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
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
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ====================== ПРОСТІ ПЕРЕКЛАДИ ======================
const translations = {
    en: {
        compose: 'Compose',
        inbox: 'Inbox',
        sent: 'Sent',
        drafts: 'Drafts',
        spam: 'Spam',
        trash: 'Trash',
        emptyInbox: 'Inbox is empty',
        noEmails: 'No emails to display',
        selectEmail: 'Select an email',
        emptyTrash: 'Empty Trash',
        toEmail: 'To',
        subject: 'Subject',
        message: 'Write your message here...',
        addAttachment: 'Add Attachment',
        send: 'Send',
        close: 'Close',
        save: 'Save',
        cancel: 'Cancel'
    },
    ua: {
        compose: 'Створити',
        inbox: 'Вхідні',
        sent: 'Надіслані',
        drafts: 'Чернетки',
        spam: 'Спам',
        trash: 'Кошик',
        emptyInbox: 'Вхідні порожні',
        noEmails: 'Листів немає',
        selectEmail: 'Виберіть лист',
        emptyTrash: 'Очистити кошик',
        toEmail: 'Кому',
        subject: 'Тема',
        message: 'Напишіть ваше повідомлення...',
        addAttachment: 'Додати файл',
        send: 'Надіслати',
        close: 'Закрити',
        save: 'Зберегти',
        cancel: 'Скасувати'
    }
};

// ====================== ЗАПУСК ПРИЛОЖЕННЯ ======================
document.addEventListener('DOMContentLoaded', init);

// Додайте ці стилі для анімації toast
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
