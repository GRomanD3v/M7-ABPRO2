# 📚 Adweb Online: Plataforma de Administración de Cursos
 ## Repositorio: https://github.com/GRomanD3v/M7-ABPRO2
 ### Integrantes: 
 - María Teresa De La Fuente
 - Daniela Garrido
 - Gonzalo Román R.
---

Este proyecto es una aplicación web de página única (SPA) desarrollada con Vue 3 (Vite), utilizando Pinia para la gestión de estados y Firebase/Firestore como backend de autenticación y base de datos en tiempo real.

---

### 🎯 Requerimientos Cumplidos del Proyecto

A continuación, se detalla el cumplimiento de cada requisito funcional del proyecto:

### Autenticación y Seguridad
- Requisito: Enlace con Firestore y Google Account.
- Cumplimiento: CUMPLIDO. La aplicación se inicializa con la configuración de Firebase y utiliza tanto Authentication como Firestore.
- Requisito: Crear interfaz de acceso (Login y Registro).

- Cumplimiento: CUMPLIDO. Se han diseñado las vistas para manejar los formularios de acceso.
- Requisito: Validación por correo y clave (Solo usuarios registrados).

- Cumplimiento: CUMPLIDO. La lógica de Pinia utiliza las funciones de Firebase Auth y las rutas están protegidas por Vue Router y guards.

- Requisito: Implementar el método createUserWithEmailAndPassword en Registro.

- Cumplimiento: CUMPLIDO. La acción registerUser en src/stores/auth.js utiliza este método.

- Requisito: Utilizar el método signInWithEmailAndPassword en Login.

- Cumplimiento: CUMPLIDO. La acción loginUser en src/stores/auth.js utiliza este método.

- Requisito: Emplear el método signOut en la barra de navegación.

- Cumplimiento: CUMPLIDO. La acción logoutUser en src/stores/auth.js ejecuta signOut(auth).

- Requisito: Aplicar el método onAuthStateChanged para identificar el ingreso o salida.

- Cumplimiento: CUMPLIDO. Implementado en la acción initAuth de src/stores/auth.js.

- Requisito: Agregar una ventana modal o mensaje indicando que el usuario ingresó correctamente desde onAuthStateChanged.

- Cumplimiento: CUMPLIDO (Vía Notificación Toast). Se muestra un mensaje de éxito (Toast) tras el login/registro para confirmar el ingreso.

### Vistas y Navegación

- Requisito: Al validar, desplegar "Home" con cards de cursos.

- Cumplimiento: CUMPLIDO. El usuario es redirigido a HomeView.vue, donde se listan los cursos de Firestore.

- Requisito: Menú de navegación (NavBar) con correo de usuario y botón de cierre de sesión.

- Cumplimiento: CUMPLIDO. Implementado en Header.vue.

- Requisito: Al cerrar sesión, redirigir inmediatamente a "Login".

- Cumplimiento: CUMPLIDO. Manejado por el guard de Vue Router al cambiar el estado de autenticación en Pinia.

- Requisito: Utilizar Vue Router para controlar y proteger las rutas.

- Cumplimiento: CUMPLIDO. Se utilizan guards y redireccionamientos para el flujo de la aplicación.

---

## 🚀 Características Principales

El proyecto se compone de los siguientes módulos:

### Autenticación:

- Funcionalidad: Registro, Login y Cierre de Sesión seguro. Roles definidos (Admin / Usuario).

- Tecnologías Clave: Firebase Auth, Pinia Store (useAuthStore).

### CRUD de Cursos:

- Funcionalidad: Creación, Lectura (en tiempo real), Edición y Eliminación de cursos.

- Tecnologías Clave: Firestore, Pinia Store (useCursoStore).

### Navegación:

- Funcionalidad: Rutas protegidas (guards) y navegación dinámica en el Header según el rol.

- Tecnologías Clave: Vue Router, Propiedad isAdmin.

### UX/UI:

- Funcionalidad: Componentes modales y sistema de notificaciones Toast para feedback al usuario.

- Tecnologías Clave: Vue Components, Pinia Store (useNotificationStore).

---

### 🛠️ Configuración y Ejecución del Proyecto

### Requisitos

- Node.js (versión recomendada LTS)

- Una cuenta de Firebase con Firestore y Authentication habilitados.

### 1. Clonar el Repositorio e Instalar Dependencias

