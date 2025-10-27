<script setup>
import { ref, watch } from 'vue';

// Definición de las props que recibe el modal
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    // Solo se usa para AGREGAR, pero si lo reusamos, es útil.
    // Para la creación, esta prop será null o no se pasa.
    initialCourse: { 
        type: Object,
        default: null
    }
});

// Definición de los eventos que emite el modal
const emit = defineEmits(['close', 'save']);

// Estado inicial del curso vacío/por defecto
const defaultCourse = {
    nombre: '',
    codigo: '',
    precio: 0,
    duracion: '',
    descripcion: '',
    cupos: 0,
    inscritos: 0,
    img: 'https://placehold.co/400x200/222/FFF?text=Curso+Nuevo', // URL de imagen por defecto
    estado: null // Vacío por defecto, el administrador decide el estado al crear el curso
};

// Objeto reactivo que modela los datos del formulario
const courseData = ref({ ...defaultCourse });

// Título dinámico del modal (Crear o Editar)
const modalTitle = ref('Agregar Nuevo Curso');

// Lógica para precargar/resetear el formulario cuando el modal se abre/cierra o el curso cambia
watch(() => props.show, (newVal) => {
    if (newVal) {
        // Al abrir: resetear a valores por defecto (modo Crear)
        courseData.value = { ...defaultCourse };
        modalTitle.value = 'Agregar Nuevo Curso';
    }
});


// Función que se ejecuta al enviar el formulario
const handleSubmit = () => {
    // Validación básica: asegura que no hayan inscritos > cupos al crear
    if (courseData.value.inscritos > courseData.value.cupos) {
        alert("El número de inscritos no puede superar el número de cupos.");
        return;
    }
    
    // Emitir el evento 'save' con los datos del curso.
    // La lógica de Pinia (agregarCurso) se ejecuta en AdminView.vue.
    emit('save', courseData.value); 
};
</script>

<template>
    <div 
        class="modal fade" 
        :class="{ 'show d-block': show }" 
        tabindex="-1" 
        style="background-color: rgba(0, 0, 0, 0.5);"
        v-if="show"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close btn-close-white" @click="emit('close')" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body">
                        
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="codigo" class="form-label">Código</label>
                                <input v-model="courseData.codigo" type="text" class="form-control" id="codigo" required>
                            </div>
                            <div class="col-md-8">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input v-model="courseData.nombre" type="text" class="form-control" id="nombre" required>
                            </div>
                            
                            <div class="col-12">
                                <label for="imgUrl" class="form-label">URL de la Imagen del Curso</label>
                                <input v-model="courseData.img" type="url" class="form-control" id="imgUrl" placeholder="http://..." required>
                                <div class="mt-2" v-if="courseData.img">
                                    <img :src="courseData.img" alt="Vista previa" class="img-thumbnail" style="max-height: 100px;">
                                </div>
                            </div>

                            <div class="col-md-3">
                                <label for="duracion" class="form-label">Duración</label>
                                <input v-model="courseData.duracion" type="text" class="form-control" id="duracion" required>
                            </div>
                            <div class="col-md-3">
                                <label for="precio" class="form-label">Costo ($)</label>
                                <input v-model.number="courseData.precio" type="number" class="form-control" id="precio" min="0" required>
                            </div>
                            <div class="col-md-3">
                                <label for="cupos" class="form-label">Cupos</label>
                                <input v-model.number="courseData.cupos" type="number" class="form-control" id="cupos" min="0" required>
                            </div>
                            <div class="col-md-3">
                                <label for="inscritos" class="form-label">Inscritos</label>
                                <input v-model.number="courseData.inscritos" type="number" class="form-control" id="inscritos" min="0" required>
                            </div>

                            <div class="col-12">
                                <label for="descripcion" class="form-label">Descripción</label>
                                <textarea v-model="courseData.descripcion" class="form-control" id="descripcion" rows="3" required></textarea>
                            </div>

                            <div class="col-12">
                                <div class="form-check">
                                    <input v-model="courseData.estado" class="form-check-input" type="radio" id="estadoCheck" :value="true">
                                    <label class="form-check-label" for="estadoCheck">
                                        Curso Activo / Disponible
                                    </label>
                                </div>

                                <div class="form-check">
                                    <input v-model="courseData.estado" class="form-check-input" type="radio" id="estadoCerrado" :value="false">
                                    <label class="form-check-label" for="estadoCerrado">
                                        Curso Cerrado / No disponible
                                    </label>
                                </div>



                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="emit('close')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-save me-2"></i> Guardar Curso
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilo para asegurar que el modal se muestre correctamente */
.modal.show {
    display: block;
}
</style>