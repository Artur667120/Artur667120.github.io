const composeBtn = document.getElementById("composeBtn");
const composeModal = document.getElementById("composeModal");
const closeCompose = document.getElementById("closeCompose");
const sendMail = document.getElementById("sendMail");

const mailTo = document.getElementById("mailTo");
const mailSubject = document.getElementById("mailSubject");
const mailText = document.getElementById("mailText");
const mailFile = document.getElementById("mailFile");
const filePreview = document.getElementById("filePreview");

const progress = document.querySelector(".progress");
const progressBar = document.getElementById("progressBar");

const DRAFT_KEY = "draft_mail";

/* OPEN */
composeBtn.onclick = () => {
  loadDraft();
  composeModal.classList.add("show");
};

/* RESET */
function resetForm() {
  mailTo.value = "";
  mailSubject.value = "";
  mailText.value = "";
  mailFile.value = "";
  filePreview.innerHTML = "Drag & drop files here";
  localStorage.removeItem(DRAFT_KEY);
}

/* CANCEL */
closeCompose.onclick = () => {
  resetForm();
  composeModal.classList.remove("show");
};

/* FILE PREVIEW */
function renderFiles() {
  filePreview.innerHTML = "";
  [...mailFile.files].forEach(f => {
    const d = document.createElement("div");
    d.textContent = f.name;
    filePreview.appendChild(d);
  });
}

mailFile.onchange = renderFiles;

/* DRAG DROP */
filePreview.ondragover = e => {
  e.preventDefault();
  filePreview.classList.add("drag");
};

filePreview.ondragleave = () => {
  filePreview.classList.remove("drag");
};

filePreview.ondrop = e => {
  e.preventDefault();
  filePreview.classList.remove("drag");
  mailFile.files = e.dataTransfer.files;
  renderFiles();
};

/* DRAFTS */
function saveDraft() {
  const d = {
    to: mailTo.value,
    subject: mailSubject.value,
    text: mailText.value
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
}

function loadDraft() {
  const d = JSON.parse(localStorage.getItem(DRAFT_KEY));
  if (!d) return;
  mailTo.value = d.to;
  mailSubject.value = d.subject;
  mailText.value = d.text;
}

[mailTo, mailSubject, mailText].forEach(el =>
  el.addEventListener("input", saveDraft)
);

/* SEND */
sendMail.onclick = () => {
  if (!mailTo.value || !mailText.value) {
    alert("Fill required fields");
    return;
  }

  progress.style.display = "block";
  let p = 0;

  const timer = setInterval(() => {
    p += 10;
    progressBar.style.width = p + "%";

    if (p >= 100) {
      clearInterval(timer);
      progress.style.display = "none";
      progressBar.style.width = "0%";

      resetForm();
      composeModal.classList.remove("show");
      alert("Mail sent ✔");
    }
  }, 120);
};
