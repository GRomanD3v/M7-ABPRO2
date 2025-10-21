<script setup>
import { ref, onMounted, computed } from 'vue'; // Importar 'computed'
import { useRouter } from 'vue-router'; // Necesario para la redirección
import { storeToRefs } from 'pinia'; // Necesario para la reactividad
import { useAuthStore } from '../stores/auth';
import Header from '../components/Header.vue';
import { useCursoStore } from '../stores/curso';

// 1. Inicialización y Reactividad
const authStore = useAuthStore();
const cursoStore = useCursoStore();
const router = useRouter();

// Usamos storeToRefs para obtener las propiedades reactivas del store
const { user, isAuthenticated } = storeToRefs(authStore);

// Lista para almacenar los cursos (mantienes tu estructura de datos)
const courses = ref([]); 

// 2. Lógica del Header: Nombre de Usuario
// Usamos computed para que el nombre se actualice automáticamente si el email del usuario cambia.
const userNameDisplay = computed(() => {
    // Si el usuario existe, muestra la parte del email antes del @, sino 'Invitado'
    if (user.value && user.value.email) {
        return user.value.email.split('@')[0];
    }
    return 'Invitado'; 
});


// 3. Lógica de Cierre de Sesión (Conectada al Header)
const handleLogout = async () => {
    // 1. Llamar a la acción de logout de Firebase (sin redirección interna)
    await authStore.logoutUser();
    
    // 2. Redirigir al login. El router guard también lo haría, pero esto asegura la transición inmediata.
    // Solo redirigimos si isAuthenticated es falso (después del logout)
    if (!isAuthenticated.value) {
        router.push({ name: 'login' });
    }
};

// 4. Carga de Cursos
onMounted(() => {
    // La reactividad del nombre ya no depende de onMounted, pero la carga de cursos sí.
    loadCourses();
});

// Función ficticia para cargar cursos (será reemplazada por lógica de Firestore)
const loadCourses = () => {
    // Datos de ejemplo
    courses.value = [
        { id: 1, title: 'Introducción a Vue 3 y Pinia', description: 'Aprende los fundamentos del framework Vue.js con la gestión de estado Pinia.', duration: '4 semanas', instructor: 'Prof. Ana' },
        { id: 2, title: 'Desarrollo Frontend con Tailwind CSS', description: 'Diseña interfaces modernas y responsivas sin escribir CSS puro.', duration: '3 semanas', instructor: 'Prof. Jorge' },
        { id: 3, title: 'Bases de Datos con Firebase Firestore', description: 'Implementa una base de datos NoSQL escalable para tu aplicación web.', duration: '6 semanas', instructor: 'Prof. Mateo' },
    ];
};

const crearCurso = async () => {
  await cursoStore.agregarCurso(
            { title: 'Introducción a Vue 3 y Pinia', description: 'Aprende los fundamentos del framework Vue.js con la gestión de estado Pinia.', duration: '4 semanas', instructor: 'Prof. Ana' },

  )
}

</script>

<template>
    <Header 
        :user-name="userNameDisplay" 
        @logout="handleLogout" 
    />
    
  <div class="home-view-wrapper bg-light">
    <main class="container py-4">
      <h2 class="mb-4 text-center text-secondary">Cursos Disponibles</h2>

      <div class="row g-4">
        <div v-for="course in courses" :key="course.id" class="col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm border-0 rounded-3 course-card">
            <div class="card-body">
              <h5 class="card-title fw-bold text-primary">{{ course.title }}</h5>
              <p class="card-text text-muted small">{{ course.description }}</p>
              <button @click="crearCurso">Crear Curso</button>
            </div>
            <div class="card-footer bg-light border-0 d-flex justify-content-between align-items-center">
              <span class="badge text-bg-info">
                <i class="bi bi-clock me-1"></i> {{ course.duration }}
              </span>
              <span class="text-secondary small">
                <i class="bi bi-person-circle me-1"></i> {{ course.instructor }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="courses.length === 0" class="col-12 text-center text-muted py-5">
            <i class="bi bi-info-circle-fill me-2"></i> No hay cursos disponibles.
        </div>
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