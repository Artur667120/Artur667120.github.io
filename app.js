// Simple working app.js with enhanced features
console.log('✅ Inbox Pro starting...');

// Email data
const emails = [
    {
        id: 1,
        avatar: 'JD',
        sender: 'John Doe',
        time: '10:30 AM',
        subject: 'Welcome to Inbox Pro!',
        preview: 'Thank you for choosing our AI-powered email client...',
        unread: true,
        important: false,
        starred: false
    },
    {
        id: 2,
        avatar: 'AS',
        sender: 'Alex Smith',
        time: 'Yesterday',
        subject: 'Meeting Notes & Project Updates',
        preview: 'Here are the meeting notes from our last session...',
        unread: false,
        important: true,
        starred: false
    },
    {
        id: 3,
        avatar: 'MC',
        sender: 'Maria Chen',
        time: '2 days ago',
        subject: 'Travel Plans for Conference',
        preview: 'I\'ve booked the flights and hotel for Berlin...',
        unread: false,
        important: false,
        starred: true
    },
    {
        id: 4,
        avatar: 'TB',
        sender: 'Tech Blog',
        time: '3 days ago',
        subject: 'Weekly Tech News Digest',
        preview: 'AI breakthroughs, new frameworks, and industry trends...',
        unread: true,
        important: false,
        starred: false
    },
    {
        id: 5,
        avatar: 'SC',
        sender: 'Security Team',
        time: '1 week ago',
        subject: 'Security Update Required',
        preview: 'Please update your password following security guidelines...',
        unread: true,
        important: true,
        starred: true
    }
];

// Initialize when page loads
window.addEventListener('load', function() {
    console.log('📦 Page loaded, initializing app...');
    
    // Initialize email list
    renderEmailList();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('🎯 App initialized successfully');
});

// Render email list
function renderEmailList() {
    const emailList = document.querySelector('.email-list');
    if (!emailList) return;
    
    // Clear existing emails
    emailList.innerHTML = '';
    
    // Add each email
    emails.forEach(email => {
        const emailItem = document.createElement('div');
        emailItem.className = `email-item ${email.unread ? 'unread' : ''} ${email.important ? 'important' : ''}`;
        emailItem.dataset.emailId = email.id;
        
        emailItem.innerHTML = `
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
                <button class="email-action star-btn ${email.starred ? 'active' : ''}">
                    ${email.starred ? '★' : '☆'}
                </button>
            </div>
        `;
        
        emailList.appendChild(emailItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Star buttons (delegated event handling)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('star-btn')) {
            e.stopPropagation();
            const isActive = e.target.classList.toggle('active');
            e.target.textContent = isActive ? '★' : '☆';
            
            // Update email data
            const emailId = parseInt(e.target.closest('.email-item').dataset.emailId);
            const email = emails.find(e => e.id === emailId);
            if (email) {
                email.starred = isActive;
            }
            
            showToast(isActive ? 'Email starred!' : 'Email unstarred', 'info');
        }
    });
    
    // Email click to open viewer (already handled in main script)
    // Compose button
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) {
        composeBtn.addEventListener('click', function() {
            showToast('📝 Compose email feature coming soon!', 'info');
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
    
    // Search input
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 0) {
                showToast(`Searching for: ${searchTerm}`, 'info');
            }
        });
    }
    
    // Folder navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const folder = this.querySelector('.nav-text').textContent;
            showToast(`Switched to: ${folder}`, 'info');
        });
    });
}

// Show toast notification
function showToast(text, type = 'info') {
    console.log(`💬 ${text}`);
    
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = text;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Export functions for global use
window.InboxPro = {
    renderEmailList,
    showToast,
    emails
};

console.log('🚀 app.js loaded with enhanced features');
