import { auth } from '../firebase/init.js';
import { defineStore } from 'pinia';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword 
} from 'firebase/auth'; 

// 🚨 ESTABLECE AQUÍ TU CORREO DE ADMINISTRADOR REAL
// Reemplaza esta cadena con el email exacto que usaste para registrar la cuenta de admin en Firebase.
const ADMIN_EMAIL = 'hola@groman.cl'; 

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null, 
        loading: false, 
        error: null,
        isAuthReady: false, 
    }),
    
    getters: {
        isAuthenticated: (state) => !!state.user,
        // Lógica FINAL: Retorna true si el email del usuario logueado coincide con el ADMIN_EMAIL.
        isAdmin: (state) => {
            // Utilizamos el método toLowerCase() para evitar errores por mayúsculas/minúsculas.
            return state.user && state.user.email && state.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        }
    },

    actions: {
        // Inicializa el listener de Firebase Auth.
        initAuth() {
            if (this.isAuthReady) return; 
            this.loading = true;
            
            onAuthStateChanged(auth, (user) => { 
                this.user = user;
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
                return { success: true };
            } catch (err) {
                this.error = this.getFriendlyErrorMessage(err.code);
                console.error("Firebase Register Error:", err);
                return { success: false }; 
            } finally {
                this.loading = false;
            }
        },

        // Acción para el cierre de sesión 
        async logoutUser() {
            this.loading = true;
            this.error = null;
            try {
                await signOut(auth);
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