- git clone [https://github.com/GRomanD3v/M7-ABPRO2]
- cd adweb-online
- npm install


### 2. Configuración de Firebase

- Abre src/firebase/init.js y reemplaza los placeholders con tu configuración real de Firebase:

```// src/firebase/init.js
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    // ... otros campos
};
```

### 3. Definición del Rol de Administrador

- Para que la aplicación reconozca a un usuario como administrador, debes configurar el getter isAdmin en tu Pinia Store.

- Abre src/stores/auth.js y actualiza la variable ADMIN_EMAIL con el correo que usaste para registrar tu cuenta de administrador:

```
// src/stores/auth.js
// ...
const ADMIN_EMAIL = 'tu_correo_de_admin_aqui@dominio.com';

getters: {
    isAdmin: (state) => {
        return state.user && state.user.email === ADMIN_EMAIL;
    },
    // ...
}
// ...
```

### 4. Ejecutar la Aplicación

- npm run dev


### 🔑 Flujo de Administración (Navegación Dinámica)

- La funcionalidad clave del proyecto se basa en la segregación de roles y la navegación condicional en el Header.vue.

- Acceso al Panel de Administración

- Inicia sesión con la cuenta definida como Administrador (ADMIN_EMAIL).

- Una vez logueado, el componente Header.vue detectará el rol isAdmin: true.

- El botón "Panel Admin" aparecerá en el encabezado.

### Lógica del Header.vue

- El Header.vue maneja la visibilidad de los botones de navegación según la vista actual del usuario:

- Si la Vista Actual es / (home):

- Botón Visible: Panel Admin (Botón Amarillo)

- Acción: Navega a /admin

- Si la Vista Actual es /admin (admin) o /admin/editar/:id:

- Botón Visible: Ver Cursos (Botón Azul)

- Acción: Navega de vuelta a /

- Proceso CRUD (Creación, Edición y Eliminación)

### Crear un Curso:

- En la vista /admin, haz clic en "Agregar Nuevo Curso".

- Se abre el CourseModal.vue.

- Al guardar, se ejecuta cursoStore.agregarCurso(data), enviando el nuevo documento a la colección cursos de Firestore.

### Edición de Curso:

- Desde la tabla en /admin, el botón de lápiz redirige a /admin/editar/:id.

- EditCourseView.vue carga el formulario pre-llenado y ejecuta la acción de actualización.

### Eliminación de Curso:

- El botón de bote de basura en /admin ejecuta la acción cursoStore.eliminarCurso(id) tras una confirmación.

---
### 💡 Notas de Implementación

- Real-Time (Tiempo Real): La vista HomeView y AdminView utilizan el listener onSnapshot de Firestore, asegurando que cualquier cambio en la base de datos se refleje en la UI inmediatamente.

- Notificaciones: Todas las operaciones CRUD utilizan el useNotificationStore para mostrar mensajes de éxito o error (Toast/Toastr) en lugar de usar alert().

### Tests Unitarios
1. **Login.spec.js** - Verifica que el componente Login.vue funcione correctamente para iniciar sesión con correo y contraseña.
Busca garantizar que el usuario pueda ingresar sus credenciales y que los campos del formulario se comporten correctamente. Pruebas incluidas:
- Ingreso de datos:
  Simula la escritura de correo y contraseña en los campos del formulario y verifica que los valores se actualicen correctamente.

- Envío del formulario: 
  Dispara el evento 'submit' del formulario y comprueba que los valores ingresados coincidan con los esperados, simulando el inicio de sesión.

2. **AdminView.spec.js** - Verifica la funcionalidad de eliminar un curso en el componente AdminVue.vue. Busca garantizar que los cursos puedan ser eliminados correctamente y que la interfaz refleje la acción del usuario. Pruebas incluidas:


- Preparación del store: 
  - Inicializa Pinia y agrega un curso de prueba en el store 'cursoStore'.  
  - Mockea la función 'eliminarCurso' para simular la eliminación exitosa sin afectar la base de datos real.

- Eliminación de curso: 
  1. Abre el modal de confirmación para eliminar el curso.  
  2. Confirma la eliminación.  
  3. Verifica que 'eliminarCurso' haya sido llamado con el ID correcto.  
  4. Comprueba que el modal se cierre y que no queden cursos pendientes en 'pendingDeleteCourse'.

#### Consideraciones adicionales
- Se utiliza **Vitest** como test runner y **Vue Test Utils** para montar los componentes.  
- Se activa una instancia de **Pinia** antes de cada test con 'beforeEach' para simular el store y evitar errores de dependencias.  
- Los tests son **unitarios**, enfocándose en la lógica interna de cada componente sin interactuar con la base de datos real.
