<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useCursoStore } from '../stores/curso';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import CourseModal from '../components/CourseModal.vue'; 
import { useNotificationStore } from '../stores/notification';// Componente de modal que crearemos

// 1. Inicialización de Stores
const authStore = useAuthStore();
const cursoStore = useCursoStore();
const router = useRouter();
const notificationStore = useNotificationStore();

// 2. Reactividad
const { user } = storeToRefs(authStore);
const { cursosDisponibles, loadingCourses } = storeToRefs(cursoStore);

// 3. Lógica del Header: Nombre de Usuario
const userNameDisplay = computed(() => {
    return user.value && user.value.email ? user.value.email.split('@')[0] : 'Admin';
});

// 4. Lógica de Cierre de Sesión
const handleLogout = async () => {
    await authStore.logoutUser();
};

// 5. Lógica del Modal de Administración
const isModalOpen = ref(false);

// Abre el modal para agregar un nuevo curso
const openAddModal = () => {
    isModalOpen.value = true;
};

// Cierra el modal
const closeModal = () => {
    isModalOpen.value = false;
};

// 6. Lógica de CRUD
const handleSaveCourse = async (curso) => {
    // Esta función ahora asume que siempre está AGREGANDO un curso (ID = null)
    const result = await cursoStore.agregarCurso(curso);
    if (result.success) {
       notificationStore.showNotification({
        type: 'success',
        message: 'Curso agregado con éxito.'
       });
    } else {
        notificationStore.showNotification({
        type: 'error',
        message: 'Error al agregar curso.'
        });
        
    }
    closeModal();
};

//7. carga de cursos en tiempo real
onMounted(() => {
    // Si la HomeView no se ha cargado (listener activo), lo iniciamos aquí
    cursoStore.iniciarListenerCursos();
});
// 8. Lógica de eliminación
const handleDeleteCourse = async (cursoId, nombre) => {
    if (confirm(`¿Estás seguro de que quieres ELIMINAR el curso: ${nombre}?`)) {
        const result = await cursoStore.eliminarCurso(cursoId);
        if (result.success) {
            notificationStore.showNotification({
                type: 'success',
                message: `🗑️ Curso '${nombre}' eliminado.`
            })
        } else {
            notificationStore.showNotification({
                type: 'error',
                message: '❌ Error al eliminar el curso.'
            })
        }
    }
};

// 9. Lógica de edición (Redirección)
const goToEdit = (cursoId) => {
    //Redirige a la ruta de edición usando el ID del curso
    router.push({  name: 'editCourse', params: { id: cursoId } });
};

</script>

<template>
    <Header 
        :user-name="userNameDisplay" 
        @logout="handleLogout" 
    />
    
    <div class="admin-view-wrapper bg-white">
        <main class="container py-4">
            <h2 class="mb-4 text-primary text-center">Panel de Administración de Cursos</h2>
            
            <div class="d-flex justify-content-end mb-3">
                <button @click="openAddModal" class="btn btn-primary fw-semibold">
                    <i class="bi bi-plus-circle-fill me-2"></i> Agregar Nuevo Curso
                </button>
            </div>

            <div class="table-responsive shadow-sm rounded-3">
                <table class="table table-hover align-middle mb-0 bg-white">
                    <thead class="bg-light">
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Cupos/Inscritos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingCourses">
                            <td colspan="6" class="text-center py-4">Cargando datos...</td>
                        </tr>
                        <tr v-else v-for="curso in cursosDisponibles" :key="curso.id">
                            <td>{{ curso.codigo }}</td>
                            <td>{{ curso.nombre }}</td>
                            <td>${{ curso.precio }}</td>
                            <td>{{ curso.inscritos }}/{{ curso.cupos }}</td>
                            <td>
                                <span :class="['badge', curso.estado ? 'text-bg-success' : 'text-bg-danger']">
                                    {{ curso.estado ? 'Activo' : 'Cerrado' }}
                                </span>
                            </td>
                            <td>
                                <button @click="goToEdit(curso.id)" class="btn btn-sm btn-info me-2"> 
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button @click="handleDeleteCourse(curso.id, curso.nombre)" class="btn btn-sm btn-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!loadingCourses && cursosDisponibles.length === 0">
                            <td colspan="6" class="text-center py-4 text-muted">No hay cursos registrados.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <CourseModal 
        :show="isModalOpen"
        @close="closeModal"
        @save="handleSaveCourse"
    />
</template>

<style scoped>
/* Estilos específicos para la tabla de administración */
.admin-view-wrapper {
  min-height: 100vh;
}
.table-responsive {
    border: 1px solid #dee2e6;
}
.table thead th {
    font-weight: bold;
    color: #495057;
    background-color: #f8f9fa;
}
</style>