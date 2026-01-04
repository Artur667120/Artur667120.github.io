// Додамо до існуючого JavaScript

// ===== УЛУЧШЕННЯ ФУНКЦІОНАЛЬНОСТІ =====

// Функція для пошуку email
function searchEmails(query) {
    const t = TRANSLATIONS[currentLang];
    if (query.length < 2) {
        if (query.length === 0) {
            renderEmails();
        }
        return;
    }
    
    const filtered = emails.filter(email => 
        email.sender.toLowerCase().includes(query.toLowerCase()) ||
        email.subject.toLowerCase().includes(query.toLowerCase()) ||
        email.preview.toLowerCase().includes(query.toLowerCase()) ||
        email.body.toLowerCase().includes(query.toLowerCase())
    );
    
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    
    if (filtered.length === 0) {
        emailList.innerHTML = `
            <div class="no-results">
                <div style="text-align: center; padding: 60px 20px; color: #94a3b8;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                    <h3 style="margin-bottom: 10px;">No results found</h3>
                    <p>No emails match "${query}"</p>
                </div>
            </div>
        `;
        showToast(`No results for "${query}"`, 'info');
        return;
    }
    
    // Рендерим знайдені emails
    filtered.forEach(email => {
        // (використовуємо той же код рендерингу, що й у renderEmails)
        const emailElement = document.createElement('div');
        emailElement.className = `email-item ${email.unread ? 'unread' : ''} ${email.important ? 'important' : ''}`;
        emailElement.dataset.id = email.id;
        
        let labelsHTML = '';
        if (email.labels && email.labels.length > 0) {
            email.labels.forEach(label => {
                labelsHTML += `<span class="email-tag ${label}">${getLabelIcon(label)} ${getLabelName(label)}</span>`;
            });
        }
        if (email.attachments && email.attachments.length > 0) {
            labelsHTML += `<span class="email-tag">📎 ${email.attachments.length} attachment${email.attachments.length > 1 ? 's' : ''}</span>`;
        }
        
        emailElement.innerHTML = `
            <div class="email-checkbox">
                <input type="checkbox" class="email-select" data-id="${email.id}">
            </div>
            <div class="email-avatar">${email.avatar}</div>
            <div class="email-details">
                <div class="email-header">
                    <span class="email-sender">${email.sender}</span>
                    <span class="email-time">${email.time}</span>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
                ${labelsHTML ? `<div class="email-tags">${labelsHTML}</div>` : ''}
            </div>
            <div class="email-actions">
                <button class="email-action star-btn ${email.starred ? 'active' : ''}">
                    ${email.starred ? '★' : '☆'}
                </button>
                <button class="email-action archive-btn" title="Archive">
                    📁
                </button>
            </div>
        `;
        
        emailList.appendChild(emailElement);
    });
    
    showToast(`Found ${filtered.length} emails for "${query}"`, 'success');
}

// Функція сортування email
function sortEmails(sortBy) {
    let sortedEmails = [...emails];
    
    switch(sortBy) {
        case 'newest':
            // Сортуємо за часом (в даному прикладі за id, оскільки немає timestamp)
            sortedEmails.sort((a, b) => b.id - a.id);
            break;
        case 'oldest':
            sortedEmails.sort((a, b) => a.id - b.id);
            break;
        case 'important':
            sortedEmails.sort((a, b) => (b.important === a.important) ? 0 : b.important ? -1 : 1);
            break;
        case 'unread':
            sortedEmails.sort((a, b) => (b.unread === a.unread) ? 0 : b.unread ? -1 : 1);
            break;
    }
    
    // Оновлюємо відображення
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    
    // Фільтруємо за поточною папкою
    let filteredEmails = sortedEmails;
    if (currentFolder !== 'all') {
        filteredEmails = sortedEmails.filter(email => email.folder === currentFolder);
    }
    
    // Рендерим відсортовані emails
    filteredEmails.forEach(email => {
        const emailElement = document.createElement('div');
        emailElement.className = `email-item ${email.unread ? 'unread' : ''} ${email.important ? 'important' : ''}`;
        emailElement.dataset.id = email.id;
        
        let labelsHTML = '';
        if (email.labels && email.labels.length > 0) {
            email.labels.forEach(label => {
                labelsHTML += `<span class="email-tag ${label}">${getLabelIcon(label)} ${getLabelName(label)}</span>`;
            });
        }
        if (email.attachments && email.attachments.length > 0) {
            labelsHTML += `<span class="email-tag">📎 ${email.attachments.length} attachment${email.attachments.length > 1 ? 's' : ''}</span>`;
        }
        
        emailElement.innerHTML = `
            <div class="email-checkbox">
                <input type="checkbox" class="email-select" data-id="${email.id}">
            </div>
            <div class="email-avatar">${email.avatar}</div>
            <div class="email-details">
                <div class="email-header">
                    <span class="email-sender">${email.sender}</span>
                    <span class="email-time">${email.time}</span>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
                ${labelsHTML ? `<div class="email-tags">${labelsHTML}</div>` : ''}
            </div>
            <div class="email-actions">
                <button class="email-action star-btn ${email.starred ? 'active' : ''}">
                    ${email.starred ? '★' : '☆'}
                </button>
                <button class="email-action archive-btn" title="Archive">
                    📁
                </button>
            </div>
        `;
        
        emailList.appendChild(emailElement);
    });
}

