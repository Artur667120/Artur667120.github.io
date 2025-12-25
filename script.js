            id: 11,
            from: 'oldnews@archive.com',
            fromName: 'Old Newsletter',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'News from 2020',
            body: 'This is an old newsletter that you deleted.',
            date: new Date(Date.now() - 31536000000).toISOString(), // 1 year ago
            folder: 'trash',
            read: true,
            important: false,
            labels: [],
            attachments: []
        },
        {
            id: 12,
            from: 'boss@company.com',
            fromName: 'Your Manager',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'Important: Quarterly Review',
            body: 'Please prepare your quarterly review presentation.\n\nMeeting: Friday, 10 AM\nDuration: 1 hour\n\nRequired: Performance metrics, achievements, goals.',
            date: new Date(Date.now() - 3600000).toISOString(),
            folder: 'important',
            read: false,
            important: true,
            labels: ['work'],
            attachments: []
        },
        {
            id: 13,
            from: 'family@home.com',
            fromName: 'Family Group',
            to: currentUser ? currentUser.email : 'user@example.com',
            subject: 'Family Reunion Photos',
            body: 'Here are the photos from our family reunion!\n\nEveryone looks great. Check out the attached photos.',
            date: new Date(Date.now() - 86400000).toISOString(),
            folder: 'important',
            read: true,
            important: true,
            labels: ['personal'],
            attachments: [
                { name: 'reunion_photo1.jpg', size: '2.1 MB', type: 'image' },
                { name: 'reunion_photo2.jpg', size: '1.8 MB', type: 'image' }
            ]
        }
    ];
    
    emails = sampleEmails;
    saveEmails();
}

function switchFolder(folder) {
    currentFolder = folder;
    selectedEmails.clear();
    currentSelectedEmail = null;
    
    // Update UI
    updateUI();
    
    // Show/hide empty trash button
    document.getElementById('emptyTrashBtn').style.display = folder === 'trash' ? 'flex' : 'none';
    
    // Update folder icon in header
    const iconMap = {
        inbox: 'fa-inbox',
        important: 'fa-star',
        sent: 'fa-paper-plane',
        drafts: 'fa-file-alt',
        spam: 'fa-ban',
        trash: 'fa-trash'
    };
    
    const icon = iconMap[folder] || 'fa-inbox';
    document.getElementById('currentFolder').innerHTML = `<i class="fas ${icon}"></i> <span>${translations[currentLanguage][folder] || folder}</span>`;
}

function updateUI() {
    if (!currentUser) return;
    
    // Update user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    updateUserAvatar();
    
    // Update counts
    updateFolderCounts();
    
    // Display emails
    displayEmails();
    
    // Update reader if email is selected
    if (currentSelectedEmail) {
        const email = emails.find(e => e.id === currentSelectedEmail);
        if (email) {
            displayEmail(email);
        } else {
            // Reset reader if email not found
            document.getElementById('readerTitle').textContent = translations[currentLanguage].selectEmail;
            document.getElementById('readerText').innerHTML = `<p>${translations[currentLanguage].selectEmailDesc}</p>`;
            document.getElementById('readerFiles').style.display = 'none';
        }
    }
}

function updateUserAvatar() {
    if (!currentUser) return;
    
    const avatar = document.getElementById('userAvatar');
    avatar.textContent = getInitials(currentUser.name);
    avatar.style.background = currentUser.avatarColor || '#667eea';
}

function updateFolderCounts() {
    if (!emails.length) return;
    
    const inboxCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
    const importantCount = emails.filter(e => e.folder === 'important').length;
    const sentCount = emails.filter(e => e.folder === 'sent').length;
    const draftsCount = emails.filter(e => e.folder === 'drafts').length;
    const spamCount = emails.filter(e => e.folder === 'spam').length;
    const trashCount = emails.filter(e => e.folder === 'trash').length;
    
    document.getElementById('inboxCount').textContent = inboxCount > 0 ? inboxCount : '';
    document.getElementById('importantCount').textContent = importantCount > 0 ? importantCount : '';
    document.getElementById('sentCount').textContent = sentCount > 0 ? sentCount : '';
    document.getElementById('draftsCount').textContent = draftsCount > 0 ? draftsCount : '';
    document.getElementById('spamCount').textContent = spamCount > 0 ? spamCount : '';
    document.getElementById('trashCount').textContent = trashCount > 0 ? trashCount : '';
    
    // Update folder stats
    const folderEmails = emails.filter(e => e.folder === currentFolder);
    const unreadInFolder = folderEmails.filter(e => !e.read).length;
    
    document.getElementById('emailCount').textContent = `${folderEmails.length} ${folderEmails.length === 1 ? 'email' : 'emails'}`;
    document.getElementById('unreadCount').textContent = `${unreadInFolder} unread`;
}

