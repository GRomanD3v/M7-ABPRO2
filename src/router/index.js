import { createRouter, createWebHistory } from 'vue-router';
// Importa el Store de Auth (debes importarlo de esta manera para usarlo fuera de un componente)
import { useAuthStore } from '../stores/auth'; 

// Definición de las rutas
const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/Login.vue'),
        meta: { requiresAuth: false } // No requiere autenticación
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../components/Register.vue'),
        meta: { requiresAuth: false } // No requiere autenticación
    },
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'), // Tu interfaz principal
        meta: { requiresAuth: true } // REQUIERE autenticación
    },
    // Añade el resto de tus rutas (cursos, detalle, etc.) y protégelas si es necesario
];

const router = createRouter({
    // CORRECCIÓN CLAVE: Usar import.meta.env en lugar de process.env
    // history: createWebHistory(process.env.BASE_URL),
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// 🔑 GUARDIA DE NAVEGACIÓN GLOBAL
router.beforeEach((to, from, next) => {
    // Solo accedemos al store dentro de beforeEach para asegurar que Pinia esté inicializado
    const authStore = useAuthStore(); 
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // Si la ruta requiere autenticación y el usuario NO está autenticado
    if (requiresAuth && !authStore.isAuthenticated) {
        // Redirige al login
        next({ name: 'login' });
    } 
    // Si el usuario ya está autenticado e intenta acceder a login o register
    else if (!requiresAuth && authStore.isAuthenticated && (to.name === 'login' || to.name === 'register')) {
        // Redirige al home
        next({ name: 'home' });
    }
    // Permite la navegación
    else {
        next();
    }
});

export default router;