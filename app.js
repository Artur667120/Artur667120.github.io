// SIMPLE WORKING APP.JS - NO ERRORS
console.log('📦 App.js loading...');

// Email data - ONLY ONE DECLARATION
const emails = [
    { id: 1, avatar: 'JD', sender: 'John Doe', time: '10:30 AM', subject: 'Welcome to Inbox Pro!', preview: 'Thank you for choosing our email client...', unread: true, starred: false },
    { id: 2, avatar: 'AS', sender: 'Alex Smith', time: 'Yesterday', subject: 'Meeting Notes', preview: 'Here are the meeting notes...', unread: false, starred: false },
    { id: 3, avatar: 'MC', sender: 'Maria Chen', time: '2 days ago', subject: 'Travel Plans', preview: 'Booked flights for Berlin...', unread: false, starred: true }
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM ready');
    
    // Load emails
    loadEmails();
    
    // Setup buttons
    setupButtons();
    
    console.log('🎯 App ready');
});

// Load emails into the list
function loadEmails() {
    const emailList = document.getElementById('emailList');
    if (!emailList) return;
    
    emailList.innerHTML = '';
    
    emails.forEach(email => {
        const emailElement = document.createElement('div');
        emailElement.className = 'email-item' + (email.unread ? ' unread' : '') + (email.starred ? ' starred' : '');
        emailElement.dataset.id = email.id;
        
        emailElement.innerHTML = `
            <div class="email-avatar">${email.avatar}</div>
            <div class="email-details">
                <div class="email-header">
                    <span class="email-sender">${email.sender}</span>
                    <span class="email-time">${email.time}</span>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
            </div>
            <div class="email-actions">
                <button class="email-action star-btn">${email.starred ? '★' : '☆'}</button>
            </div>
        `;
        
        emailList.appendChild(emailElement);
    });
}

// Setup all button events
function setupButtons() {
    // Compose button
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) {
        composeBtn.addEventListener('click', function() {
            showMessage('📝 Compose email');
        });
    }
    
    // Menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        });
    }
    
    // Email click to open viewer
    document.addEventListener('click', function(event) {
        const emailItem = event.target.closest('.email-item');
        if (emailItem && !event.target.classList.contains('star-btn')) {
            openEmailViewer(emailItem.dataset.id);
        }
    });
    
    // Star buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('star-btn')) {
            event.stopPropagation();
            const starBtn = event.target;
            const isStarred = starBtn.textContent === '★';
            starBtn.textContent = isStarred ? '☆' : '★';
            
            // Update email data
            const emailId = parseInt(event.target.closest('.email-item').dataset.id);
            const email = emails.find(e => e.id === emailId);
            if (email) {
                email.starred = !isStarred;
            }
            
            showMessage(isStarred ? 'Email unstarred' : 'Email starred');
        }
    });
    
    // Reply button
    const replyBtn = document.getElementById('replyBtn');
    if (replyBtn) {
        replyBtn.addEventListener('click', function() {
            showMessage('📧 Reply to email');
        });
    }
    
    // Forward button
    const forwardBtn = document.getElementById('forwardBtn');
    if (forwardBtn) {
        forwardBtn.addEventListener('click', function() {
            showMessage('📧 Forward email');
        });
    }
    
    // Search input
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            if (e.target.value.length > 2) {
                showMessage(`Searching: ${e.target.value}`);
            }
        });
    }
    
    // Folder navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            showMessage(`Folder: ${this.querySelector('.nav-text').textContent}`);
        });
    });
}

// Open email in fullscreen viewer
function openEmailViewer(emailId) {
    const email = emails.find(e => e.id == emailId);
    if (!email) return;
    
    // Update viewer content
    document.getElementById('viewerSubject').textContent = email.subject;
    document.getElementById('senderName').textContent = email.sender;
    document.getElementById('senderEmail').textContent = email.sender.toLowerCase().replace(' ', '.') + '@example.com';
    document.getElementById('senderTime').textContent = email.time;
    document.getElementById('senderAvatar').textContent = email.avatar;
    
    // Create email body
    const body = document.getElementById('viewerBody');
    body.innerHTML = `
        <p>Hello,</p>
        <p>This is the content of the email from ${email.sender} about "${email.subject}".</p>
        <p>In a real app, this would show the actual email content.</p>
        <p>Best regards,<br>${email.sender}</p>
    `;
    
    // Show viewer
    document.getElementById('emailViewer').classList.remove('hidden');
    
    showMessage('📨 Email opened');
}

// Show message/toast
function showMessage(text) {
    console.log('💬 ' + text);
    
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast info';
    toast.textContent = text;
    container.appendChild(toast);
    
    setTimeout(function() {
        toast.remove();
    }, 2000);
}

console.log('🚀 App.js loaded without errors');
