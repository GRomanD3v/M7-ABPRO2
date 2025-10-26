<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '../stores/notification';

const notificationStore = useNotificationStore();
const { type, message, isVisible } = storeToRefs(notificationStore);

// Determina las clases de color del Toast
const toastClass = computed(() => {
    switch (type.value) {
        case 'success':
            return 'bg-success text-white';
        case 'error':
            return 'bg-danger text-white';
        case 'info':
            return 'bg-info text-white';
        default:
            return 'bg-secondary text-white';
    }
});

// Determina el ícono a mostrar
const iconClass = computed(() => {
    switch (type.value) {
        case 'success':
            return 'bi bi-check-circle-fill';
        case 'error':
            return 'bi bi-x-octagon-fill';
        case 'info':
            return 'bi bi-info-circle-fill';
        default:
            return 'bi bi-bell-fill';
    }
});

</script>

<template>
    <div class="toast-container position-fixed top-0 end-0 p-3">
        <div 
            id="liveToast" 
            :class="['toast show border-0', toastClass]" 
            role="alert" 
            aria-live="assertive" 
            aria-atomic="true"
            v-if="isVisible"
        >
            <div class="d-flex align-items-center p-2">
                <i :class="[iconClass, 'fs-5 me-2']"></i>
                <div class="toast-body fw-semibold p-0 flex-grow-1">
                    {{ message }}
                </div>
                <button 
                    type="button" 
                    class="btn-close btn-close-white me-2 m-auto" 
                    aria-label="Close"
                    @click="notificationStore.hideNotification()"
                ></button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Asegura que el toast siempre esté en la parte superior del resto del contenido */
.toast-container {
    z-index: 2000; 
}
</style>