function displayEmails() {
    const container = document.getElementById('emailsList');
    if (!container) return;
    
    let folderEmails = emails.filter(e => e.folder === currentFolder);
    
    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        folderEmails = folderEmails.filter(email => 
            email.subject.toLowerCase().includes(searchTerm) ||
            email.fromName.toLowerCase().includes(searchTerm) ||
            email.from.toLowerCase().includes(searchTerm) ||
            email.body.toLowerCase().includes(searchTerm)
        );
    }
    
    if (folderEmails.length === 0) {
        container.innerHTML = `
            <div class="empty-state animate__animated animate__fadeIn">
                <i class="fas fa-inbox"></i>
                <h3 data-i18n="emptyInbox">${translations[currentLanguage].emptyInbox}</h3>
                <p data-i18n="noEmails">${translations[currentLanguage].noEmails}</p>
            </div>
        `;
        applyLanguage();
        return;
    }
    
    container.innerHTML = '';
    
    // Sort by date (newest first)
    folderEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    folderEmails.forEach((email, index) => {
        const emailElement = createEmailElement(email, index);
        container.appendChild(emailElement);
        
        // Animate with delay
        setTimeout(() => {
            emailElement.style.opacity = '1';
            emailElement.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function createEmailElement(email, index) {
    const div = document.createElement('div');
    div.className = `email ${email.read ? '' : 'unread'} ${selectedEmails.has(email.id) ? 'selected' : ''}`;
    div.dataset.id = email.id;
    div.style.animationDelay = `${index * 50}ms`;
    
    const initials = getInitials(email.fromName || email.from);
    const date = formatDate(email.date);
    const preview = email.body.substring(0, 80) + (email.body.length > 80 ? '...' : '');
    
    div.innerHTML = `
        <div class="email-avatar" style="background: ${stringToColor(email.from)}">
            ${initials}
        </div>
        <div class="email-content">
            <div class="email-header">
                <div class="email-sender">${email.fromName || email.from}</div>
                <div class="email-date">${date}</div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${preview}</div>
        </div>
    `;
    
    div.addEventListener('click', (e) => {
        if (!e.target.closest('.email-actions')) {
            selectEmail(email.id);
            displayEmail(email);
            
            // Mark as read
            if (!email.read) {
                email.read = true;
                saveEmails();
                updateUI();
            }
        }
    });
    
    return div;
}

function displayEmail(email) {
    if (!email) return;
    
    // Update reader view
    document.getElementById('readerTitle').textContent = email.subject;
    document.getElementById('readerAvatar').textContent = getInitials(email.fromName || email.from);
    document.getElementById('readerAvatar').style.background = stringToColor(email.from);
    document.getElementById('readerSender').textContent = email.fromName || email.from;
    document.getElementById('readerSenderEmail').textContent = email.from;
    document.getElementById('readerSubject').textContent = email.subject;
    document.getElementById('readerDate').textContent = formatDate(email.date, true);
    document.getElementById('readerText').innerHTML = email.body.replace(/\n/g, '<br>');
    
    // Update star button
    const starBtn = document.getElementById('starBtn');
    starBtn.innerHTML = email.important ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    
    // Show labels
    const labelsContainer = document.getElementById('emailLabels');
    labelsContainer.innerHTML = '';
    if (email.labels && email.labels.length > 0) {
        email.labels.forEach(label => {
            const labelElement = document.createElement('span');
            labelElement.className = `label ${label}`;
            labelElement.textContent = label.charAt(0).toUpperCase() + label.slice(1);
            labelsContainer.appendChild(labelElement);
        });
    }
    
    // Show attachments if any
    if (email.attachments && email.attachments.length > 0) {
        document.getElementById('readerFiles').style.display = 'block';
        const attachmentsList = document.getElementById('attachmentsList');
        attachmentsList.innerHTML = '';
        
        email.attachments.forEach(attachment => {
            const attachmentElement = createAttachmentElement(attachment);
            attachmentsList.appendChild(attachmentElement);
        });
        
        document.querySelector('.attachment-count').textContent = `(${email.attachments.length})`;
        
        // Update size
        const totalSize = email.attachments.reduce((sum, att) => {
            const size = parseFloat(att.size) || 0;
            return sum + size;
        }, 0);
        document.getElementById('emailSize').textContent = totalSize > 1024 ? 
            `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize} KB`;
    } else {
        document.getElementById('readerFiles').style.display = 'none';
        document.getElementById('emailSize').textContent = '0 KB';
    }
    
    // Show reader on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.emails').style.display = 'none';
        document.getElementById('reader').classList.add('active');
    }
    
    currentSelectedEmail = email.id;
}

function createAttachmentElement(attachment) {
    const div = document.createElement('div');
    div.className = 'attachment-item';
    
    const icon = getFileIcon(attachment.type || attachment.name.split('.').pop());
    const size = attachment.size || 'Unknown size';
    
    div.innerHTML = `
        <div class="attachment-info">
            <i class="fas ${icon} attachment-icon"></i>
            <div class="attachment-details">
                <div class="attachment-name">${attachment.name}</div>
                <div class="attachment-size">${size}</div>
            </div>
        </div>
        <div class="attachment-actions">
            <button class="attachment-btn view" data-file="${attachment.name}">
                <i class="fas fa-eye"></i> ${translations[currentLanguage].view}
            </button>
            <button class="attachment-btn download" data-file="${attachment.name}">
                <i class="fas fa-download"></i> ${translations[currentLanguage].download}
            </button>
        </div>
    `;
    
    // Add event listeners for attachment buttons
    div.querySelector('.view').addEventListener('click', () => {
        if (isImageFile(attachment.name)) {
            openImagePreview(attachment.name, 'Attachment preview');
        } else {
            showToast(`Preview not available for ${attachment.name}`, 'info');
        }
    });
    
    div.querySelector('.download').addEventListener('click', () => {
        showToast(`Downloading ${attachment.name}...`, 'info');
        // In a real app, this would trigger actual download
        simulateDownload(attachment.name);
    });
    
    return div;
}

function selectEmail(id) {
    const email = emails.find(e => e.id === id);
    if (email) {
        // Toggle selection
        if (selectedEmails.has(id)) {
            selectedEmails.delete(id);
        } else {
            selectedEmails.add(id);
        }
        
        // If only one email selected, display it
        if (selectedEmails.size === 1) {
            currentSelectedEmail = id;
            displayEmail(email);
        } else {
            currentSelectedEmail = null;
            document.getElementById('readerTitle').textContent = `${selectedEmails.size} emails selected`;
            document.getElementById('readerText').innerHTML = `<p>${selectedEmails.size} emails are selected. Use the actions above to manage them.</p>`;
        }
        
        updateUI();
    }
}

// ====================== UTILITY FUNCTIONS ======================
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#fa709a', '#fee140', '#a8edea', '#fed6e3'
    ];
    
    return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateString, full = false) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    } else if (diff < 604800000) { // Less than 1 week
        const days = Math.floor(diff / 86400000);
        return `${days}d ago`;
    } else if (full) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString();
    }
}

