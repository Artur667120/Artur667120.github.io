// ====================== EMAIL STORAGE ======================
let emails = JSON.parse(localStorage.getItem('emails') || '[]');
const emailsContainer = document.querySelector('.emails');
const readerTitle = document.getElementById('readerTitle');
const readerText = document.getElementById('readerText');
const readerFiles = document.getElementById('readerFiles');

function renderEmails(folder='inbox'){
  emailsContainer.innerHTML = '';
  emails.filter(e => e.folder === folder).forEach((mail,i)=>{
    const div = document.createElement('div');
    div.className = 'email' + (mail.unread ? ' unread' : '');
    div.innerHTML = `<div class="avatar">${mail.title[0]}</div><div class="title">${mail.title}</div>`;
    div.onclick = () => openMail(i);
    emailsContainer.appendChild(div);
  });
}

function openMail(index){
  const mail = emails[index];
  readerTitle.textContent = mail.title;
  readerText.textContent = mail.text;
  readerFiles.innerHTML = '';
  if(mail.files){
    mail.files.forEach(f=>{
      const a = document.createElement('a');
      a.textContent = f.name;
      a.href = f.data;
      a.download = f.name;
      a.className = 'file-link';
      readerFiles.appendChild(a);
    });
  }
  mail.unread = false;
  saveEmails();
  renderEmails(document.querySelector('.menu-item.active').dataset.folder);
}

function saveEmails(){ localStorage.setItem('emails', JSON.stringify(emails)); }

// ====================== USER EMAIL ======================
let email = localStorage.getItem('email');
if(!email){ email = prompt('Enter email'); localStorage.setItem('email', email); }
document.getElementById('userEmail').textContent = email;

// ====================== MODAL ======================
const modal = document.getElementById('modal');
const composeBtn = document.getElementById('composeBtn');
const filePreview = document.getElementById('filePreview');
const mailFile = document.getElementById('mailFile');

composeBtn.onclick = () => {
  modal.style.display = 'flex';
  filePreview.innerHTML = '';
  mailFile.value = '';
};

function closeModal(){ modal.style.display = 'none'; }

// ====================== FILE PREVIEW ======================
mailFile.onchange = () => {
  filePreview.innerHTML = '';
  for(let f of mailFile.files){
    const p = document.createElement('div');
    p.textContent = f.name;
    filePreview.appendChild(p);
  }
};

// ====================== SEND EMAIL ======================
document.getElementById('sendMail').onclick = async ()=>{
  const to = document.getElementById('mailTo').value;
  const subject = document.getElementById('mailSubject').value;
  const text = document.getElementById('mailText').value;

  const files = [];
  for(let f of mailFile.files){
    const data = await fileToDataURL(f);
    files.push({name:f.name, data});
  }

  emails.push({title:to, text, folder:'sent', unread:false, files});
  saveEmails();
  renderEmails('sent');
  closeModal();
};

function fileToDataURL(file){
  return new Promise(res=>{
    const reader = new FileReader();
    reader.onload = e=>res(e.target.result);
    reader.readAsDataURL(file);
  });
}

// ====================== THEME ======================
const app = document.getElementById('app');
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';

// Встановлюємо тему при завантаженні
if(savedTheme === 'light') {
  app.classList.add('light');
} else {
  app.classList.remove('light');
}

// Встановлюємо іконку при завантаженні
themeToggle.textContent = app.classList.contains('light') ? '🌙' : '☀️';

// Кнопка перемикання
themeToggle.onclick = () => {
  app.classList.toggle('light');
  const current = app.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('theme', current);
  themeToggle.textContent = current === 'light' ? '🌙' : '☀️';
};

// ====================== MENU ======================
document.querySelectorAll('.menu-item').forEach(item=>{
  item.onclick = ()=>{
    document.querySelectorAll('.menu-item').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    renderEmails(item.dataset.folder);
  };
});

// ====================== LANGUAGE ======================
const dict={
  ua:{inbox:'Вхідні',sent:'Надіслані',drafts:'Чернетки',spam:'Спам',newMail:'Новий лист'},
  en:{inbox:'Inbox',sent:'Sent',drafts:'Drafts',spam:'Spam',newMail:'New mail'},
  de:{inbox:'Posteingang',sent:'Gesendet',drafts:'Entwürfe',spam:'Spam',newMail:'Neue Mail'},
  ru:{inbox:'Входящие',sent:'Отправленные',drafts:'Черновики',spam:'Спам',newMail:'Новое письмо'}
};
const langSelect=document.getElementById('langSelect');
const savedLang = localStorage.getItem('lang') || 'ua';
langSelect.value=savedLang;
setLang(savedLang);
langSelect.onchange=()=>{
  localStorage.setItem('lang', langSelect.value);
  setLang(langSelect.value);
};
function setLang(l){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent=dict[l][el.dataset.i18n];
  });
}

// ====================== INITIAL ======================
renderEmails();
