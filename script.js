// ====================== GLOBAL VARIABLES ======================
let emails = JSON.parse(localStorage.getItem('emails')) || [];
let currentFolder = 'inbox';
let currentUserEmail = localStorage.getItem('userEmail');
let currentSelectedEmail = null;
let emailIdCounter = parseInt(localStorage.getItem('emailIdCounter')) || 1;

// ====================== TRANSLATIONS ======================
const translations = {
  ua:{inbox:'Вхідні',sent:'Надіслані',drafts:'Чернетки',spam:'Спам',trash:'Кошик',compose:'Створити',newMail:'Новий лист',userSettings:'Налаштування',yourEmail:'Ваша електронна адреса',emailHint:'Ця адреса буде використана як адреса відправника',save:'Зберегти',close:'Закрити',toEmail:'Кому (email)',subject:'Тема',message:'Повідомлення',addAttachment:'Додати файл',send:'Надіслати',attachments:'Вкладення',emptyTrash:'Очистити кошик',delete:'Видалити',view:'Переглянути',download:'Скачати',from:'Від',date:'Дата',noEmails:'Листів немає',emptyInbox:'Вхідні порожні',selectEmail:'Виберіть лист',confirmDelete:'Видалити цей лист?',confirmEmptyTrash:'Очистити кошик?',emailSaved:'Email збережено!',emailSent:'Лист надіслано!',emailDeleted:'Лист видалено!',trashEmptied:'Кошик очищено!',error:'Помилка',missingRecipient:'Введіть адресу отримувача',invalidEmail:'Невірний формат email',fileTooLarge:'Файл занадто великий',maxFiles:'Максимум 5 файлів',noFileSupport:'Перегляд файлів не підтримується',loading:'Завантаження'},
  en:{inbox:'Inbox',sent:'Sent',drafts:'Drafts',spam:'Spam',trash:'Trash',compose:'Compose',newMail:'New mail',userSettings:'User Settings',yourEmail:'Your Email Address',emailHint:'This email will be used as your sender address',save:'Save',close:'Close',toEmail:'To (email)',subject:'Subject',message:'Message',addAttachment:'Add Attachment',send:'Send',attachments:'Attachments',emptyTrash:'Empty Trash',delete:'Delete',view:'View',download:'Download',from:'From',date:'Date',noEmails:'No emails',emptyInbox:'Inbox is empty',selectEmail:'Select email',confirmDelete:'Delete this email?',confirmEmptyTrash:'Empty Trash?',emailSaved:'Email saved!',emailSent:'Email sent!',emailDeleted:'Email deleted!',trashEmptied:'Trash emptied!',error:'Error',missingRecipient:'Enter recipient address',invalidEmail:'Invalid email format',fileTooLarge:'File too large',maxFiles:'Maximum 5 files',noFileSupport:'File preview not supported',loading:'Loading'},
  de:{inbox:'Posteingang',sent:'Gesendet',drafts:'Entwürfe',spam:'Spam',trash:'Papierkorb',compose:'Erstellen',newMail:'Neue E-Mail',userSettings:'Benutzereinstellungen',yourEmail:'Ihre E-Mail-Adresse',emailHint:'Diese E-Mail wird als Absenderadresse verwendet',save:'Speichern',close:'Schließen',toEmail:'An (Email)',subject:'Betreff',message:'Nachricht',addAttachment:'Datei hinzufügen',send:'Senden',attachments:'Anhänge',emptyTrash:'Papierkorb leeren',delete:'Löschen',view:'Ansehen',download:'Herunterladen',from:'Von',date:'Datum',noEmails:'Keine E-Mails',emptyInbox:'Posteingang ist leer',selectEmail:'E-Mail auswählen',confirmDelete:'Diese E-Mail löschen?',confirmEmptyTrash:'Papierkorb leeren?',emailSaved:'Email gespeichert!',emailSent:'Email gesendet!',emailDeleted:'E-Mail gelöscht!',trashEmptied:'Papierkorb geleert!',error:'Fehler',missingRecipient:'Empfängeradresse eingeben',invalidEmail:'Ungültiges E-Mail-Format',fileTooLarge:'Datei zu groß',maxFiles:'Maximal 5 Dateien',noFileSupport:'Dateivorschau wird nicht unterstützt',loading:'Laden'},
  ru:{inbox:'Входящие',sent:'Отправленные',drafts:'Черновики',spam:'Спам',trash:'Корзина',compose:'Создать',newMail:'Новое письмо',userSettings:'Настройки',yourEmail:'Ваш Email',emailHint:'Этот адрес будет использоваться как адрес отправителя',save:'Сохранить',close:'Закрыть',toEmail:'Кому (email)',subject:'Тема',message:'Сообщение',addAttachment:'Добавить файл',send:'Отправить',attachments:'Вложения',emptyTrash:'Очистить корзину',delete:'Удалить',view:'Просмотр',download:'Скачать',from:'От',date:'Дата',noEmails:'Писем нет',emptyInbox:'Входящие пусты',selectEmail:'Выберите письмо',confirmDelete:'Удалить это письмо?',confirmEmptyTrash:'Очистить корзину?',emailSaved:'Email сохранен!',emailSent:'Письмо отправлено!',emailDeleted:'Письмо удалено!',trashEmptied:'Корзина очищена!',error:'Ошибка',missingRecipient:'Введите адрес получателя',invalidEmail:'Неверный формат email',fileTooLarge:'Файл слишком большой',maxFiles:'Максимум 5 файлов',noFileSupport:'Просмотр файлов не поддерживается',loading:'Загрузка'}
};

// ====================== LOGIC ======================
// Тут повний JS код з функціями:
// - переключення теми
// - створення email
// - відкриття скриньки
// - додавання/перегляд файлів
// - видалення листів
// - переклад інтерфейсу
// - toast-повідомлення
