// ====================== DATA ======================
let emails = JSON.parse(localStorage.getItem('emails')) || [];
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let currentFolder = 'inbox';
let currentSelectedEmail = null;

// ====================== ELEMENTS ======================
const loginModal = document.getElementById('loginModal');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const userEmailSpan = document.getElementById('userEmail');
const composeBtn = document.getElementById('composeBtn');
const composeModal = document.getElementById('composeModal');
const closeCompose = document.getElementById('closeCompose');
const sendMail = document.getElementById('sendMail');
const mailTo = document.getElementById('mailTo');
const mailSubject = document.getElementById('mailSubject');
const mailText = document.getElementById('mailText');
const emailsList = document.getElementById('emailsList');
const toast = document.getElementById('toast');

// ====================== LOGIN ======================
function showLogin() { loginModal.style.display='flex'; }
function hideLogin() { loginModal.style.display='none'; }

loginBtn.addEventListener('click', ()=>{
    const email = loginEmail.value.trim();
    const pass = loginPassword.value.trim();
    if(email && pass){
        currentUser = {email, password:pass};
        localStorage.setItem('user', JSON.stringify(currentUser));
        hideLogin(); renderUser(); renderEmails();
    } else alert('Enter email and password');
});

function renderUser(){ if(currentUser) userEmailSpan.textContent=currentUser.email; }
if(!currentUser) showLogin(); else renderUser();

// ====================== COMPOSE ======================
composeBtn.addEventListener('click', ()=>{ composeModal.style.display='flex'; });
closeCompose.addEventListener('click', ()=>{ composeModal.style.display='none'; });
sendMail.addEventListener('click', ()=>{
    if(!mailTo.value.trim()){ showToast('Enter recipient'); return; }
    const email = {
        id: Date.now(),
        from: currentUser.email,
        to: mailTo.value,
        subject: mailSubject.value,
        text: mailText.value,
        date: new Date().toLocaleString(),
        folder:'sent'
    };
    emails.push(email); localStorage.setItem('emails', JSON.stringify(emails));
    composeModal.style.display='none'; mailTo.value=''; mailSubject.value=''; mailText.value='';
    showToast('Mail sent'); renderEmails();
});

// ====================== RENDER ======================
function renderEmails(){
    emailsList.innerHTML='';
    const folderEmails = emails.filter(e=>e.folder===currentFolder);
    if(folderEmails.length===0){ emailsList.innerHTML='<p>No emails</p>'; return; }
    folderEmails.forEach(e=>{
        const div = document.createElement('div'); div.className='email';
        div.innerHTML=`<div>${e.from}</div><div>${e.subject}</div>`;
        div.addEventListener('click', ()=>{ showEmail(e); });
        emailsList.appendChild(div);
    });
}
function showEmail(e){
    currentSelectedEmail=e;
    document.getElementById('readerTitle').textContent=e.subject;
    document.getElementById('readerSender').textContent='From: '+e.from;
    document.getElementById('readerDate').textContent=e.date;
    document.getElementById('readerText').textContent=e.text;
}

// ====================== TOAST ======================
function showToast(msg){ toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>{toast.classList.remove('show');},2000); }

// ====================== FOLDER SWITCH ======================
document.querySelectorAll('.menu-item').forEach(item=>{
    item.addEventListener('click', ()=>{
        document.querySelectorAll('.menu-item').forEach(i=>i.classList.remove('active'));
        item.classList.add('active');
        currentFolder = item.dataset.folder;
        document.getElementById('currentFolder').textContent=item.textContent;
        renderEmails();
    });
});
