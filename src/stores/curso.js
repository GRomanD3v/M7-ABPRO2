import { defineStore } from 'pinia';
import { db } from '../firebase/init'; // Importa la instancia de Firestore
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    deleteDoc, 
    doc, 
    updateDoc 
} from 'firebase/firestore'; 

export const useCursoStore = defineStore('curso', {
    state: () => ({
        // Lista principal de cursos
        cursos: [],
        // Indica si los cursos se están cargando
        loadingCourses: false, 
        // Mensaje de error para operaciones de cursos
        error: null,
        // Listener de Firestore (para desuscribirse cuando no sea necesario)
        unsubscribe: null, 
    }),
    
    getters: {
        // Devuelve la lista de cursos disponibles
        cursosDisponibles: (state) => state.cursos,
    },

    actions: {
        // 1. OBTENER CURSOS EN TIEMPO REAL (onSnapshot)
        // Esta acción DEBE ser llamada para iniciar la escucha de la base de datos.
        iniciarListenerCursos() {
            if (this.unsubscribe) return; // Evitar iniciar múltiples listeners

            this.loadingCourses = true;
            this.error = null;
            
            // Referencia a la colección 'cursos' en Firestore
            const cursosCollectionRef = collection(db, 'cursos');

            // onSnapshot es la clave para la lectura en tiempo real
            this.unsubscribe = onSnapshot(cursosCollectionRef, (snapshot) => {
                const cursosArray = [];
                snapshot.forEach((doc) => {
                    // Mapeamos los datos, añadiendo el 'id' de Firestore
                    cursosArray.push({ id: doc.id, ...doc.data() }); 
                });
                
                this.cursos = cursosArray;
                this.loadingCourses = false;
                console.log('Cursos actualizados desde Firestore.');
            }, (err) => {
                // Manejo de errores del listener
                this.error = 'Error al obtener los cursos: ' + err.message;
                this.loadingCourses = false;
                console.error("Firestore Listener Error:", err);
            });
        },
        
        // Función para detener la escucha de cursos (útil al cerrar sesión o desmontar el HomeView)
        detenerListenerCursos() {
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
                console.log('Listener de cursos detenido.');
            }
        },

        // 2. CREAR CURSO (Add)
        async agregarCurso(nuevoCurso) {
            try {
                const cursosCollection = collection(db, 'cursos');
                // Añade una marca de tiempo y cualqiuer otro campo por defecto
                const cursoConMetadatos = {
                    ...nuevoCurso,
                    createdAt: new Date().toISOString(), //Opcional marca de tiempo
                };

                const docRef = await addDoc(cursosCollection, cursoConMetadatos);
                // Nota: Con la implementación de onSnapshot/listener, la actualización 
                // del estado 'this.cursos.push(...)' es manejada automáticamente por el listener,
                // pero si tuvieras que hacerlo manualmente sería así:
                /*
                    this.cursos.push({ 
                        id: docRef.id, 
                        ...cursoConMetadatos 
                });
                */

                // devuelve éxito
                return { success: true, id: docRef.id };

            } catch (err) {
            console.error("Error al agregar curso:", err);
            this.error = "Fallo al crear el curso.";
            // Devuelve error
            return { success: false, error: err.message };
            }
        },

        // 3. ACTUALIZAR CURSO (updateDoc)
        async editarCurso(id, newData) {
            this.error = null;
            this.loadingCourses = true;
            try {
                // Referencia al documento específico
                const cursoRef = doc(db, 'cursos', id);
                await updateDoc(cursoRef, newData);
                // onSnapshot se encarga de la actualización de estado
                return { success: true };
            } catch (err) {
                this.error = 'Error al editar el curso.';
                console.error("Firestore Update Error:", err);
                return { success: false, error: this.error };
            } finally {
                this.loadingCourses = false;
            }
        },

        // 4. ELIMINAR CURSO (deleteDoc)
        async eliminarCurso(id) {
            this.error = null;
            this.loadingCourses = true;
            try {
                const cursoRef = doc(db, 'cursos', id);
                await deleteDoc(cursoRef);
                // onSnapshot se encarga de la actualización de estado
                return { success: true };
            } catch (err) {
                this.error = 'Error al eliminar el curso.';
                console.error("Firestore Delete Error:", err);
                return { success: false, error: this.error };
            } finally {
                this.loadingCourses = false;
            }
        },
    }
});