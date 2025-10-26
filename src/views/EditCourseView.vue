<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useCursoStore } from "../stores/curso"; // Asegúrate de que el path es correcto
import { useNotificationStore } from '../stores/notification';
import Header from "../components/Header.vue";

// 1. Inicialización de Stores y Router
const authStore = useAuthStore();
const cursoStore = useCursoStore();
const notificationStore = useNotificationStore();
const router = useRouter();
const route = useRoute(); // Para acceder a los parámetros de la ruta

// 2. Reactividad
const { user } = storeToRefs(authStore);
const { cursosDisponibles, loadingCourses } = storeToRefs(cursoStore);

// 3. Estado Local del Formulario
// Inicializamos con null y se llenará con los datos del curso a editar
const courseData = ref(null);
const isLoadingData = ref(true);

// 4. Obtener y cargar el curso
const courseId = route.params.id;

onMounted(() => {
    // Es crucial que el listener esté activo para que cursosDisponibles se llene
    cursoStore.iniciarListenerCursos();
});

// Usamos un watcher para esperar a que los cursos se carguen desde Firestore
watch([cursosDisponibles, loadingCourses], ([newCursos, newLoading], [oldCursos, oldLoading]) => {
    // Si ya no está cargando O si el listener ya retornó datos
    if (!newLoading && newCursos.length > 0 && courseData.value === null) {
        const course = newCursos.find(c => c.id === courseId);
        
        if (course) {
            // Clonamos el objeto para evitar mutar el estado del store directamente
            courseData.value = { ...course }; 
            isLoadingData.value = false;
        } else {
            // Si el curso no existe (por si el usuario ingresa un ID incorrecto)
            notificationStore.showNotification({
                type: 'error',
                message: `❌ Curso con ID ${courseId} no encontrado.`
            });
            router.push({ name: 'admin' });
        }
    }
}, { immediate: true });


// 5. Lógica del Header
const userNameDisplay = computed(() => {
    return user.value && user.value.email ? user.value.email.split("@")[0] : "Admin";
});

const handleLogout = async () => {
  await authStore.logoutUser();
  router.push({ name: "login" });
};

// 6. Lógica de Edición (CRUD)
const handleUpdateCourse = async () => {
    if (!courseData.value || !courseId) return;

    // Validación básica
    if (courseData.value.inscritos > courseData.value.cupos) {
        notificationStore.showNotification({
            type: 'error',
            message: "⚠️ Los inscritos no pueden superar los cupos disponibles."
        });
        return;
    }

    // 6.1 Separamos el ID del resto de los datos (la ID no se debe enviar para actualizar)
    const { id, ...dataToUpdate } = courseData.value;
    
    // 6.2 Llamamos a la acción de edición en el store
    const result = await cursoStore.editarCurso(courseId, dataToUpdate);

    if (result.success) {
        notificationStore.showNotification({
            type: 'success',
            message: `✅ Curso '${courseData.value.nombre}' actualizado con éxito.`
        });
        // Redirigir de vuelta al panel de administración
        router.push({ name: 'admin' });
    } else {
        notificationStore.showNotification({
            type: 'error',
            message: '❌ Error al actualizar el curso.'
        });
    }
};

// 7. Navegación
const goBack = () => {
    router.push({ name: 'admin' });
};
</script>

<template>
  <Header :user-name="userNameDisplay" @logout="handleLogout" />

  <div class="edit-view-wrapper bg-light min-vh-100">
    <main class="container py-5">
      <h2 class="mb-4 text-center text-primary">
        <i class="bi bi-pencil-square me-2"></i> Editar Curso
      </h2>

      <!-- Estado de Carga -->
      <div v-if="isLoadingData || courseData === null" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando datos...</span>
        </div>
        <p class="mt-2 text-muted">Cargando datos del curso con ID: {{ courseId }}...</p>
      </div>

      <!-- Formulario de Edición -->
      <div v-else class="card shadow-lg rounded-3 border-0 mx-auto" style="max-width: 800px;">
        <div class="card-header bg-secondary text-white fw-bold">
            Editando: {{ courseData.nombre }} ({{ courseData.codigo }})
        </div>
        <form @submit.prevent="handleUpdateCourse" class="card-body">
          <div class="row g-4">
            <!-- Código y Nombre -->
            <div class="col-md-4">
              <label for="codigo" class="form-label fw-semibold">Código</label>
              <input v-model="courseData.codigo" type="text" class="form-control" id="codigo" required />
            </div>
            <div class="col-md-8">
              <label for="nombre" class="form-label fw-semibold">Nombre</label>
              <input v-model="courseData.nombre" type="text" class="form-control" id="nombre" required />
            </div>

            <!-- URL Imagen -->
            <div class="col-12">
              <label for="imgUrl" class="form-label fw-semibold">URL de la Imagen del Curso</label>
              <input v-model="courseData.img" type="url" class="form-control" id="imgUrl" placeholder="http://..." required />
              <div class="mt-2 text-center">
                <img :src="courseData.img" alt="Vista previa" class="img-thumbnail rounded-3" style="max-height: 150px; width: auto;">
              </div>
            </div>

            <!-- Duración, Costo, Cupos, Inscritos -->
            <div class="col-md-3">
              <label for="duracion" class="form-label fw-semibold">Duración</label>
              <input v-model="courseData.duracion" type="text" class="form-control" id="duracion" required />
            </div>
            <div class="col-md-3">
              <label for="precio" class="form-label fw-semibold">Costo ($)</label>
              <input v-model.number="courseData.precio" type="number" class="form-control" id="precio" min="0" required />
            </div>
            <div class="col-md-3">
              <label for="cupos" class="form-label fw-semibold">Cupos Máximos</label>
              <input v-model.number="courseData.cupos" type="number" class="form-control" id="cupos" min="0" required />
            </div>
            <div class="col-md-3">
              <label for="inscritos" class="form-label fw-semibold">Inscritos Actuales</label>
              <input v-model.number="courseData.inscritos" type="number" class="form-control" id="inscritos" min="0" required />
            </div>

            <!-- Descripción -->
            <div class="col-12">
              <label for="descripcion" class="form-label fw-semibold">Descripción Detallada</label>
              <textarea v-model="courseData.descripcion" class="form-control" id="descripcion" rows="3" required></textarea>
            </div>

            <!-- Estado (Checkbox) -->
            <div class="col-12">
              <div class="form-check">
                <input v-model="courseData.estado" class="form-check-input" type="checkbox" id="estadoCheck" />
                <label class="form-check-label fw-semibold" for="estadoCheck">
                  Curso Activo / Disponible
                </label>
              </div>
            </div>
          </div>
          
          <!-- Botones de Acción -->
          <div class="d-flex justify-content-between mt-4 border-top pt-3">
            <button type="button" class="btn btn-outline-secondary" @click="goBack">
                <i class="bi bi-arrow-left-circle me-2"></i> Volver
            </button>
            <button type="submit" class="btn btn-success fw-semibold">
              <i class="bi bi-save me-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.edit-view-wrapper {
  background-color: #f8f9fa !important;
}
.card-header {
    background-color: #6c757d !important;
}
</style>
