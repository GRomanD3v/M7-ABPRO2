<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

// 1. Inicializar Store
const authStore = useAuthStore();
const router = useRouter();

// 2. Desestructurar propiedades reactivas del Store usando storeToRefs
// Esto crea referencias reactivas locales 'error' y 'loading' que se SINCRONIZAN automáticamente.
const { error, loading, user } = storeToRefs(authStore);

// 3. Variables reactivas para el formulario
const email = ref('');
const password = ref('');

// 4. Función principal de Login
const handleLogin = async () => {
    // 4.1. Limpiar error previo
    authStore.error = null;
    
    // 4.2. Llamar a la acción del Store
    await authStore.loginUser(email.value, password.value);
    
    // 4.3. LÓGICA DE REDIRECCIÓN
    // Si NO hay error (error es null) y el usuario está establecido (user no es null), redirigir.
    if (!error.value && user.value) {
        router.push({ name: 'home' });
    }
    // Nota: Gracias a storeToRefs, no necesitamos sincronizar error/loading manualmente.
};
</script>

<template>
    <div class="login-wrapper">
    <div class="login-container">
      <div class="card shadow-lg border-0 rounded-4">
        <div class="card-body p-4 p-md-5">
          <!-- Header -->
          <div class="text-center mb-4">
            <h1 class="h2 fw-bold text-tertiary mb-2">
              <i class="bi bi-code-square"></i> Adweb Online
            </h1>
            <p class="text-muted mb-0">
              Inicia sesión para continuar
            </p>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleLogin">
            <!-- Email -->
            <div class="mb-3">
              <label for="email" class="form-label fw-semibold">
                <i class="bi bi-envelope-fill text-primary"></i> Correo
                electrónico
              </label>
              <input
                v-model="email"
                type="email"
                class="form-control form-control-lg"
                id="email"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <!-- Contraseña -->
            <div class="mb-4">
              <label for="password" class="form-label fw-semibold">
                <i class="bi bi-lock-fill text-primary"></i> Contraseña
              </label>
              <input
                v-model="password"
                type="password"
                class="form-control form-control-lg"
                id="password"
                placeholder="••••••••"
                required
              />
            </div>

            <!-- Error Alert -->
            <div
              v-if="error" 
              class="alert alert-danger d-flex align-items-center mb-3"
              role="alert"
            >
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{{ error }}</div>
            </div>

            <!-- Botón Login -->
            <button
              type="submit"
              class="btn btn-primary btn-lg w-100 fw-semibold"
              :disabled="loading" 
            >
              <span v-if="loading"> <!-- Usa la ref local reactiva 'loading' -->
                <span
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Iniciando sesión...
              </span>
              <span v-else>
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </span>
            </button>
            <!-- Link a Registro -->
            <div class="text-center mt-3">
              <p class="mb-0 text-muted">
                ¿No tienes cuenta?
                <router-link
                  to="/register"
                  class="text-primary fw-semibold text-decoration-none"
                >
                  Regístrate aquí
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
/* Los estilos CSS permanecen igual */
.login-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Contenedor del formulario - Centrado con ancho controlado */
.login-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* Card del formulario */
.card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.98);
  width: 100%;
}

/* Tamaños de texto */
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

/* RESPONSIVE BREAKPOINTS */

/* Mobile pequeño (< 375px) */
@media (max-width: 374px) {
  .login-container {
    max-width: 100%;
  }

  .card-body {
    padding: 1.5rem !important;
  }

  .h2 {
    font-size: 1.5rem;
  }
}

/* Mobile estándar (375px - 576px) */
@media (min-width: 375px) and (max-width: 576px) {
  .login-container {
    max-width: 90%;
  }

  .card-body {
    padding: 2rem !important;
  }
}

/* Tablet pequeña (577px - 768px) */
@media (min-width: 577px) and (max-width: 768px) {
  .login-container {
    max-width: 480px;
  }

  .card-body {
    padding: 2.5rem !important;
  }
}

/* Tablet grande / Desktop pequeño (769px - 991px) */
@media (min-width: 769px) and (max-width: 991px) {
  .login-container {
    max-width: 500px;
  }

  .card-body {
    padding: 2.5rem !important;
  }
}

/* Desktop estándar (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .login-container {
    max-width: 520px;
  }

  .card-body {
    padding: 3rem !important;
  }

  .h2 {
    font-size: 2.25rem;
  }
}

/* Desktop grande (1200px - 1399px) */
@media (min-width: 1200px) and (max-width: 1399px) {
  .login-container {
    max-width: 540px;
  }

  .card-body {
    padding: 3rem !important;
  }

  .h2 {
    font-size: 2.5rem;
  }
}

/* Desktop extra grande (>= 1400px) */
@media (min-width: 1400px) {
  .login-container {
    max-width: 560px;
  }

  .card-body {
    padding: 3.5rem !important;
  }

  .h2 {
    font-size: 2.5rem;
  }
}

/* Animaciones suaves */
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
