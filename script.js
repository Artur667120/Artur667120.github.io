// STORAGE
let emails = JSON.parse(localStorage.getItem("emails")) || [];
let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
let userEmail = localStorage.getItem("userEmail") || "";
let currentFolder = "inbox";
let selectedEmail = null;

// ELEMENTS
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

const composeModal = document.getElementById("composeModal");
const mailTo = document.getElementById("mailTo");
const mailSubject = document.getElementById("mailSubject");
const mailText = document.getElementById("mailText");
const mailFile = document.getElementById("mailFile");
const filePreview = document.getElementById("filePreview");
const uploadProgress = document.getElementById("uploadProgress");
const sendMailBtn = document.getElementById("sendMail");
const closeComposeBtn = document.getElementById("closeCompose");
const saveDraftBtn = document.getElementById("saveDraft");

// INIT
initUser();
renderEmails();
updateCounters();

// INIT USER
function initUser(){
  if(!userEmail) {
    userEmail = prompt("Create your email address:") || "user@mail.com";
    localStorage.setItem("userEmail", userEmail);
  }
  userEmailSpan.textContent = userEmail;
}

// RENDER EMAILS
function renderEmails(){
  emailsList.innerHTML = "";
  const filtered = emails.filter(e => e.folder === currentFolder);
  if(filtered.length===0){ emailsList.innerHTML='<div class="empty-state"><i class="fas fa-inbox"></i><h3>No emails</h3></div>'; return; }
  filtered.forEach(email=>{
    const div = document.createElement("div");
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
      </div>`;
    div.onclick=()=>openEmail(email.id);
    emailsList.appendChild(div);
  });
}

// OPEN EMAIL
function openEmail(id){
  selectedEmail = emails.find(e=>e.id===id);
  if(!selectedEmail) return;
  selectedEmail.unread=false;
  readerTitle.textContent=selectedEmail.subject;
  readerSender.textContent="From: "+selectedEmail.from;
  readerDate.textContent=selectedEmail.date;
  readerText.textContent=selectedEmail.text;
  attachmentsList.innerHTML="";
  if(selectedEmail.files?.length>0){
    readerFiles.style.display="block";
    selectedEmail.files.forEach(file=>{
      const item=document.createElement("div");
      item.className="attachment-item";
      item.innerHTML=`<span>${file.name}</span><button class="attachment-btn view">View</button>`;
      item.querySelector("button").onclick=()=>{
        if(file.type.startsWith("image")){
          document.getElementById("modalImage").src=file.data;
          document.getElementById("imageModal").style.display="flex";
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

// SEND EMAIL
sendMailBtn.onclick=()=>{
  const to=mailTo.value.trim();
  if(!to.includes("@")) return toast("Invalid email");
  const files=[];
  [...mailFile.files].forEach(file=>{
    const reader=new FileReader();
    reader.onload=()=>{ files.push({name:file.name,type:file.type,data:reader.result}); };
    reader.readAsDataURL(file);
  });
  setTimeout(()=>{
    emails.unshift({id:Date.now(),folder:"sent",from:userEmail,subject:mailSubject.value||"(No subject)",text:mailText.value,date:new Date().toLocaleString(),unread:false,files});
    saveEmails();
    renderEmails();
    closeCompose();
    toast("Email sent!");
  },300);
};

// SAVE DRAFT
saveDraftBtn.onclick=()=>{
  drafts.unshift({id:Date.now(),subject:mailSubject.value||"(No subject)",text:mailText.value,date:new Date().toLocaleString()});
  localStorage.setItem("drafts",JSON.stringify(drafts));
  closeCompose();
  toast("Draft saved!");
};

// CLOSE COMPOSE
closeComposeBtn.onclick=closeCompose;
function closeCompose(){ composeModal.style.display="none"; mailTo.value=mailSubject.value=mailText.value=""; mailFile.value=""; filePreview.innerHTML=""; uploadProgress.style.width="0"; }

// DELETE EMAIL
document.getElementById("deleteEmailBtn").onclick=()=>{
  if(!selectedEmail) return;
  selectedEmail.folder="trash";
  reader.classList.remove("active");
  saveEmails();
  renderEmails();
  updateCounters();
};

// MENU
document.querySelectorAll(".menu-item").forEach(item=>{
  item.onclick=()=>{
    document.querySelectorAll(".menu-item").forEach(i=>i.classList.remove("active"));
    item.classList.add("active");
    currentFolder=item.dataset.folder;
    currentFolderTitle.textContent=item.innerText;
    reader.classList.remove("active");
    renderEmails();
  };
});

// SETTINGS
document.getElementById("settingsBtn").onclick=()=>{
  editEmail.value=userEmail;
  document.getElementById("settingsModal").style.display="flex";
};
document.getElementById("saveSettings").onclick=()=>{
  userEmail=editEmail.value;
  localStorage.setItem("userEmail",userEmail);
  userEmailSpan.textContent=userEmail;
  document.getElementById("settingsModal").style.display="none";
};

// THEME
document.getElementById("themeToggle").onclick=()=>document.body.classList.toggle("light");

// TOAST
function toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2500); }

// UTILS
function saveEmails(){ localStorage.setItem("emails",JSON.stringify(emails)); }
function updateCounters(){ inboxCount.textContent=emails.filter(e=>e.folder==="inbox"&&e.unread).length; trashCount.textContent=emails.filter(e=>e.folder==="trash").length; }
document.getElementById("closeImage").onclick=()=>document.getElementById("imageModal").style.display="none";

// DRAG & DROP
mailFile.addEventListener("dragover", e=>{ e.preventDefault(); mailFile.style.border="2px dashed #4caf50"; });
mailFile.addEventListener("dragleave", e=>{ e.preventDefault(); mailFile.style.border=""; });
mailFile.addEventListener("drop", e=>{
  e.preventDefault();
  mailFile.files=e.dataTransfer.files;
  mailFile.style.border="";
});
