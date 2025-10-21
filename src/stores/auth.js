import { auth } from '../firebase/init';
import { defineStore } from 'pinia';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword 
} from 'firebase/auth'; 

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // El objeto de usuario de Firebase o null
        user: null, 
        // Bandera para mostrar spinners
        loading: false, 
        // Mensaje de error para la UI
        error: null,
        // Bandera para indicar si la verificación inicial de Auth ha terminado
        isAuthReady: false, 
    }),
    
    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        // Inicializa el listener de Firebase Auth. DEBE llamarse una vez en main.js o App.vue
        initAuth() {
            if (this.isAuthReady) return; // Evita inicializar dos veces
            this.loading = true;
            
            // onAuthStateChanged escucha la persistencia de la sesión de Firebase
            onAuthStateChanged(auth, (user) => { 
                this.user = user;
                this.userId = user.uid;
                this.isAuthReady = true;
                this.loading = false;
                console.log('Auth state changed. User:', user ? user.email : 'None');
            });
        },

        // Acción para el inicio de sesión
        async loginUser(email, password) {
            this.loading = true;
            this.error = null;
            try {
                // Usamos la instancia 'auth' importada para iniciar sesión
                await signInWithEmailAndPassword(auth, email, password); 
            } catch (err) {
                this.error = this.getFriendlyErrorMessage(err.code); 
                console.error("Firebase Login Error:", err);
            } finally {
                this.loading = false;
            }
        },
        
        // Acción para el registro de usuario
        async registerUser(email, password) {
            this.loading = true;
            this.error = null;
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (err) {
                this.error = this.getFriendlyErrorMessage(err.code);
                console.error("Firebase Register Error:", err);
            } finally {
                this.loading = false;
            }
        },

        // Acción para el cierre de sesión (SIN REDIRECCIÓN AQUÍ)
        async logoutUser() {
            this.loading = true;
            this.error = null;
            try {
                // Solo llama a signOut de Firebase
                await signOut(auth);
                
                // onAuthStateChanged detectará el cambio y establecerá this.user = null.
            } catch (err) {
                this.error = 'No se pudo cerrar la sesión.';
                console.error("Firebase Logout Error:", err);
            } finally {
                this.loading = false;
            }
        },
        
        // Helper para traducir códigos de error de Firebase
        getFriendlyErrorMessage(errorCode) {
            switch (errorCode) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    return 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
                case 'auth/email-already-in-use':
                    return 'El correo electrónico ya está registrado.';
                case 'auth/weak-password':
                    return 'La contraseña debe tener al menos 6 caracteres.';
                default:
                    return 'Ocurrió un error inesperado. Intente de nuevo.';
            }
        }
    }
});
