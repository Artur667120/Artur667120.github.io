// EMAIL
let email = localStorage.getItem('email');
const userEmail = document.getElementById('userEmail');
if (!email) {
  email = prompt('Enter email');
  localStorage.setItem('email', email);
}
userEmail.textContent = email;

// OPEN MAIL
const readerTitle = document.getElementById('readerTitle');
const readerText = document.getElementById('readerText');
document.querySelectorAll('.email').forEach(mail => {
  mail.onclick = () => {
    readerTitle.textContent = mail.dataset.title;
    readerText.textContent = mail.dataset.text;
    mail.classList.remove('unread');
  };
});

// MODAL
const composeBtn = document.getElementById('composeBtn');
const modal = document.getElementById('modal');

composeBtn.onclick = () => modal.style.display = 'flex';
function closeModal() {
  modal.style.display = 'none';
}

// THEME
const app = document.getElementById('app');
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') app.classList.add('light');

themeToggle.onclick = () => {
  app.classList.toggle('light');
  localStorage.setItem('theme', app.classList.contains('light') ? 'light' : 'dark');
};

// MENU
document.querySelectorAll('.menu-item').forEach(item => {
  item.onclick = () => {
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const f = item.dataset.folder;
    document.querySelectorAll('.email').forEach(m => {
      m.style.display = m.dataset.folder === f ? 'flex' : 'none';
    });
  };
});

// LANG
const dict = {
  ua: { inbox:'Вхідні', sent:'Надіслані', drafts:'Чернетки', spam:'Спам', newMail:'Новий лист' },
  en: { inbox:'Inbox', sent:'Sent', drafts:'Drafts', spam:'Spam', newMail:'New mail' },
  de: { inbox:'Posteingang', sent:'Gesendet', drafts:'Entwürfe', spam:'Spam', newMail:'Neue Mail' },
  ru: { inbox:'Входящие', sent:'Отправленные', drafts:'Черновики', spam:'Спам', newMail:'Новое письмо' }
};

const langSelect = document.getElementById('langSelect');
const savedLang = localStorage.getItem('lang') || 'ua';
langSelect.value = savedLang;
setLang(savedLang);

langSelect.onchange = () => {
  localStorage.setItem('lang', langSelect.value);
  setLang(langSelect.value);
};

function setLang(l) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = dict[l][el.dataset.i18n];
  });
}
