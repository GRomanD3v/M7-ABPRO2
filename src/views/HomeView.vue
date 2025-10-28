<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue"; // Importar 'computed'
import { useRouter } from "vue-router"; // Necesario para la redirección
import { storeToRefs } from "pinia"; // Necesario para la reactividad
import { useAuthStore } from "../stores/auth";
import Header from "../components/Header.vue";
import { useCursoStore } from "../stores/curso";

// 1. Inicialización y Reactividad
const authStore = useAuthStore();
const cursoStore = useCursoStore();
const router = useRouter();

// 2. reactividad de auth y cursos
const { user, isAuthenticated } = storeToRefs(authStore);
const { cursosDisponibles, loadingCourses } = storeToRefs(cursoStore); // cursos reactivos

// 3. lógica del header: Nombre de usuario
// Usamos computed para que el nombre se actualice automáticamente si el email del usuario cambia.
const userNameDisplay = computed(() => {
  return user.value && user.value.email
    ? user.value.email.split("@")[0]
    : "Invitado";
});

// 4. Lógica de Cierre de Sesión (Conectada al Header)
const handleLogout = async () => {
  // 1. Llamar a la acción de logout de Firebase (sin redirección interna)
  await authStore.logoutUser();

  // 2. Redirigir al login. El router guard también lo haría, pero esto asegura la transición inmediata.
  // La redirección es manejada por el watcher en App.vue, pero la dejamos aquí para redundancia
  if (!isAuthenticated.value) {
    router.push({ name: "login" });
  }
};

// 5. carga de cursos
onMounted(() => {
  // inicia el listener de Firestore para traer los cursos en tiempò real
  cursoStore.iniciarListenerCursos();
});

// 6. Limpieza al desmontar (opcional, pero buena práctica)
onUnmounted(() => {
  // detiene la escucha de la base de datos cuando el componente se destruye
  cursoStore.detenerListenerCursos();
});
</script>

<template>
  <Header :user-name="userNameDisplay" @logout="handleLogout" />

  <div class="home-view-wrapper bg-light">
    <main class="container py-4">
      <h2 class="mb-4 text-center text-secondary text-h3">Cursos Disponibles</h2>

      <div v-if="loadingCourses" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando cursos...</span>
        </div>
        <p class="mt-2 text-muted">Cargando cursos...</p>
      </div>

      <div v-else-if="cursosDisponibles.length > 0" class="row g-4">
        <div v-for="course in cursosDisponibles" :key="course.id" class="col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm border-0 rounded-3 course-card">

            <div class="d-flex justify-center align-center" style="height: 100%;">
              <v-img :aspect-ratio="16/9" class="bg-surface" :src="course.img" width="200" cover></v-img>
            </div> 
            <!-- Esta img esta con componente Vuetify -->

            <div class="card-body">
              <p class="card-title fw-bold text-primary text-h6 ">
                {{ course.nombre }} ({{ course.codigo }})
              </p>
              <p class="card-text text-muted small">{{ course.descripcion }}</p>
              <span :class="[
                  'badge me-2',
                  course.estado ? 'text-bg-success' : 'text-bg-danger',
                ]">
                {{ course.estado ? "Disponible" : "Cerrado" }}
              </span>
            </div>

            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps" color="surface-variant" text="Ver Mas" variant="flat"></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Dialog">
                  <v-card-text>
                    {{ course.nombre }} {{ course.duracion }} {{ course.descripcion }}
                    <p>Uso de componente de Vuetify </p>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>

            <div class="card-footer bg-light border-0 d-flex justify-content-between align-items-center">
              <span class="badge text-bg-info">
                <i class="bi bi-clock me-1"></i> {{ course.duracion }}
              </span>
              <span class="text-h6 small fw-bold">
                ${{ Number(course.precio).toLocaleString('es-CL') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="col-12 text-center text-muted py-5">
        <i class="bi bi-info-circle-fill me-2"></i> No hay cursos disponibles
        para mostrar.
      </div>
    </main>
  </div>

</template>

<style scoped>
/* Los estilos se mantienen igual */
.home-view-wrapper {
  min-height: 100vh;
}

.course-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-title {
  font-size: 1.15rem;
}

.card-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .container {
    padding: 0 1rem;
  }
  .home-view-wrapper header .container {
    flex-direction: column;
    align-items: flex-start;
  }
  .home-view-wrapper header h1 {
    margin-bottom: 0.5rem;
  }
  .home-view-wrapper header .d-flex {
    width: 100%;
    justify-content: space-between;
  }
  .home-view-wrapper header span {
    font-size: 0.85rem;
  }
}
</style>
