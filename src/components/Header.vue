<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute(); // Inicializar useRoute

// Importamos las propiedades reactivas del store de autenticación, incluyendo 'isAdmin'
const { user, isAuthenticated, isAdmin } = storeToRefs(authStore);

// Props que recibe el componente (solo el nombre de usuario formateado)
const props = defineProps({
    userName: {
        type: String,
        required: true
    }
});

// Eventos que emite el componente (solo 'logout')
const emit = defineEmits(['logout']);

// Lógica para saber en qué vista estamos
const isInHomeView = computed(() => route.name === 'home');
const isInAdminView = computed(() => route.name === 'admin');


// Lógica para redirigir al panel de administración
const goToAdmin = () => {
    // Asume que tienes una ruta con name: 'admin' configurada en tu router
    router.push({ name: 'admin' });
};

// Lógica para redirigir a la vista pública de cursos (Home)
const goToHome = () => {
    router.push({ name: 'home' });
};
</script>

<template>
    <header class="bg-primary text-white shadow-sm">
        <div class="container d-flex justify-content-between align-items-center py-3">
            <!-- Logo/Título de la aplicación -->
            <h1 class="h4 mb-0 fw-bold">Adweb Online</h1>
            
            <!-- Controles de Usuario y Navegación -->
            <div class="d-flex align-items-center">
                
                <!-- BOTÓN: Ver Cursos (Visible solo para Admins Y en la vista Admin o Edición) -->
                <button 
                    v-if="isAuthenticated && isAdmin && isInAdminView"
                    @click="goToHome" 
                    class="btn btn-info btn-sm me-3 fw-semibold text-white"
                >
                    <i class="bi bi-eye-fill me-1"></i> Ver Cursos
                </button>

                <!-- BOTÓN: Panel Admin (Visible solo para Admins Y NO en la vista Admin) -->
                <button 
                    v-if="isAuthenticated && isAdmin && !isInAdminView"
                    @click="goToAdmin" 
                    class="btn btn-warning btn-sm me-3 fw-semibold"
                >
                    <i class="bi bi-gear-fill me-1"></i> Panel Admin
                </button>
                
                <!-- Saludo al Usuario -->
                <span class="me-3 d-none d-sm-inline">
                    Bienvenido, <span class="fw-semibold text-warning">{{ userName }}</span>
                </span>

                <!-- Botón de Cerrar Sesión -->
                <button 
                    @click="emit('logout')" 
                    class="btn btn-danger btn-sm fw-semibold"
                >
                    <i class="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* Estilos para darle un toque visual al encabezado */
header {
    /* Gradiente suave */
    background: linear-gradient(90deg, #007bff, #0056b3); 
}
</style>
