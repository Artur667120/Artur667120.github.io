document.getElementById('sendMail').onclick = ()=>{
    let to = mailToInput.value.trim();
    if(!/\S+@\S+\.\S+/.test(to)){ 
        showToast("Invalid recipient email"); 
        return; 
    }

    let newEmail = {
        id: Date.now(),
        from: currentUserEmail,
        to: to,
        subject: mailSubjectInput.value,
        body: mailTextInput.value,
        files: [...fileInput.files].map(f=>({name:f.name,size:f.size})),
        folder: 'sent', // обов'язково "sent"
        date: new Date().toLocaleString()
    };

    emails.push(newEmail);
    localStorage.setItem('emails', JSON.stringify(emails));
    showToast("Email sent!");

    closeComposeModal();

    // Якщо ми зараз у папці Sent, автоматично оновлюємо список
    if(currentFolder==='sent') {
        renderEmails();
    } else {
        // Перемикаємося на Sent і рендеримо
        currentFolder='sent';
        document.getElementById('currentFolder').textContent = "Sent";
        sidebarItems.forEach(i=>i.classList.remove('active'));
        document.querySelector('.menu-item[data-folder="sent"]').classList.add('active');
        renderEmails();
    }
};
