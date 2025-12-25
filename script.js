// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elements
const composeBtn = document.getElementById('composeBtn');
const composeModal = document.getElementById('composeModal');
const cancelMail = document.getElementById('cancelMail');
const sendMail = document.getElementById('sendMail');
const mailTo = document.getElementById('mailTo');
const mailSubject = document.getElementById('mailSubject');
const mailText = document.getElementById('mailText');
const fileInput = document.getElementById('mailFile');
const filePreview = document.getElementById('filePreview');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const emailsList = document.getElementById('emailsList');
const reader = document.getElementById('reader');
const readerTitle = document.getElementById('readerTitle');
const readerText = document.getElementById('readerText');
const readerSender = document.getElementById('readerSender');
const readerDate = document.getElementById('readerDate');

// State
let drafts = [];
let inbox = [];
let currentFolder = 'inbox';
let attachments = [];

// Show Compose
composeBtn.addEventListener('click', () => {
  composeModal.style.display = 'flex';
});

// Cancel Mail
cancelMail.addEventListener('click', () => {
  composeModal.style.display = 'none';
  mailTo.value = '';
  mailSubject.value = '';
  mailText.value = '';
  filePreview.innerHTML = '';
  attachments = [];
});

// Handle Files Drag & Drop
fileInput.addEventListener('change', (e) => {
  attachments = Array.from(e.target.files);
  filePreview.innerHTML = attachments.map(f => `<div>${f.name}</div>`).join('');
});

// Send Mail
sendMail.addEventListener('click', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(mailTo.value)){ alert('Enter a valid email'); return; }

  const newMail = {
    to: mailTo.value,
    subject: mailSubject.value,
    text: mailText.value,
    attachments: attachments.map(f=>f.name),
    date: new Date().toLocaleString()
  };

  // Upload simulation
  uploadProgress.style.display = 'block';
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressFill.style.width = progress+'%';
    if(progress >= 100){
      clearInterval(interval);
      uploadProgress.style.display = 'none';
      progressFill.style.width = '0%';
      inbox.push(newMail);
      db.ref('inbox').push(newMail);
      composeModal.style.display = 'none';
      mailTo.value=''; mailSubject.value=''; mailText.value='';
      attachments=[]; filePreview.innerHTML='';
      renderFolder(currentFolder);
    }
  }, 100);
});

// Render Emails
function renderFolder(folder){
  emailsList.innerHTML = '';
  let list = folder==='inbox'? inbox : folder==='drafts'? drafts : [];
  list.forEach((email, idx)=>{
    const div = document.createElement('div');
    div.className = 'email-item';
    div.textContent = email.subject || '(No Subject)';
    div.addEventListener('click', ()=>{
      reader.style.display='flex';
      readerTitle.textContent=email.subject;
      readerText.textContent=email.text;
      readerSender.textContent=email.to;
      readerDate.textContent=email.date;
    });
    emailsList.appendChild(div);
  });
}
renderFolder(currentFolder);