function getFileIcon(ext) {
    const icons = {
        pdf: 'fa-file-pdf',
        doc: 'fa-file-word',
        docx: 'fa-file-word',
        xls: 'fa-file-excel',
        xlsx: 'fa-file-excel',
        ppt: 'fa-file-powerpoint',
        pptx: 'fa-file-powerpoint',
        jpg: 'fa-file-image',
        jpeg: 'fa-file-image',
        png: 'fa-file-image',
        gif: 'fa-file-image',
        txt: 'fa-file-alt',
        zip: 'fa-file-archive',
        rar: 'fa-file-archive',
        mp3: 'fa-file-audio',
        mp4: 'fa-file-video',
        mov: 'fa-file-video'
    };
    
    return icons[ext.toLowerCase()] || 'fa-file';
}

function isImageFile(filename) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const ext = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ====================== MODAL FUNCTIONS ======================
function openComposeModal() {
    const modal = document.getElementById('composeModal');
    modal.style.display = 'flex';
    
    // Set sender email if available
    if (currentUser) {
        document.getElementById('mailTo').focus();
    }
}

function closeModal(modal) {
    modal.style.display = 'none';
}

function clearComposeForm() {
    document.getElementById('mailTo').value = '';
    document.getElementById('mailSubject').value = '';
    document.getElementById('mailText').value = '';
    document.getElementById('filePreview').innerHTML = '';
    document.getElementById('mailFile').value = '';
}

