// Дані листів
let emails = [
  {id:1, folder:'inbox', sender:'ivan@example.com', subject:'Привіт', body:'Як справи?', date:'25.12.2025', unread:true},
  {id:2, folder:'inbox', sender:'anna@example.com', subject:'Нагадування', body:'Не забудь зустріч', date:'24.12.2025', unread:true},
  {id:3, folder:'sent', sender:'me@example.com', subject:'Відповідь', body:'Дякую!', date:'23.12.2025', unread:false}
];

let currentFolder = 'inbox';
let selectedEmail = null;

// ====================== ELEMENTS ======================
const emailsList = document.getElementById('emailsList');
const emailReader = document.getElementById('emailReader');
const readerSubject = document.getElementById('readerSubject');
const readerSender = document.getElementById('readerSender');
const readerBody = document.getElementById('readerBody');
const readerDate = document.getElementById('readerDate');
const backBtn = document.getElementById('backBtn');
const deleteEmailBtn = document.getElementById('deleteEmailBtn');

const menuItems = document.querySelectorAll('.menu-item');
const themeToggle = document.getElementById('themeToggle');

// Compose modal
const composeModal = document.getElementById('composeModal');
const composeBtn = document.getElementById('composeBtn');
const closeCompose = document.getElementById('closeCompose');
const sendBtn = document.getElementById('sendBtn');
const composeTo = document.getElementById('composeTo');
const composeSubject = document.getElementById('composeSubject');
const composeBody = document.getElementById('composeBody');

// ====================== FUNCTIONS ======================
function renderEmails(){
  emailsList.innerHTML='';
  emails.filter(e=>e.folder===currentFolder).forEach(email=>{
    const div = document.createElement('div');
    div.className='email'+(email.unread?' unread':'');
    div.innerHTML=`<strong>${email.sender}</strong> - ${email.subject}`;
    div.onclick = ()=>openEmail(email.id);
    emailsList.appendChild(div);
  });
}

function openEmail(id){
  selectedEmail = emails.find(e=>e.id===id);
  if(!selectedEmail) return;
  emailReader.style.display='flex';
  readerSubject.textContent = selectedEmail.subject;
  readerSender.textContent = selectedEmail.sender;
  readerBody.textContent = selectedEmail.body;
  readerDate.textContent = selectedEmail.date;
  selectedEmail.unread = false;
  renderEmails();
}

backBtn.onclick = ()=>{
  emailReader.style.display='none';
  selectedEmail = null;
}

deleteEmailBtn.onclick = ()=>{
  if(!selectedEmail) return;
  selectedEmail.folder='trash';
  emailReader.style.display='none';
  renderEmails();
}

// Sidebar folder switching
menuItems.forEach(item=>{
  item.onclick = ()=>{
    menuItems.forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    currentFolder = item.dataset.folder;
    emailReader.style.display='none';
    renderEmails();
  }
});

// Theme toggle
themeToggle.onclick = ()=>{
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
}

// Compose modal
composeBtn.onclick = ()=>{ composeModal.style.display='flex'; }
closeCompose.onclick = ()=>{ composeModal.style.display='none'; }
sendBtn.onclick = ()=>{
  if(!composeTo.value || !composeSubject.value) return alert('Заповніть всі поля!');
  emails.push({id:emails.length+1, folder:'sent', sender:'me@example.com', subject:composeSubject.value, body:composeBody.value, date:new Date().toLocaleDateString(), unread:false});
  composeModal.style.display='none';
  composeTo.value=''; composeSubject.value=''; composeBody.value='';
  renderEmails();
}

// Initial render
renderEmails();
