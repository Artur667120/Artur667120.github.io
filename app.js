// app.js - простоїший запуск
console.log('🚀 Inbox Pro запускається...');

// Швидке виправлення без Firebase для тесту
const mockAuth = {
    onAuthStateChanged: (callback) => {
        // Імітація затримки аутентифікації
        setTimeout(() => {
            const user = null; // По замовчуванню ніхто не залогінений
            callback(user);
        }, 1000);
    },
    
    login: async (email, password) => {
        console.log('Mock login with:', email);
        return { uid: 'mock-user', email, displayName: 'Test User' };
    },
    
    register: async (email, password, name) => {
        console.log('Mock register:', email, name);
        return { uid: 'mock-user', email, displayName: name };
    },
    
    logout: async () => {
        console.log('Mock logout');
    },
    
    resetPassword: async (email) => {
        console.log('Mock reset password for:', email);
    }
};

// Основні функції
function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('initialLoading');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">✕</button>
    `;
    
    toastContainer.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function setupTheme() {
    const savedTheme = localStorage.getItem('inboxpro-theme') || 'dark';
    document.body.className = savedTheme + '-theme';
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeOptions = document.getElementById('themeOptions');
    
    if (themeToggle && themeOptions) {
        themeToggle.addEventListener('click', () => {
            themeOptions.classList.toggle('show');
        });
        
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.body.className = theme + '-theme';
                localStorage.setItem('inboxpro-theme', theme);
                themeOptions.classList.remove('show');
                showToast(`Theme changed to ${theme}`, 'info');
            });
        });
    }
}

function setupAuthForms() {
    // Form switching
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    
    if (showRegisterBtn && loginForm && registerForm) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            resetForm.classList.remove('active');
        });
    }
    
    if (showLoginBtn && registerForm && loginForm) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            resetForm.classList.remove('active');
        });
    }
    
    if (forgotPasswordBtn && loginForm && resetForm) {
        forgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.remove('active');
            resetForm.classList.add('active');
        });
    }
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value;
            
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            try {
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<span class="btn-text">Signing in...</span><span class="btn-icon">⏳</span>';
                
                const user = await mockAuth.login(email, password);
                showToast('Login successful!', 'success');
                
                // Show main app
                showMainApp(user);
            } catch (error) {
                showToast('Login failed', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span class="btn-text">Sign In</span><span class="btn-icon">→</span>';
            }
        });
    }
    
    // Register button
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const name = document.getElementById('registerName')?.value.trim();
            const email = document.getElementById('registerEmail')?.value.trim();
            const password = document.getElementById('registerPassword')?.value;
            const confirm = document.getElementById('registerConfirm')?.value;
            
            if (!name || !email || !password || !confirm) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirm) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showToast('Password must be at least 8 characters', 'error');
                return;
            }
            
            try {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<span class="btn-text">Creating account...</span><span class="btn-icon">⏳</span>';
                
                const user = await mockAuth.register(email, password, name);
                showToast('Account created!', 'success');
                
                // Show main app
                showMainApp(user);
            } catch (error) {
                showToast('Registration failed', 'error');
                registerBtn.disabled = false;
                registerBtn.innerHTML = '<span class="btn-text">Create Account</span><span class="btn-icon">✓</span>';
            }
        });
    }
    
    // Reset password
    const sendResetBtn = document.getElementById('sendResetBtn');
    if (sendResetBtn) {
        sendResetBtn.addEventListener('click', async () => {
            const email = document.getElementById('resetEmail')?.value.trim();
            
            if (!email) {
                showToast('Please enter your email', 'error');
                return;
            }
            
            try {
                sendResetBtn.disabled = true;
                sendResetBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon">⏳</span>';
                
                await mockAuth.resetPassword(email);
                showToast('Reset link sent!', 'success');
                
                // Switch back to login
                resetForm.classList.remove('active');
                loginForm.classList.add('active');
            } catch (error) {
                showToast('Failed to send reset link', 'error');
                sendResetBtn.disabled = false;
                sendResetBtn.innerHTML = '<span class="btn-text">Send Reset Link</span><span class="btn-icon">✈️</span>';
            }
        });
    }
}

function showMainApp(user) {
    const loginScreen = document.getElementById('loginScreen');
    const app = document.getElementById('app');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (app) {
        app.style.display = 'flex';
        setTimeout(() => {
            app.style.opacity = '1';
        }, 10);
    }
    
    // Update user info
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement) userNameElement.textContent = user.displayName || 'User';
    if (userEmailElement) userEmailElement.textContent = user.email || '';
    if (userAvatarElement) userAvatarElement.textContent = (user.displayName || 'US').substring(0, 2).toUpperCase();
}

function setupCompose() {
    const composeBtn = document.getElementById('composeBtn');
    const composeModal = document.getElementById('composeModal');
    const closeCompose = document.getElementById('closeCompose');
    const sendMailBtn = document.getElementById('sendMail');
    
    if (composeBtn && composeModal) {
        composeBtn.addEventListener('click', () => {
            composeModal.classList.remove('hidden');
        });
    }
    
    if (closeCompose && composeModal) {
        closeCompose.addEventListener('click', () => {
            composeModal.classList.add('hidden');
        });
    }
    
    if (sendMailBtn) {
        sendMailBtn.addEventListener('click', () => {
            const to = document.getElementById('mailTo')?.value.trim();
            const subject = document.getElementById('mailSubject')?.value.trim();
            const text = document.getElementById('mailText')?.value.trim();
            
            if (!to || !subject || !text) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            showToast(`Email sent to ${to}`, 'success');
            composeModal.classList.add('hidden');
            
            // Clear form
            document.getElementById('mailTo').value = '';
            document.getElementById('mailSubject').value = '';
            document.getElementById('mailText').value = '';
        });
    }
}

// Initialize everything
function initApp() {
    console.log('✅ Initializing Inbox Pro...');
    
    // Hide loading screen after 1.5 seconds
    setTimeout(hideLoadingScreen, 1500);
    
    // Setup theme
    setupTheme();
    
    // Setup auth forms
    setupAuthForms();
    
    // Setup compose
    setupCompose();
    
    // Setup auth state listener
    mockAuth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is logged in:', user.email);
            showMainApp(user);
        } else {
            console.log('User is not logged in');
        }
    });
    
    // Setup sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    console.log('✅ Inbox Pro готовий!');
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
