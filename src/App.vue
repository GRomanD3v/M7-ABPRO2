<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const router = useRouter();
onMounted(() => {
  authStore.initAuth();
});
</script>

<template>
   <router-view v-if="!authStore.loading" />
  <div v-else class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="text-center">
      <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-muted mt-3 fs-5">Cargando aplicación...</p>
    </div>
  </div>
</template>

<style scoped>

</style>