// ===== ОНОВЛЕННЯ EVENT LISTENERS =====

// Додаємо до існуючої функції setupEventListeners:

// Пошук в реальному часі
document.getElementById('searchInput').addEventListener('input', function(e) {
    searchEmails(e.target.value);
});

// Сортування при зміні select
document.getElementById('sortSelect').addEventListener('change', function(e) {
    sortEmails(e.target.value);
    const t = TRANSLATIONS[currentLang];
    const optionText = e.target.options[e.target.selectedIndex].text;
    showToast(`Sorted: ${optionText}`, 'info');
});

// Кнопка "Select All" - оновлена версія
document.getElementById('selectAllBtn').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.email-select:not(:disabled)');
    const allSelected = Array.from(checkboxes).every(cb => cb.checked);
    const t = TRANSLATIONS[currentLang];
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allSelected;
        const emailId = parseInt(checkbox.dataset.id);
        
        if (!allSelected) {
            selectedEmails.add(emailId);
        } else {
            selectedEmails.delete(emailId);
        }
    });
    
    updateSelectionUI();
    
    showToast(!allSelected ? 
        `${checkboxes.length} emails selected` : 
        'Selection cleared', 
    'info');
});

// Кнопка "Mark as Read" - оновлена версія
document.getElementById('markReadBtn').addEventListener('click', function() {
    if (selectedEmails.size === 0) {
        showToast('Please select emails first', 'warning');
        return;
    }
    
    selectedEmails.forEach(emailId => {
        const email = emails.find(e => e.id === emailId);
        if (email) {
            email.unread = false;
            const emailItem = document.querySelector(`.email-item[data-id="${emailId}"]`);
            if (emailItem) {
                emailItem.classList.remove('unread');
                // Додаємо анімацію
                emailItem.style.animation = 'highlight 0.5s ease';
            }
        }
    });
    
    const t = TRANSLATIONS[currentLang];
    showToast(`${selectedEmails.size} email${selectedEmails.size > 1 ? 's' : ''} marked as read`, 'success');
    
    // Анімація highlight
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlight {
            0% { background-color: rgba(59, 130, 246, 0.2); }
            100% { background-color: transparent; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.querySelectorAll('.email-item').forEach(item => {
            item.style.animation = '';
        });
    }, 500);
    
    selectedEmails.clear();
    updateSelectionUI();
});

// Кнопка "Archive" - оновлена версія
document.getElementById('archiveBtn').addEventListener('click', function() {
    if (selectedEmails.size === 0) {
        showToast('Please select emails to archive', 'warning');
        return;
    }
    
    if (confirm(`Archive ${selectedEmails.size} email${selectedEmails.size > 1 ? 's' : ''}?`)) {
        selectedEmails.forEach(emailId => {
            const email = emails.find(e => e.id === emailId);
            if (email) {
                email.folder = 'archive';
                const emailItem = document.querySelector(`.email-item[data-id="${emailId}"]`);
                if (emailItem) {
                    emailItem.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => {
                        emailItem.remove();
                    }, 300);
                }
            }
        });
        
        const t = TRANSLATIONS[currentLang];
        showToast(`${selectedEmails.size} email${selectedEmails.size > 1 ? 's' : ''} archived`, 'success');
        selectedEmails.clear();
        updateSelectionUI();
    }
});

