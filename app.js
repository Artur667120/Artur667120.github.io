// Simple app.js - Working version
console.log('📦 app.js loaded');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, setting up app...');
    
    // Simple email click handler
    const emailItems = document.querySelectorAll('.email-item');
    emailItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox' && !e.target.closest('.email-action')) {
                console.log('📧 Email clicked');
                alert('Email opened! In full version this would show email details.');
            }
        });
        
        // Star button
        const starBtn = item.querySelector('.star-btn');
        if (starBtn) {
            starBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = this.classList.toggle('active');
                this.textContent = isActive ? '★' : '☆';
                console.log('⭐ Email starred:', isActive);
            });
        }
    });
    
    // Compose button
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) {
        composeBtn.addEventListener('click', function() {
            console.log('📝 Compose clicked');
            alert('Compose modal would open here in full version.');
        });
    }
    
    // AI Compose button
    const aiComposeBtn = document.getElementById('aiComposeBtn');
    if (aiComposeBtn) {
        aiComposeBtn.addEventListener('click', function() {
            console.log('🤖 AI Compose clicked');
            alert('AI compose modal would open here in full version.');
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.contains('dark-theme');
            document.body.className = isDark ? 'light-theme' : 'dark-theme';
            console.log('🎨 Theme toggled to:', isDark ? 'light' : 'dark');
        });
    }
    
    console.log('✅ All event listeners set up');
});

// Global functions
window.showSimpleToast = function(message, type = 'info') {
    console.log('💬 Toast:', message);
    
    // Create simple alert for now
    const types = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    alert(`${types[type] || 'ℹ️'} ${message}`);
};

console.log('🚀 app.js ready');
