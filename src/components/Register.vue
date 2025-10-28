<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router  = useRouter();
// 1. iniciar el Store
const authStore = useAuthStore();

// 2. Variables reactivas para el formulario
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// 3. Variables auxiliares para la UI
const success = ref(null);
// Usamos computed para leer directamente del store. El error del store se limpia en la acción.
const localError = ref(null);

// 4. Función principal de Registro
const handleRegister = async () => {
    // Limpiar estados locales
    localError.value = null; 
    success.value = null;

    // Validar que las contraseñas coincidan
    if (password.value !== confirmPassword.value) {
        localError.value = 'Las contraseñas no coinciden';
        return;
    }

    // El Store se encarga de manejar el estado `loading`

    // Registrar usuario
    const result = await authStore.registerUser(email.value, password.value);
    
    // Si la promesa devuelve éxito (sin Firebase error)
    if (result && result.success) { 
        success.value = '¡Cuenta creada exitosamente! Redirigiendo...';
        
        // Esperar 2 segundos y redirigir
        setTimeout(() => {
            // IMPLEMENTACIÓN CRÍTICA
            router.push({ name: 'login' });
        }, 2000);
    }
};
</script>

<template>
    <div class="register-wrapper">
    <div class="register-container">
      <div class="card shadow-lg border-0 rounded-4">
        <div class="card-body p-4 p-md-5">
          <!-- Header -->
          <div class="text-center mb-4">
            <h1 class="h2 fw-bold text-success mb-2">
              <i class="bi bi-person-plus"></i> Crear Cuenta
            </h1>
            <p class="text-muted mb-0">Regístrate para comenzar</p>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleRegister">
            <!-- Email -->
            <div class="mb-3">
              <label for="email" class="form-label fw-semibold">
                <i class="bi bi-envelope-fill text-success"></i> Correo electrónico
              </label>
              <input v-model="email" type="email" class="form-control form-control-lg" id="email" placeholder="tu@email.com" required />
            </div>

            <!-- Contraseña -->
            <div class="mb-3">
              <label for="password" class="form-label fw-semibold">
                <i class="bi bi-lock-fill text-success"></i> Contraseña
              </label>
              <input v-model="password" type="password" class="form-control form-control-lg" id="password" placeholder="Mínimo 6 caracteres" required minlength="6" />
              <small class="text-muted">La contraseña debe tener al menos 6 caracteres</small>
            </div>

            <!-- Confirmar Contraseña -->
            <div class="mb-4">
              <label for="confirmPassword" class="form-label fw-semibold">
                <i class="bi bi-lock-check-fill text-success"></i> Confirmar Contraseña
              </label>
              <input v-model="confirmPassword" type="password" class="form-control form-control-lg" id="confirmPassword" placeholder="Confirma tu contraseña" required />
            </div>

            <!-- Error Alert: Muestra error local o el error del Store (Firebase) -->
            <div v-if="localError || authStore.error" class="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{{ localError || authStore.error }}</div>
            </div>

            <!-- Success Alert -->
            <div v-if="success" class="alert alert-success d-flex align-items-center mb-3" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>{{ success }}</div>
            </div>

            <!-- Botón Registro -->
            <button
              type="submit"
              class="btn btn-success btn-lg w-100 fw-semibold mb-3"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Creando cuenta...
              </span>
              <span v-else>
                <i class="bi bi-person-plus me-2"></i>
                Crear Cuenta
              </span>
            </button>

            <!-- Link a Login -->
            <div class="text-center">
              <p class="mb-0 text-muted">
                ¿Ya tienes cuenta? 
                <router-link to="/login" class="text-success fw-semibold text-decoration-none">
                  Inicia Sesión
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (Estilos CSS ya estaban correctos y se mantienen) */
.register-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.register-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.98);
  width: 100%;
}

.h2 {
  font-size: 2rem;
}

.form-control-lg {
  font-size: 1rem;
  padding: 0.75rem 1rem;
}

.form-label {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

/* RESPONSIVE */
@media (max-width: 576px) {
  .register-container {
    max-width: 90%;
  }
  
  .card-body {
    padding: 2rem !important;
  }
  
  .h2 {
    font-size: 1.5rem;
  }
}

@media (min-width: 577px) {
  .card-body {
    padding: 2.5rem !important;
  }
}

@media (min-width: 992px) {
  .card-body {
    padding: 3rem !important;
  }
  
  .h2 {
    font-size: 2.25rem;
  }
}

/* Animaciones */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
