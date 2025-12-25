// storage-service.js

class StorageService {
    constructor() {
        this.prefix = 'inboxpro_';
    }

    // Збереження даних
    set(key, value) {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, data);
            return true;
        } catch (error) {
            console.error('Помилка збереження в localStorage:', error);
            return false;
        }
    }

    // Отримання даних
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Помилка читання з localStorage:', error);
            return defaultValue;
        }
    }

    // Видалення даних
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Помилка видалення з localStorage:', error);
            return false;
        }
    }

    // Очищення всіх даних додатку
    clear() {
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Помилка очищення localStorage:', error);
            return false;
        }
    }

    // Збереження налаштувань користувача
    saveUserSettings(settings) {
        return this.set('user_settings', settings);
    }

    // Отримання налаштувань користувача
    getUserSettings() {
        return this.get('user_settings', {
            theme: 'dark',
            language: 'ua',
            notifications: true,
            autoSave: true,
            fontSize: 'medium',
            density: 'comfortable'
        });
    }

    // Збереження теми
    saveTheme(theme) {
        return this.set('theme', theme);
    }

    // Отримання теми
    getTheme() {
        return this.get('theme', 'dark');
    }

    // Збереження мови
    saveLanguage(language) {
        return this.set('language', language);
    }

    // Отримання мови
    getLanguage() {
        return this.get('language', 'ua');
    }

    // Збереження токена
    saveAuthToken(token) {
        return this.set('auth_token', token);
    }

    // Отримання токена
    getAuthToken() {
        return this.get('auth_token');
    }

    // Видалення токена
    clearAuthToken() {
        return this.remove('auth_token');
    }

    // Збереження часу останньої активності
    saveLastActivity() {
        return this.set('last_activity', new Date().toISOString());
    }

    // Перевірка, чи не закінчилась сесія
    isSessionExpired(timeoutMinutes = 60) {
        const lastActivity = this.get('last_activity');
        if (!lastActivity) return true;
        
        const lastActivityDate = new Date(lastActivity);
        const now = new Date();
        const diffMinutes = (now - lastActivityDate) / (1000 * 60);
        
        return diffMinutes > timeoutMinutes;
    }

    // Збереження draft листа
    saveEmailDraft(draft) {
        return this.set('email_draft', draft);
    }

    // Отримання draft листа
    getEmailDraft() {
        return this.get('email_draft');
    }

    // Очищення draft листа
    clearEmailDraft() {
        return this.remove('email_draft');
    }

    // Збереження історії пошуку
    saveSearchHistory(searchTerm) {
        const history = this.get('search_history', []);
        
        // Додати новий термін на початок
        history.unshift(searchTerm);
        
        // Зберегти тільки останні 10 пошуків
        const limitedHistory = history.slice(0, 10);
        
        return this.set('search_history', limitedHistory);
    }

    // Отримання історії пошуку
    getSearchHistory() {
        return this.get('search_history', []);
    }

    // Очищення історії пошуку
    clearSearchHistory() {
        return this.remove('search_history');
    }
}

// Експорт єдиного екземпляра
export const storageService = new StorageService();
