<script setup>
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia'; // Necesario para la reactividad
import AppToast from './components/AppToast.vue';

const authStore = useAuthStore();
const router = useRouter();

// Extraemos la ref reactiva 'isAuthReady'
const { isAuthReady } = storeToRefs(authStore); 

onMounted(() => {
    // Inicializa el listener de Firebase Auth
    authStore.initAuth();
});

// El requisito pide usar onAuthStateChanged para notificar el ingreso.
// En App.vue, usamos un watcher para manejar las redirecciones iniciales una vez que 'isAuthReady' es true.
watch(isAuthReady, (isReady) => {
    if (isReady && authStore.isAuthenticated) {
        // El usuario ya está autenticado (ya sea por login o persistencia)
        // Opcional: Mostrar un toast/modal indicando "Bienvenido de nuevo" (REQ)
        // La redirección inicial ya la gestiona el router guard, pero esto refuerza.
    }
});
</script>

<template>
   <router-view v-if="isAuthReady" />

  <div v-else class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="text-center">
      <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-muted mt-3 fs-5">Verificando sesión...</p>
    </div>
  </div>
  <AppToast />
</template>

<style scoped>

</style>
