// ===== STORAGE =====
let emails = JSON.parse(localStorage.getItem("emails")) || [];
let userEmail = localStorage.getItem("userEmail");
let currentFolder = "inbox";
let selectedEmail = null;

// ===== ELEMENTS =====
const emailsList = document.getElementById("emailsList");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("readerTitle");
const readerSender = document.getElementById("readerSender");
const readerDate = document.getElementById("readerDate");
const readerText = document.getElementById("readerText");
const readerFiles = document.getElementById("readerFiles");
const attachmentsList = document.getElementById("attachmentsList");
const inboxCount = document.getElementById("inboxCount");
const trashCount = document.getElementById("trashCount");
const currentFolderTitle = document.getElementById("currentFolder");
const userEmailSpan = document.getElementById("userEmail");

const composeBtn = document.getElementById("composeBtn");
const composeModal = document.getElementById("composeModal");
const closeComposeBtn = document.getElementById("closeCompose");
const mailTo = document.getElementById("mailTo");
const mailSubject = document.getElementById("mailSubject");
const mailText = document.getElementById("mailText");
const mailFile = document.getElementById("mailFile");
const filePreview = document.getElementById("filePreview");
const uploadProgress = document.getElementById("uploadProgress");

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const editEmail = document.getElementById("editEmail");
const saveSettings = document.getElementById("saveSettings");
const themeToggle = document.getElementById("themeToggle");
const toastEl = document.getElementById("toast");
const imageModal = document.getElementById("imageModal");

// ===== INIT =====
initUser();
initDemoEmails();
renderEmails();
updateCounters();

// ===== USER =====
function initUser(){
  if(!userEmail){
    userEmail = prompt("Enter your email:");
    if(!userEmail) userEmail = "user@mail.com";
    localStorage.setItem("userEmail", userEmail);
  }
  userEmailSpan.textContent = userEmail;
}

// ===== DEMO EMAILS =====
function initDemoEmails(){
  if(emails.length>0) return;
  emails=[{
    id:Date.now(),
    folder:"inbox",
    from:"welcome@inbox.pro",
    subject:"Welcome to Inbox Pro 👋",
    text:"This is a demo email.\nYou can delete it, reply or attach files.",
    date:new Date().toLocaleString(),
    unread:true,
    files:[]
  }];
  saveEmails();
}

// ===== RENDER EMAILS =====
function renderEmails(){
  emailsList.innerHTML="";
  const filtered = emails.filter(e=>e.folder===currentFolder);
  if(filtered.length===0){
    emailsList.innerHTML=`<div class="empty-state"><i class="fas fa-inbox"></i><h3>No emails</h3></div>`;
    return;
  }
  filtered.forEach(email=>{
    const div=document.createElement("div");
    div.className=`email ${email.unread?"unread":""}`;
    div.innerHTML=`
      <div class="email-avatar">${email.from[0].toUpperCase()}</div>
      <div class="email-content">
        <div class="email-header">
          <span class="email-sender">${email.from}</span>
          <span class="email-date">${email.date}</span>
        </div>
        <div class="email-subject">${email.subject}</div>
        <div class="email-preview">${email.text.slice(0,40)}...</div>
      </div>
    `;
    div.onclick=()=>openEmail(email.id);
    emailsList.appendChild(div);
  });
}

// ===== OPEN EMAIL =====
function openEmail(id){
  selectedEmail = emails.find(e=>e.id===id);
  if(!selectedEmail) return;
  selectedEmail.unread=false;
  readerTitle.textContent=selectedEmail.subject;
  readerSender.textContent="From: "+selectedEmail.from;
  readerDate.textContent=selectedEmail.date;
  readerText.textContent=selectedEmail.text;

  attachmentsList.innerHTML="";
  if(selectedEmail.files.length>0){
    readerFiles.style.display="block";
    selectedEmail.files.forEach(file=>{
      const item=document.createElement("div");
      item.className="attachment-item";
      item.innerHTML=`<span>${file.name}</span><button class="attachment-btn view">View</button>`;
      item.querySelector("button").onclick=()=>{
        if(file.type.startsWith("image")){
          document.getElementById("modalImage").src=file.data;
          imageModal.style.display="flex";
        } else { alert("Preview not supported"); }
      };
      attachmentsList.appendChild(item);
    });
  } else { readerFiles.style.display="none"; }

  reader.classList.add("active");
  saveEmails();
  renderEmails();
  updateCounters();
}

// ===== SEND EMAIL =====
document.getElementById("sendMail").onclick=()=>{
  const to=mailTo.value.trim();
  if(!to.includes("@")) return toast("Invalid email");

  const files=[];
  if(mailFile.files.length>0){
    [...mailFile.files].forEach(file=>{
      const reader=new FileReader();
      reader.onload=()=>{
        files.push({name:file.name,type:file.type,data:reader.result});
      };
      reader.readAsDataURL(file);
    });
  }

  // Simulate upload progress
  let progress=0;
  const interval=setInterval(()=>{
    progress+=10;
    uploadProgress.style.width=progress+"%";
    if(progress>=100) clearInterval(interval);
  },30);

  setTimeout(()=>{
    emails.unshift({
      id:Date.now(),
      folder:"sent",
      from:userEmail,
      subject:mailSubject.value||"(No subject)",
      text:mailText.value,
      date:new Date().toLocaleString(),
      unread:false,
      files
    });
    saveEmails();
    renderEmails();
    closeCompose();
    toast("Email sent!");
  },400);
};

// ===== DELETE =====
document.getElementById("deleteEmailBtn").onclick=()=>{
  if(!selectedEmail) return;
 
