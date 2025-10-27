import { defineStore } from 'pinia';
import { db } from '../firebase/init'; // Importa la instancia de Firestore
import { collection, onSnapshot, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';


const CURSOS_COLLECTION = 'cursos';

export const useCursoStore = defineStore('curso', {
    state: () => ({
        // Lista principal de cursos
        cursos: [],
        // Indica si los cursos se están cargando
        loading: true,
        // Almacenamos la función de unsubscribe para detener la escucha
        unsub: null, 
    }),
    
    getters: {
        // Devuelve la lista de cursos disponibles
        cursosDisponibles: (state) => state.cursos,
        loadingCourses: (state) => state.loading,
        getCursoById: (state) => (id) => state.cursos.find(c => c.id === id),
    },

    actions: {
        // --- Lógica del Listener ---
        iniciarListenerCursos() {
            if (this.unsub) {
                // El listener ya está activo, no hacemos nada
                return;
            }

            this.loading = true;
            const cursosQuery = query(collection(db, CURSOS_COLLECTION));
            
            // Guardamos la función de unsubscribe en this.unsub
            this.unsub = onSnapshot(cursosQuery, (snapshot) => {
                const cursosArray = [];
                snapshot.forEach((doc) => {
                    cursosArray.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                this.cursos = cursosArray;
                this.loading = false;
            }, (error) => {
                console.error("Firestore Listener Error:", error);
                // Si hay error (como el de permisos), lo detenemos para evitar bucles
                this.detenerListenerCursos(); 
            });
        },

        //Detiene el listener de Firestore 
        detenerListenerCursos() {
            if (this.unsub) {
                this.unsub(); // Ejecuta la función para detener la escucha
                this.unsub = null; // Limpiamos la referencia
                console.log("Firestore Listener detenido correctamente.");
            }
        },

        // --- Lógica CRUD ---
        async agregarCurso(nuevoCurso) {
            try {
                const cursosCollection = collection(db, CURSOS_COLLECTION);
                
                const cursoConMetadatos = { 
                    ...nuevoCurso, 
                    createdAt: new Date().toISOString(), 
                };

                const docRef = await addDoc(cursosCollection, cursoConMetadatos);

                return { success: true, id: docRef.id }; 

            } catch (err) {
                console.error("Error al agregar curso:", err);
                return { success: false, error: err };
            }
        },
        
        async actualizarCurso(id, data) {
             try {
                const cursoRef = doc(db, CURSOS_COLLECTION, id);
                await updateDoc(cursoRef, data);
                return { success: true };
            } catch (error) {
                console.error("Error al actualizar curso:", error);
                return { success: false, error: error };
            }
        },

        async eliminarCurso(id) {
            try {
                const cursoRef = doc(db, CURSOS_COLLECTION, id);
                await deleteDoc(cursoRef);
                return { success: true };
            } catch (error) {
                console.error("Error al eliminar curso:", error);
                return { success: false, error: error };
            }
        }
    }
});
