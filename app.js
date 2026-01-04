// Simple working app.js
console.log('✅ Inbox Pro starting...');

// Wait for page to load
window.addEventListener('load', function() {
    console.log('📦 Page loaded');
    
    // Email star buttons
    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            this.textContent = this.classList.contains('active') ? '★' : '☆';
            showMessage('Email starred!');
        });
    });
    
    // Compose button
    document.getElementById('composeBtn')?.addEventListener('click', function() {
        showMessage('Compose email (feature coming soon!)');
    });
    
    // Email click
    document.querySelectorAll('.email-item').forEach(item => {
        item.addEventListener('click', function() {
            showMessage('Opening email...');
        });
    });
    
    // Menu toggle
    document.querySelector('.menu-toggle')?.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
    console.log('🎯 All features ready');
});

function showMessage(text) {
    console.log('💬 ' + text);
    
    // Create simple toast
    const toast = document.createElement('div');
    toast.className = 'toast info';
    toast.textContent = text;
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

console.log('🚀 app.js loaded');
