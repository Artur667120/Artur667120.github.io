// ====================== GLOBAL VARIABLES ======================
let emails = JSON.parse(localStorage.getItem('emails') || '[]');
let currentFolder = 'inbox';
let currentUserEmail = localStorage.getItem('userEmail');
let currentSelectedEmail = null;

// ====================== DOM ELEMENTS ======================
const emailsContainer = document.getElementById('emailsList');
const readerTitle = document.getElementById('readerTitle');
const readerText = document.getElementById('readerText');
const readerSender = document.getElementById('readerSender');
const readerDate = document.getElementById('readerDate');
const attachmentsList = document.getElementById('attachmentsList');
const userEmailElement = document.getElementById('userEmail');
const currentFolderElement = document.getElementById('currentFolder');
const emptyTrashBtn = document.getElementById('emptyTrashBtn');
const deleteEmailBtn = document.getElementById('deleteEmailBtn');

// ====================== INITIALIZATION ======================
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Initialize user email
    if (!currentUserEmail) {
        setTimeout(() => {
            showEmailPrompt();
        }, 500);
    } else {
        userEmailElement.textContent = currentUserEmail;
    }

    // Initialize event listeners
    initEventListeners();
    
    // Initialize theme
    initTheme();
    
    // Initialize language
    initLanguage();
    
    // Render initial emails
    renderEmails('inbox');
    
    // Setup mobile menu
    setupMobileMenu();
}

// ====================== USER EMAIL SETUP ======================
function showEmailPrompt() {
    const modal = document.getElementById('settingsModal');
    const emailInput = document.getElementById('editEmail');
    
    emailInput.value = '';
    modal.style.display = 'flex';
    
    document.getElementById('saveSettings').onclick = function() {
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
            currentUserEmail = email;
            localStorage.setItem('userEmail', email);
            userEmailElement.textContent = email;
            modal.style.display = 'none';
            showNotification('Email saved successfully!');
        } else {
            alert('Please enter a valid email address');
        }
    };
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ====================== EMAIL STORAGE & RENDERING ======================
function renderEmails(folder = 'inbox') {
    currentFolder = folder;
    emailsContainer.innerHTML = '';
    currentFolderElement.textContent = getFolderName(folder);
    
    const filteredEmails = emails.filter(email => email.folder === folder);
    
    if (filteredEmails.length === 0) {
        emailsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 15px;"></i>
                <h3>No emails found</h3>
                <p>${folder === 'inbox' ? 'Your inbox is empty' : 'No emails in this folder'}</p>
            </div>
        `;
    } else {
        filteredEmails.forEach((email, index) => {
            const emailElement = createEmailElement(email, index);
            emailsContainer.appendChild(emailElement);
        });
    }
    
    // Show/hide empty trash button
    emptyTrashBtn.style.display = folder === 'trash' ? 'flex' : 'none';
    
    // Reset reader
    resetReader();
}

function createEmailElement(email, index) {
    const div = document.createElement('div');
    div.className = `email ${email.unread ? 'unread' : ''}`;
    
    const avatarColor = stringToColor(email.sender || currentUserEmail);
    const avatarLetter = (email.sender || currentUserEmail).charAt(0).toUpperCase();
    const date = formatDate(email.date);
    const preview = email.text.substring(0, 60) + (email.text.length > 60 ? '...' : '');
    
    div.innerHTML = `
        <div class="email-avatar" style="background: ${avatarColor}">${avatarLetter}</div>
        <div class="email-content">
            <div class="email-header">
                <div class="email-sender">${email.sender || currentUserEmail}</div>
                <div class="email-date">${date}</div>
            </div>
            <div class="email-subject">${email.subject || '(No Subject)'}</div>
            <div class="email-preview">${preview}</div>
        </div>
        <div class="email-actions">
            <button class="delete-btn" onclick="deleteEmail(${email.id}, event)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    div.onclick = (e) => {
        if (!e.target.closest('.delete-btn')) {
            openEmail(email.id);
            // Remove unread status
            if (email.unread) {
                email.unread = false;
                saveEmails();
            }
        }
    };
    
    return div;
}

function openEmail(emailId) {
    const email = emails.find(e => e.id === emailId);
    if (!email) return;
    
    currentSelectedEmail = emailId;
    
    readerTitle.textContent = email.subject || '(No Subject)';
    readerSender.textContent = `From: ${email.sender || currentUserEmail}`;
    readerDate.textContent = `Date: ${formatDate(email.date, true)}`;
    readerText.textContent = email.text;
    
    renderAttachments(email.attachments || []);
    
    // Show delete button
    deleteEmailBtn.style.display = 'flex';
    
    // Scroll to reader on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.email-reader').classList.add('active');
        document.querySelector('.emails').style.display = 'none';
    }
}

function renderAttachments(attachments) {
    attachmentsList.innerHTML = '';
    
    if (attachments.length === 0) {
        attachmentsList.innerHTML = '<p style="color: var(--text-secondary);">No attachments</p>';
        return;
    }
    
    attachments.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'attachment-item';
        
        const size = formatFileSize(file.size);
        const isImage = file.type.startsWith('image/');
        
        div.innerHTML = `
            <div class="attachment-info">
                <div class="attachment-icon">
                    <i class="fas fa-${getFileIcon(file.type)}"></i>
                </div>
                <div>
                    <div class="attachment-name">${file.name}</div>
                    <div class="attachment-size">${size}</div>
                </div>
            </div>
            <div class="attachment-actions">
                ${isImage ? `
                    <button class="attachment-btn view" onclick="previewImage('${file.data}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                ` : ''}
                <button class="attachment-btn" onclick="downloadFile('${file.data}', '${file.name}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `;
        
        attachmentsList.appendChild(div);
    });
}

function resetReader() {
    readerTitle.textContent = 'Select an email';
    readerSender.textContent = '';
    readerDate.textContent = '';
    readerText.textContent = 'Select an email from the list to view its contents.';
    attachmentsList.innerHTML = '';
    deleteEmailBtn.style.display = 'none';
    currentSelectedEmail = null;
}

// ====================== EMAIL OPERATIONS ======================
function deleteEmail(emailId, event) {
    if (event) event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this email?')) {
        const emailIndex = emails.findIndex(e => e.id === emailId);
