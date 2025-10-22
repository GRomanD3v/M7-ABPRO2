// src/stores/curso.js
import { defineStore } from 'pinia';
import { db } from '@/firebase/init'; // Importa la instancia de Firestore
import { useAuthStore } from './auth';
// **Importante:** Agregamos 'getDocs' para fetchCursos (si no está)
import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 

export const useCursoStore = defineStore('curso', {
    state: () => ({
        cursos: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        totalCursos: (state) => state.cursos.length,
        cursosActivos: (state) => state.cursos.filter(c => c.activo),
        // Getter para encontrar un curso por ID directamente en el estado
        getCursoById: (state) => (id) => {
            return state.cursos.find(curso => curso.id === id);
        }
    },
    
    actions: {
        // ------------------------------------------------------------------
        // A) LEER TODOS (Fetch/Get) - Obtener todos los cursos de Firestore
        // ------------------------------------------------------------------
        async fetchCursos() {
            this.isLoading = true;
            this.error = null;
            try {
                const cursosCollection = collection(db, 'cursos');
                const snapshot = await getDocs(cursosCollection);
                
                this.cursos = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

            } catch (err) {
                console.error("Error al obtener cursos:", err);
                this.error = "No se pudieron cargar los cursos. Verifique la conexión a Firebase.";
            } finally {
                this.isLoading = false;
            }
        },

        // ------------------------------------------------------------------
        // A.1) LEER POR ID (Fetch by ID) - Obtener un curso específico de Firestore
        // ------------------------------------------------------------------
        async fetchCursoById(id) {
            this.error = null;
            try {
                const cursoRef = doc(db, 'cursos', id); // 1. Crea la referencia al documento
                const cursoSnap = await getDoc(cursoRef); // 2. Obtiene el documento
                
                if (cursoSnap.exists()) {
                    // Retorna el objeto del curso (útil para la edición)
                    return { id: cursoSnap.id, ...cursoSnap.data() };
                } else {
                    this.error = `Curso con ID ${id} no encontrado.`;
                    return null;
                }
            } catch (err) {
                console.error(`Error al obtener curso ${id}:`, err);
                this.error = "Fallo al obtener el curso específico.";
                return null;
            }
        },

        // ------------------------------------------------------------------
        // B) CREAR (Add) - Agregar un nuevo curso a Firestore
        // ------------------------------------------------------------------
        async agregarCurso(nuevoCurso) {
            try {
                const auth = useAuthStore();
                const cursosCollection = collection(db, 'cursos');
                const docRef = await addDoc(cursosCollection, nuevoCurso);

                // Actualiza Pinia con el nuevo curso (incluyendo el ID generado)
                this.cursos.push({ 
                    id: docRef.id, 
                    ...nuevoCurso 
                });

            } catch (err) {
                console.error("Error al agregar curso:", err);
                this.error = "Fallo al crear el curso.";
            }
        },

        // ------------------------------------------------------------------
        // C) ACTUALIZAR (Update) - Modificar un curso existente
        // ------------------------------------------------------------------
        async actualizarCurso(cursoId, datosActualizados) {
            this.error = null;
            try {
                // 1. Crea la referencia al documento
                const cursoRef = doc(db, 'cursos', cursoId); 
                
                // 2. Actualiza el documento en Firestore
                await updateDoc(cursoRef, datosActualizados);

                // 3. Actualiza el estado de Pinia
                const index = this.cursos.findIndex(c => c.id === cursoId);
                if (index !== -1) {
                    // Reemplaza el objeto en el array con los datos actualizados
                    this.cursos[index] = { ...this.cursos[index], ...datosActualizados };
                }

            } catch (err) {
                console.error(`Error al actualizar curso ${cursoId}:`, err);
                this.error = "Fallo al actualizar el curso.";
            }
        },

        // ------------------------------------------------------------------
        // D) ELIMINAR (Delete) - Borrar un curso
        // ------------------------------------------------------------------
        async eliminarCurso(cursoId) {
            this.error = null;
            try {
                // 1. Crea la referencia al documento
                const cursoRef = doc(db, 'cursos', cursoId);
                
                // 2. Elimina el documento de Firestore
                await deleteDoc(cursoRef);

                // 3. Elimina el curso del estado de Pinia
                this.cursos = this.cursos.filter(c => c.id !== cursoId);

            } catch (err) {
                console.error(`Error al eliminar curso ${cursoId}:`, err);
                this.error = "Fallo al eliminar el curso.";
            }
        }
    }
});