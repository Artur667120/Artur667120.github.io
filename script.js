// AUTH
const loginScreen = document.getElementById('loginScreen');
const app = document.getElementById('app');

if(localStorage.user){
  startApp();
}

document.getElementById('loginBtn').onclick = ()=>{
  const email = loginEmail.value;
  const pass = loginPassword.value;
  if(!email || !pass) return alert("Fill all");
  localStorage.user = JSON.stringify({email,pass});
  startApp();
};

function startApp(){
  loginScreen.classList.add('hidden');
  app.classList.remove('hidden');
  userEmail.innerText = JSON.parse(localStorage.user).email;
}

// THEME
themeToggle.onclick = ()=>{
  document.body.classList.toggle('light');
};

// EMAILS
let emails = JSON.parse(localStorage.emails||'[]');
let folder = 'inbox';

function render(){
  emailsDiv.innerHTML='';
  emails.filter(e=>e.folder===folder).forEach(e=>{
    const d=document.createElement('div');
    d.className='email';
    d.innerText=e.subject;
    d.onclick=()=>openEmail(e);
    emailsDiv.appendChild(d);
  });
}

function openEmail(e){
  reader.classList.remove('hidden');
  rSubject.innerText=e.subject;
  rFrom.innerText="From: "+e.from;
  rText.innerText=e.text;
  deleteBtn.onclick=()=>{
    e.folder='trash';
    save();
  }
}

backBtn.onclick=()=>reader.classList.add('hidden');

// COMPOSE
composeBtn.onclick=()=>composeModal.classList.remove('hidden');
function closeCompose(){ composeModal.classList.add('hidden'); }

sendBtn.onclick=()=>{
  emails.push({
    from:userEmail.innerText,
    subject:subject.value,
    text:text.value,
    folder:'sent'
  });
  save();
  closeCompose();
};

// MENU
document.querySelectorAll('.menu-item').forEach(i=>{
  i.onclick=()=>{
    document.querySelector('.active').classList.remove('active');
    i.classList.add('active');
    folder=i.dataset.folder;
    render();
  }
});

function save(){
  localStorage.emails=JSON.stringify(emails);
  render();
}

const emailsDiv=document.getElementById('emails');
render();
