let emails = JSON.parse(localStorage.getItem('emails')) || [];
let currentFolder = 'inbox';
let emailIdCounter = parseInt(localStorage.getItem('emailIdCounter')) || 1;

const emailsList = document.getElementById('emailsList');
const currentFolderEl = document.getElementById('currentFolder');
const composeBtn = document.getElementById('composeBtn');
const composeModal = document.getElementById('composeModal');
const closeCompose = document.getElementById('closeCompose');
const sendMail = document.getElementById('sendMail');
const mailTo = document.getElementById('mailTo');
const mailSubject = document.getElementById('mailSubject');
const mailText = document.getElementById('mailText');

function renderEmails() {
    emailsList.innerHTML = '';
    const folderEmails = emails.filter(e => e.folder === currentFolder);
    if(folderEmails.length === 0){
        emailsList.innerHTML = `<p style="text-align:center;color:#888;">No emails in ${currentFolder}</p>`;
        return;
    }
    folderEmails.forEach(email => {
        const div = document.createElement('div');
        div.className = 'email';
        div.innerHTML = `<div class="email-avatar">${email.sender[0]}</div>
                        <div class="email-content">
                            <div class="email-header">
                                <span class="email-sender">${email.sender}</span>
                                <span class="email-date">${email.date}</span>
                            </div>
                            <div class="email-subject">${email.subject}</div>
                            <div class="email-preview">${email.body.substring(0,50)}...</div>
                        </div>`;
        emailsList.appendChild(div);
    });
}

// Compose modal
composeBtn.onclick = ()=> composeModal.style.display='flex';
closeCompose.onclick = ()=> composeModal.style.display='none';
sendMail.onclick = ()=>{
    if(!mailTo.value){alert('Enter recipient'); return;}
    const newEmail = {
        id:emailIdCounter++, sender:'user@example.com', to:mailTo.value,
        subject:mailSubject.value, body:mailText.value, date:new Date().toLocaleString(), folder:'sent'
    };
    emails.push(newEmail);
    localStorage.setItem('emails', JSON.stringify(emails));
    localStorage.setItem('emailIdCounter', emailIdCounter);
    mailTo.value=''; mailSubject.value=''; mailText.value='';
    composeModal.style.display='none';
    renderEmails();
}

// Initialize
renderEmails();
