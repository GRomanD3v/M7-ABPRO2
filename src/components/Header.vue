<script setup>
import { defineProps, defineEmits } from 'vue';

// 1. Definir las props que recibirá del componente padre (HomeView)
const props = defineProps({
    // La prop ya no es 'required' porque HomeView ahora garantiza que siempre envía un string (email o 'Invitado')
    userName: {
        type: String,
        default: 'Invitado' // Usamos un default por seguridad
    }
});

// 2. Definir los eventos que emitirá al componente padre
const emit = defineEmits(['logout']);

// Función que emite el evento para que el padre lo maneje
const onLogoutClick = () => {
    // Esto llamará a handleLogout en HomeView.vue
    emit('logout');
};
</script>

<template>
    <!-- Navbar y Header  -->
    <header class="shadow-md py-3 bg-purple-gradient text-white">
        <div class="container d-flex justify-content-between align-items-center">
            <!-- Título: Lo mantenemos blanco para el fondo oscuro -->
            <h1 class="h4 fw-bold mb-0">Adweb Online</h1>
            <div class="d-flex align-items-center">
                <!-- Se usa la prop 'userName' -->
                <span class="me-3 d-none d-sm-inline text-light">
                    Bienvenido, <strong class="fw-semibold">{{ props.userName }}</strong>
                </span>
                <!-- Se llama a la función local que emite el evento 'logout' -->
                <!-- Botón: Usamos un botón de texto blanco o uno que contraste bien -->
                <button 
                    @click="onLogoutClick" 
                    class="btn btn-sm btn-light fw-semibold text-danger"
                >
                    <i class="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>

/* El estilo responsive del header se mueve aquí */
@media (max-width: 576px) {
    .container {
        padding: 0 1rem;
    }
    header .container {
        flex-direction: column;
        align-items: flex-start;
    }
    header h1 {
        margin-bottom: 0.5rem;
    }
    header .d-flex {
        width: 100%;
        justify-content: space-between;
    }
    header span {
        font-size: 0.85rem;
    }
}
</style>
