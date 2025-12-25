const composeModal = document.getElementById("composeModal");
const composeBtn = document.getElementById("composeBtn");
const closeCompose = document.getElementById("closeCompose");
const sendMail = document.getElementById("sendMail");

const mailTo = document.getElementById("mailTo");
const mailSubject = document.getElementById("mailSubject");
const mailText = document.getElementById("mailText");
const mailFile = document.getElementById("mailFile");
const filePreview = document.getElementById("filePreview");

composeBtn.onclick = () => composeModal.classList.add("show");

function resetComposeForm() {
  mailTo.value = "";
  mailSubject.value = "";
  mailText.value = "";

  mailFile.value = "";          // 🔥 ОЧИЩЕННЯ FILE INPUT
  filePreview.innerHTML = "";  // 🔥 ОЧИЩЕННЯ PREVIEW
}

closeCompose.onclick = () => {
  resetComposeForm();
  composeModal.classList.remove("show");
};

mailFile.onchange = () => {
  filePreview.innerHTML = "";
  [...mailFile.files].forEach(file => {
    const div = document.createElement("div");
    div.textContent = file.name;
    filePreview.appendChild(div);
  });
};

sendMail.onclick = () => {
  if (!mailTo.value || !mailText.value) {
    alert("Fill email and message");
    return;
  }

  alert("Mail sent ✔");

  resetComposeForm();
  composeModal.classList.remove("show");
};
