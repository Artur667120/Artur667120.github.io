let emails = JSON.parse(localStorage.getItem('emails')) || [];
let currentFolder = 'inbox';
let currentUserEmail = localStorage.getItem('userEmail') || '';
let currentSelectedEmail = null;

const inboxList = document.getElementById('emailsList');
const userEmailSpan = document.getElementById('userEmail');
const composeModal = document.getElementById('composeModal');
const settingsModal = document.getElementById('settingsModal');
const mailToInput = document.getElementById('mailTo');
const mailSubjectInput = document.getElementById('mailSubject');
const mailTextInput = document.getElementById('mailText');
const fileInput = document.getElementById('mailFile');
const filePreview = document.getElementById('filePreview');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const toast = document.getElementById('toast');

function showToast(msg){ toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2000); }

function saveUserEmail(email){
    localStorage.setItem('userEmail', email);
    currentUserEmail = email;
    userEmailSpan.textContent = email;
}

// При першому запуску – запитати email
if(!currentUserEmail){
    let emailPrompt = prompt("Enter your email:");
    if(emailPrompt && /\S+@\S+\.\S+/.test(emailPrompt)){
        saveUserEmail(emailPrompt);
    } else {
        saveUserEmail("demo@email.com");
    }
} else { userEmailSpan.textContent = currentUserEmail; }

// Кнопки модалок
document.getElementById('composeBtn').onclick = ()=>composeModal.style.display='flex';
document.getElementById('closeCompose').onclick = ()=>{composeModal.style.display='none'; mailToInput.value=''; mailSubjectInput.value=''; mailTextInput.value=''; filePreview.innerHTML=''; progressBar.style.width='0%'; };
document.getElementById('settingsBtn').onclick = ()=>settingsModal.style.display='flex';
document.getElementById('closeSettings').onclick = ()=>settingsModal.style.display='none';
document.getElementById('saveSettings').onclick = ()=>{
    let val = document.getElementById('editEmail').value;
    if(/\S+@\S+\.\S+/.test(val)){ saveUserEmail(val); settingsModal.style.display='none'; showToast("Email saved!"); }
    else showToast("Invalid email!");
};

// Drag & Drop
fileInput.addEventListener('change', handleFiles);
filePreview.addEventListener('drop', handleDrop);
filePreview.addEventListener('dragover', e=>{ e.preventDefault(); });

function handleFiles(){ displayFiles([...fileInput.files]); }
function handleDrop(e){
    e.preventDefault();
    let dtFiles = [...e.dataTransfer.files];
    displayFiles(dtFiles);
}
function displayFiles(files){
    filePreview.innerHTML='';
    files.forEach(f=>{
        let div = document.createElement('div');
        div.className='file-preview-item';
        div.textContent = `${f.name} (${Math.round(f.size/1024)}KB)`;
        filePreview.appendChild(div);
    });
}

// Відправка листа
document.getElementById('sendMail').onclick = ()=>{
    let to = mailToInput.value.trim();
    if(!/\S+@\S+\.\S+/.test(to)){ showToast("Invalid recipient email"); return; }
    let newEmail = {
        id:Date.now(),
        from:currentUserEmail,
        to:to,
        subject:mailSubjectInput.value,
        body:mailTextInput.value,
        files:[...fileInput.files].map(f=>({name:f.name,size:f.size})),
        folder:'sent',
        date:new Date().toLocaleString()
    };
    emails.push(newEmail);
    localStorage.setItem('emails', JSON.stringify(emails));
    showToast("Email sent!");
    composeModal.style.display='none';
    mailToInput.value=''; mailSubjectInput.value=''; mailTextInput.value=''; filePreview.innerHTML='';
};

// Рендер Inbox
function renderInbox(){
    inboxList.innerHTML='';
    let inboxEmails = emails.filter(e=>e.folder===currentFolder);
    if(inboxEmails.length===0){ inboxList.innerHTML='<p>No emails</p>'; return;}
    inboxEmails.forEach(e=>{
        let div=document.createElement('div');
        div.className='email';
        div.innerHTML=`<strong>${e.subject}</strong> <span>${e.body}</span>`;
        inboxList.appendChild(div);
    });
}
renderInbox();