function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'flex';
    
    // Fill form with current user data
    if (currentUser) {
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
        
        // Select current avatar color
        const currentColor = currentUser.avatarColor || '#667eea';
        document.querySelectorAll('.color-option').forEach(option => {
            if (option.dataset.color === currentColor) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
}

function saveSettings() {
    if (!currentUser) return;
    
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    
    if (!name || !email) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Invalid email format', 'error');
        return;
    }
    
    // Update user
    currentUser.name = name;
    currentUser.email = email;
    
    // Save selected avatar color
    const selectedColor = document.querySelector('.color-option.selected')?.dataset.color;
    if (selectedColor) {
        currentUser.avatarColor = selectedColor;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    updateUI();
    
    // Close modal
    closeModal(document.getElementById('settingsModal'));
    
    showToast('Settings saved successfully!', 'success');
}

function sendEmail() {
    const to = document.getElementById('mailTo').value.trim();
    const subject = document.getElementById('mailSubject').value.trim();
    const body = document.getElementById('mailText').value.trim();
    
    if (!to || !subject) {
        showToast(translations[currentLanguage].missingRecipient, 'error');
        return;
    }
    
    if (!validateEmail(to)) {
        showToast(translations[currentLanguage].invalidEmail, 'error');
        return;
    }
    
    // Create new email
    const newEmail = {
        id: Date.now(),
        from: currentUser ? currentUser.email : 'user@example.com',
        fromName: currentUser ? currentUser.name : 'You',
        to: to,
        subject: subject,
        body: body,
        date: new Date().toISOString(),
        folder: 'sent',
        read: true,
        important: false,
        labels: [],
        attachments: getCurrentAttachments()
    };
    
    // Add to emails array
    emails.push(newEmail);
    saveEmails();
    
    // Close modal and clear form
    closeModal(document.getElementById('composeModal'));
    clearComposeForm();
    
    // Switch to sent folder
    switchFolder('sent');
    
    showToast(translations[currentLanguage].emailSent, 'success');
}

function getCurrentAttachments() {
    // In a real app, this would get actual file data
    // For demo, return sample attachments
    const files = document.getElementById('mailFile').files;
    const attachments = [];
    
    if (files.length > 0) {
        Array.from(files).slice(0, 3).forEach(file => {
            attachments.push({
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type.split('/')[0] === 'image' ? 'image' : file.name.split('.').pop()
            });
        });
    }
    
    return attachments;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function handleFileUpload() {
    const fileInput = document.getElementById('mailFile');
    const preview = document.getElementById('filePreview');
    const files = fileInput.files;
    
    preview.innerHTML = '';
    
    if (files.length > 5) {
        showToast(translations[currentLanguage].maxFiles, 'error');
        fileInput.value = '';
        return;
    }
    
    Array.from(files).forEach((file, index) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showToast(translations[currentLanguage].fileTooLarge, 'error');
            return;
        }
        
        const item = document.createElement('div');
        item.className = 'file-preview-item';
        item.innerHTML = `
            <span>${file.name}</span>
            <span>${formatFileSize(file.size)}</span>
            <button class="remove-file" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        preview.appendChild(item);
    });
    
    // Add event listeners for remove buttons
    preview.querySelectorAll('.remove-file').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFile(index);
        });
    });
}

function removeFile(index) {
    const fileInput = document.getElementById('mailFile');
    const files = Array.from(fileInput.files);
    files.splice(index, 1);
    
    // Create new FileList (simplified for demo)
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
    
    // Update preview
    handleFileUpload();
}

function simulateDownload(filename) {
    // In a real app, this would create a download link
    console.log(`Simulating download of ${filename}`);
}

function openImagePreview(filename, title) {
    document.getElementById('imageTitle').textContent = title;
    document.getElementById('modalImage').src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23667eea"/><text x="200" y="150" text-anchor="middle" fill="white" font-family="Arial" font-size="20">${filename}</text></svg>`;
    document.getElementById('imageModal').style.display = 'flex';
}

// ====================== EMAIL ACTIONS ======================
function deleteCurrentEmail() {
    if (!currentSelectedEmail) {
        showToast('No email selected', 'error');
        return;
    }
    
    if (!confirm(translations[currentLanguage].confirmDelete)) {
        return;
    }
    
    const index = emails.findIndex(e => e.id === currentSelectedEmail);
    if (index !== -1) {
        emails[index].folder = 'trash';
        saveEmails();
        
        currentSelectedEmail = null;
        updateUI();
        
        showToast(translations[currentLanguage].emailDeleted, 'success');
    }
}

function emptyTrash() {
    if (!confirm(translations[currentLanguage].confirmEmptyTrash)) {
        return;
    }
    
    emails = emails.filter(e => e.folder !== 'trash');
    saveEmails();
    
    if (currentFolder === 'trash') {
        switchFolder('trash');
    }
    
    showToast(translations[currentLanguage].trashEmptied, 'success');
}

function toggleSelectAll() {
    const folderEmails = emails.filter(e => e.folder === currentFolder);
    
    if (selectedEmails.size === folderEmails.length) {
        // Deselect all
        selectedEmails.clear();
    } else {
        // Select all
        selectedEmails.clear();
        folderEmails.forEach(email => selectedEmails.add(email.id));
    }
    
    updateUI();
}

function markSelectedAsRead() {
    if (selectedEmails.size === 0) {
        showToast('No emails selected', 'error');
        return;
    }
    
    emails.forEach(email => {
        if (selectedEmails.has(email.id)) {
            email.read = true;
        }
    });
    
    saveEmails();
    updateUI();
    
    showToast(`${selectedEmails.size} emails marked as read`, 'success');
}

function deleteSelectedEmails() {
    if (selectedEmails.size === 0) {
        showToast('No emails selected', 'error');
        return;
    }
    
    if (!confirm(`Delete ${selectedEmails.size} selected emails?`)) {
        return;
    }
    
    emails.forEach(email => {
        if (selectedEmails.has(email.id)) {
            email.folder = 'trash';
        }
    });
    
    saveEmails();
    selectedEmails.clear();
    updateUI();
    
    showToast(`${selectedEmails.size} emails moved to trash`, 'success');
}

function handleSearch() {
    displayEmails();
    
    // Show/hide clear button
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    searchClear.style.display = searchInput.value ? 'block' : 'none';
}

function handleQuickAction(action) {
    switch (action) {
        case 'archive':
            if (selectedEmails.size > 0) {
                // For demo, just mark as read
                markSelectedAsRead();
                showToast('Emails archived', 'success');
            } else {
                showToast('Select emails first', 'info');
            }
            break;
            
        case 'important':
            if (selectedEmails.size > 0) {
                emails.forEach(email => {
                    if (selectedEmails.has(email.id)) {
                        email.important = !email.important;
                    }
                });
                saveEmails();
                updateUI();
                showToast('Emails marked as important', 'success');
            } else {
                showToast('Select emails first', 'info');
            }
            break;
            
        case 'delete':
            if (selectedEmails.size > 0) {
                deleteSelectedEmails();
            } else {
                showToast('Select emails first', 'info');
            }
            break;
    }
}

function toggleStarEmail() {
    if (!currentSelectedEmail) {
        showToast('No email selected', 'error');
        return;
    }
    
    const email = emails.find(e => e.id === currentSelectedEmail);
    if (email) {
        email.important = !email.important;
        saveEmails();
        updateUI();
        
        const action = email.important ? 'starred' : 'unstarred';
        showToast(`Email ${action}`, 'success');
    }
}

// ====================== THEME & LANGUAGE ======================
function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Remove all theme classes
    document.body.classList.remove('light', 'dark', 'oled', 'blue');
    
    // Add new theme class
    if (theme !== 'dark') {
        document.body.classList.add(theme);
    }
    
    // Update theme button icon
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = theme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

function applyLanguage() {
    // Apply to all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Apply to placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(element => {
        const key = element.getAttribute('data-i18n-ph');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
    
    // Update language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLanguage;
    }
}

// ====================== TOAST NOTIFICATIONS ======================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        // Create container if it doesn't exist
        const newContainer = document.createElement('div');
        newContainer.id = 'toastContainer';
        newContainer.className = 'toast-container';
        newContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(newContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: toastIn 0.3s ease;
        max-width: 300px;
        word-break: break-word;
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ====================== START APPLICATION ======================
// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes toastIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes toastOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .file-preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--bg);
        border-radius: 6px;
        margin-bottom: 5px;
        border: 1px solid var(--border);
    }
    
    .remove-file {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
    }
    
    .remove-file:hover {
        color: var(--danger);
    }
    
    .color-option.selected {
        outline: 3px solid white;
        outline-offset: 2px;
    }
    
    .theme-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        background: none;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 15px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .theme-option:hover {
        border-color: var(--accent);
    }
    
    .theme-preview {
        width: 40px;
        height: 40px;
        border-radius: 8px;
    }
    
    .theme-preview.light { background: #f8fafc; border: 1px solid #e2e8f0; }
    .theme-preview.dark { background: #0f1117; border: 1px solid #2d2d3a; }
    .theme-preview.oled { background: #000000; border: 1px solid #222222; }
    .theme-preview.blue { background: #0c4a6e; border: 1px solid #0284c7; }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
