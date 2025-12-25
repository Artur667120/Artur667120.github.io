// email-service.js

import { db } from './firebase-config.js';
import { 
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

class EmailService {
    constructor() {
        this.unsubscribe = null;
        this.emails = [];
        this.listeners = [];
    }

    // Створення нового листа
    async createEmail(emailData, userId) {
        try {
            const email = {
                ...emailData,
                userId: userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                read: false,
                important: emailData.important || false,
                starred: false,
                labels: emailData.labels || [],
                attachments: emailData.attachments || []
            };

            const docRef = await addDoc(collection(db, "emails"), email);
            
            // Оновлення статистики сховища
            await this.updateStorageUsage(userId, email);
            
            return { success: true, id: docRef.id, email };
        } catch (error) {
            console.error('Помилка створення листа:', error);
            return { success: false, error: error.message };
        }
    }

    // Оновлення листа
    async updateEmail(emailId, updates) {
        try {
            await updateDoc(doc(db, "emails", emailId), {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Помилка оновлення листа:', error);
            return { success: false, error: error.message };
        }
    }

    // Видалення листа
    async deleteEmail(emailId) {
        try {
            await deleteDoc(doc(db, "emails", emailId));
            return { success: true };
        } catch (error) {
            console.error('Помилка видалення листа:', error);
            return { success: false, error: error.message };
        }
    }

    // Отримання листів користувача
    async getUserEmails(userId, folder = 'inbox', limitCount = 50) {
        try {
            const q = query(
                collection(db, "emails"),
                where("userId", "==", userId),
                where("folder", "==", folder),
                orderBy("createdAt", "desc"),
                limit(limitCount)
            );
            
            const querySnapshot = await getDocs(q);
            const emails = [];
            
            querySnapshot.forEach((doc) => {
                emails.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, emails };
        } catch (error) {
            console.error('Помилка отримання листів:', error);
            return { success: false, error: error.message };
        }
    }

    // Слухач реального часу для листів
    setupRealtimeListener(userId, folder = 'inbox', limitCount = 50) {
        // Зупинити попередній слухач
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        const q = query(
            collection(db, "emails"),
            where("userId", "==", userId),
            where("folder", "==", folder),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            const emails = [];
            snapshot.forEach((doc) => {
                emails.push({ id: doc.id, ...doc.data() });
            });
            
            this.emails = emails;
            this.notifyListeners(emails);
        }, (error) => {
            console.error('Помилка слухача реального часу:', error);
        });
    }

    // Зупинити слухач реального часу
    stopRealtimeListener() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    // Оновлення використання сховища
    async updateStorageUsage(userId, email) {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                const currentStorage = userDoc.data().storageUsed || 0;
                const emailSize = JSON.stringify(email).length;
                
                await updateDoc(userRef, {
                    storageUsed: currentStorage + emailSize,
                    updatedAt: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Помилка оновлення сховища:', error);
        }
    }

    // Додавання слухача зміни листів
    addEmailListener(callback) {
        this.listeners.push(callback);
    }

    // Сповіщення слухачів
    notifyListeners(emails) {
        this.listeners.forEach(callback => {
            callback(emails);
        });
    }

    // Отримання всіх листів
    getEmails() {
        return this.emails;
    }

    // Пошук листів
    async searchEmails(userId, searchTerm) {
        try {
            // Це спрощена версія пошуку
            // В реальному додатку потрібно використовувати Algolia або Cloud Search
            const allEmails = await this.getUserEmails(userId, 'all', 100);
            
            if (!allEmails.success) return allEmails;
            
            const searchResults = allEmails.emails.filter(email => {
                const searchableText = `
                    ${email.subject || ''}
                    ${email.body || ''}
                    ${email.from || ''}
                    ${email.to || ''}
                `.toLowerCase();
                
                return searchableText.includes(searchTerm.toLowerCase());
            });
            
            return { success: true, emails: searchResults };
        } catch (error) {
            console.error('Помилка пошуку:', error);
            return { success: false, error: error.message };
        }
    }

    // Отримання статистики
    async getEmailStats(userId) {
        try {
            const inboxQuery = query(
                collection(db, "emails"),
                where("userId", "==", userId),
                where("folder", "==", "inbox")
            );
            
            const importantQuery = query(
                collection(db, "emails"),
                where("userId", "==", userId),
                where("important", "==", true)
            );
            
            const [inboxSnapshot, importantSnapshot] = await Promise.all([
                getCountFromServer(inboxQuery),
                getCountFromServer(importantQuery)
            ]);
            
            return {
                success: true,
                stats: {
                    totalInbox: inboxSnapshot.data().count,
                    important: importantSnapshot.data().count,
                    unread: 0 // Потрібно додаткове фільтрування
                }
            };
        } catch (error) {
            console.error('Помилка отримання статистики:', error);
            return { success: false, error: error.message };
        }
    }
}

// Експорт єдиного екземпляра
export const emailService = new EmailService();
