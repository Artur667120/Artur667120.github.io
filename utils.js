// utils.js

// Форматування дати
export function formatDate(dateString) {
    if (!dateString) return 'Невідомо';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return 'щойно';
    } else if (diffMins < 60) {
        return `${diffMins} хв тому`;
    } else if (diffHours < 24) {
        return `${diffHours} год тому`;
    } else if (diffDays < 7) {
        return `${diffDays} дн тому`;
    } else {
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
}

// Склонювання слів
export function pluralize(number, one, few, many) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return one;
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return few;
    } else {
        return many;
    }
}

// Валідація email
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валідація пароля
export function validatePassword(password) {
    return password.length >= 6;
}

// Перевірка сили пароля
export function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return {
        score: strength,
        level: strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong'
    };
}

// Генерація випадкового кольору для аватара
export function generateAvatarColor(name) {
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#fa709a', '#fee140', '#30cfd0', '#330867'
    ];
    
    const hash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
}

// Форматування розміру файлу
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Дебаунс для оптимізації
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Тротлінг
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Безпечне отримання властивості об'єкта
export function getSafe(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }
    
    return result !== undefined ? result : defaultValue;
}

// Копіювання в буфер обміну
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return { success: true };
    } catch (error) {
        console.error('Помилка копіювання:', error);
        return { success: false, error: error.message };
    }
}

// Генерація унікального ID
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Перевірка підтримки браузера
export function checkBrowserSupport() {
    const features = {
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        notifications: 'Notification' in window,
        clipboard: 'clipboard' in navigator,
        geolocation: 'geolocation' in navigator
    };
    
    return features;
}
