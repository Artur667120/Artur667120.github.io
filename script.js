// ====================== GLOBAL VARIABLES ======================
let emails = JSON.parse(localStorage.getItem('emails')) || [];
let currentFolder = 'inbox';
let currentUserEmail = localStorage.getItem('userEmail');
let currentSelectedEmail = null;
let emailIdCounter = parseInt(localStorage.getItem('emailIdCounter')) || 1;

// ====================== TRANSLATION SYSTEM ======================
const translations = {
    ua: {
        inbox: 'Вхідні',
        sent: 'Надіслані',
        drafts: 'Чернетки',
        spam: 'Спам',
        trash: 'Кошик',
        compose: 'Створити',
        newMail: 'Новий лист',
        userSettings: 'Налаштування',
        yourEmail: 'Ваша електронна адреса',
        emailHint: 'Ця адреса буде використана як адреса відправника',
        save: 'Зберегти',
        close: 'Закрити',
        toEmail: 'Кому (email)',
        subject: 'Тема',
        message: 'Повідомлення',
        addAttachment: 'Додати файл',
        send: 'Надіслати',
        attachments: 'Вкладення',
        emptyTrash: 'Очистити кошик',
        delete: 'Видалити',
        view: 'Переглянути',
        download: 'Скачати',
        from: 'Від',
        date: 'Дата',
        noEmails: 'Листів немає',
        emptyInbox: 'Вхідні порожні',
        selectEmail: 'Виберіть лист',
        confirmDelete: 'Видалити цей лист?',
        confirmEmptyTrash: 'Очистити кошик?',
        emailSaved: 'Email збережено!',
        emailSent: 'Лист надіслано!',
        emailDeleted: 'Лист видалено!',
        trashEmptied: 'Кошик очищено!',
        error: 'Помилка',
        missingRecipient: 'Введіть адресу отримувача',
        invalidEmail: 'Невірний формат email',
        fileTooLarge: 'Файл занадто великий',
        maxFiles: 'Максимум 5 файлів',
        noFileSupport: 'Перегляд файлів не підтримується',
        loading: 'Завантаження