// Кнопка "Delete" - оновлена версія
document.getElementById('deleteBtn').addEventListener('click', function() {
    if (selectedEmails.size === 0) {
        showToast('Please select emails to delete', 'warning');
        return;
    }
    
    if (confirm(`Permanently delete ${selectedEmails.size} email${selectedEmails.size > 1 ? 's' : ''}? This action cannot be undone.`)) {
        const emailsToDelete = [...selectedEmails];
        
        emailsToDelete.forEach(emailId => {
            const emailIndex = emails.findIndex(e => e.id === emailId);
            if (emailIndex > -1) {
                const emailItem = document.querySelector(`.email-item[data-id="${emailId}"]`);
                if (emailItem) {
                    emailItem.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => {
                        emails.splice(emailIndex, 1);
                        emailItem.remove();
                    }, 300);
                }
            }
        });
        
        showToast(`${selectedEmails.size} email${selectedEmails.size > 1 ? 's' : ''} deleted`, 'success');
        selectedEmails.clear();
        updateSelectionUI();
    }
});

// ===== ДОДАЄМО ДОДАТКОВІ CSS АНІМАЦІЇ =====
const additionalStyles = `
    /* Анімація для видалення */
    @keyframes slideOut {
        from { 
            transform: translateX(0); 
            opacity: 1; 
            max-height: 200px;
        }
        to { 
            transform: translateX(-100%); 
            opacity: 0; 
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin: 0;
        }
    }
    
    /* Анімація для нових повідомлень */
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    /* Анімація для натискання кнопок */
    @keyframes buttonClick {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }
    
    .button-click-animation {
        animation: buttonClick 0.2s ease;
    }
    
    /* Стиль для пустого стану */
    .no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        color: #94a3b8;
        text-align: center;
    }
    
    .no-results-icon {
        font-size: 64px;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    /* Покращений скроллбар */
    .email-list::-webkit-scrollbar {
        width: 8px;
    }
    
    .email-list::-webkit-scrollbar-track {
        background: rgba(30, 41, 59, 0.5);
        border-radius: 4px;
    }
    
    .email-list::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 4px;
    }
    
    .email-list::-webkit-scrollbar-thumb:hover {
        background: #3b82f6;
    }
    
    .light-theme .email-list::-webkit-scrollbar-track {
        background: rgba(226, 232, 240, 0.5);
    }
    
    .light-theme .email-list::-webkit-scrollbar-thumb {
        background: #cbd5e1;
    }
    
    .light-theme .email-list::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
`;

// Додаємо стилі до документа
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== ФУНКЦІЯ ДЛЯ ОНОВЛЕННЯ UI ПРИ ВИБОРІ =====
function updateSelectionUI() {
    const selectAllBtn = document.getElementById('selectAllBtn');
    const markReadBtn = document.getElementById('markReadBtn');
    const archiveBtn = document.getElementById('archiveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const t = TRANSLATIONS[currentLang];
    
    if (selectedEmails.size > 0) {
        selectAllBtn.innerHTML = `<span class="btn-icon">☑️</span><span class="btn-text">${selectedEmails.size} selected</span>`;
        
        // Додаємо клас для анімації
        [markReadBtn, archiveBtn, deleteBtn].forEach(btn => {
            btn.classList.add('button-click-animation');
            setTimeout(() => btn.classList.remove('button-click-animation'), 200);
        });
    } else {
        selectAllBtn.innerHTML = `<span class="btn-icon">☑️</span><span class="btn-text">${t.selectAll}</span>`;
    }
    
    // Оновлюємо стан кнопок
    const hasSelection = selectedEmails.size > 0;
    [markReadBtn, archiveBtn, deleteBtn].forEach(btn => {
        btn.style.opacity = hasSelection ? '1' : '0.6';
        btn.style.cursor = hasSelection ? 'pointer' : 'not-allowed';
    });
}

console.log('🎯 Enhanced UI/UX and functionality loaded');
