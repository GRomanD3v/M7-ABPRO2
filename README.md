# Documentación del Proyecto: Arquitectura de Autenticación (Vue 3, Pinia y Firebase)

Este documento describe la arquitectura y el flujo de autenticación implementado hasta la fecha para el sistema de administración de cursos "Adweb Online".

---

### 1. Stack Tecnológico

Frontend: Vue 3 (Composition API / VITE) - Interfaz de Usuario.

Gestión de Estado: Pinia - Almacenamiento centralizado y reactivo del estado de autenticación.

Base de Datos/Auth: Firebase Authentication - Gestión de usuarios, registro e inicio de sesión.

Routing: Vue Router 4 - Gestión de rutas y protección de rutas privadas (Guards).

Estilos: Bootstrap 5 - Componentes de UI y estilos generales.

---

### 2. Flujo de Autenticación Principal

El flujo de autenticación está orquestado por tres elementos principales que trabajan en conjunto:

src/stores/auth.js (Pinia Store): Centraliza la lógica de Firebase y el estado.

src/router/index.js (Router Guards): Protege las rutas privadas.

onAuthStateChanged (Firebase Observer): Sincroniza el estado de Firebase con Pinia.

### 2.1. Sincronización de Estado (onAuthStateChanged)

La lógica clave está en la inicialización de Firebase, donde se escucha cualquier cambio en el estado del usuario (inicio o cierre de sesión).

Mecanismo:

Se inicializa Firebase en el archivo principal.

Se establece un listener global de Firebase: onAuthStateChanged.

Cada vez que el usuario se loguea, desloguea, o la aplicación se recarga, este listener se dispara, actualizando el estado user en el Pinia Store.

El Router Guard utiliza el estado isAuthenticated del Store para decidir la navegación.

---

### 3. Componentes y Lógica (Vue/Pinia)

### A. Pinia Store: src/stores/auth.js

Este store maneja todo el estado reactivo y la comunicación directa con Firebase.

Estado Clave: user (objeto o null), isAuthenticated (getter), loading (boolean), error (string o null).

loginUser(email, password): Llama a signInWithEmailAndPassword. No realiza la redirección.

registerUser(email, password): Llama a createUserWithEmailAndPassword. No realiza la redirección.

logoutUser(): Llama a signOut(auth). El listener de Firebase se encarga de actualizar el estado. No realiza la redirección.

### B. Componentes de Acceso: Login.vue y Register.vue

Ambos componentes:

Llaman a la acción correspondiente del Store (authStore.loginUser() o authStore.registerUser()).

Redirección (Éxito): Si la acción del Store finaliza sin errores, el componente utiliza router.push({ name: 'home' }) para navegar a la vista principal.

Error: La plantilla muestra el mensaje de error capturado y almacenado en authStore.error.

### C. Home View: src/views/HomeView.vue

Esta vista es el punto de entrada para usuarios autenticados.

Cierre de Sesión: Define la función handleLogout que llama a authStore.logoutUser() y luego fuerza la redirección usando router.push({ name: 'login' }).

### D. Header: src/components/Header.vue

Es un componente presentacional.

El botón "Cerrar Sesión" emite un evento (@click="emit('logout')") al componente padre (HomeView.vue) para iniciar la lógica de cierre de sesión.

---

### 4. Protección de Rutas (Vue Router)

El archivo src/router/index.js incluye un Navigation Guard global (router.beforeEach) que implementa la protección de rutas.

Rutas Privadas (requiresAuth: true): Rutas como /home (y /admin a futuro) solo son accesibles si authStore.isAuthenticated es true. De lo contrario, redirige a /login.

Rutas Públicas (requiresAuth: false): Rutas como /login y /register solo son accesibles si authStore.isAuthenticated es false. Si el usuario ya está logueado, redirige a /home.