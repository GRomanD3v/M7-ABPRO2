// src/stores/notification.js
import { defineStore } from "pinia";

export const useNotificationStore = defineStore('notification', {
state: () => ({
        // null, 'success', 'error', 'info'
        type: null, 
        message: '',
        isVisible: false,
    }),
    actions: {
        showNotification({ type, message }) {
            this.type = type;
            this.message = message;
            this.isVisible = true;

            // Ocultar automáticamente después de 4 segundos
            setTimeout(() => {
                this.hideNotification();
            }, 4000);
        },
        hideNotification() {
            this.isVisible = false;
            this.type = null;
            this.message = '';
        }
    }
});
