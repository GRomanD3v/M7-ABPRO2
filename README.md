# DOCUMENTACIÓN TÉCNICA DEL PROYECTO: ADWEB ONLINE

1.	VISIÓN GENERAL DEL PROYECTO
Este proyecto es una aplicación web de lista de cursos construida con Vue 3 (Composition API) y Pinia para la gestión del estado, utilizando Firebase Authentication para la gestión de usuarios. El siguiente paso es integrar Firebase Firestore para manejar la lista dinámica de cursos.

2.	ARQUITECTURA DE LA APLICACIÓN
El proyecto sigue una arquitectura estándar de Vue:
•	src/views: Contenedores de página (HomeView.vue) que usan componentes y lógica de negocio.
•	src/components: Componentes de UI reutilizables (Login.vue, Register.vue, Header.vue) y específicos de formulario.
•	src/stores: Módulo de gestión de estado centralizado (Pinia) (auth.js).
•	src/router: Definición de rutas y la Guardia de Navegación Global (index.js).
•	src/firebase: Inicialización de los servicios de Firebase (Auth y Firestore) (init.js).
3.	LÓGICA CLAVE: AUTENTICACIÓN (AUTH STORE)
Toda la gestión de usuarios (Login, Registro, Cierre de Sesión y Persistencia) se maneja en el Pinia Store (src/stores/auth.js).
3.1. Estructura del Estado (state):
•	user: Contiene el objeto de usuario de Firebase (User | null).
•	isAuthenticated: Booleano reactivo que indica si hay una sesión activa.
•	loading: Controla el estado de las peticiones a Firebase (usado para deshabilitar botones).
•	error: Almacena los mensajes de error de Firebase para mostrar en la UI.
3.2. Acciones Principales:
•	registerUser(email, password) / loginUser(email, password): Ejecutan los métodos de Firebase. En caso de éxito, actualizan el estado y redirigen a /home.
•	logoutUser(): Cierra la sesión de Firebase y redirige a /login.
•	initAuth(): Usa onAuthStateChanged para escuchar la sesión del usuario y asegurar la persistencia de sesión al recargar la página.
3.3. Componentes Asociados:
•	Login.vue / Register.vue: Llama a las acciones del Store y usa las variables loading y error para controlar la interfaz del formulario.
4.	FLUJO DE NAVEGACIÓN (ROUTER GUARD)
El archivo src/router/index.js contiene la lógica de enrutamiento y el control de acceso.
4.1. Rutas Clave:
•	/login y /register: Acceso público (requiresAuth: false).
•	/home: Requiere autenticación (requiresAuth: true).
4.2. Guardia de Navegación (router.beforeEach):
•	Protección de Rutas: Si la ruta requiere autenticación y el usuario NO está autenticado, es redirigido a /login.
•	Protección de la Sesión: Si el usuario ya está autenticado e intenta acceder a /login o /register, es redirigido a /home para evitar redundancia.
5.	COMPONENTES DE UI CREADOS
•	Header.vue: Barra de navegación superior. Acepta la Prop: userName (String). Emite el Evento: logout.
•	HomeView.vue: Vista principal de la aplicación. Muestra la lista de cursos. Usa el AuthStore y pronto el Firestore.
•	Login.vue: Formulario para iniciar sesión. Usa el AuthStore.
•	Register.vue: Formulario para crear nuevas cuentas. Usa el AuthStore.
6.	PRÓXIMOS PASOS (PENDIENTES)
La siguiente prioridad es implementar la capa de datos real para reemplazar los datos ficticios en HomeView.vue.
•	
1.	Implementar Lógica de Firestore: Crear conexión y listener onSnapshot para la colección de cursos.
•	
2.	Mostrar Cursos Dinámicamente: Reemplazar los datos de ejemplo en HomeView.vue con los datos reales.
•	
3.	Manejar Estados de Carga: Añadir un spinner o mensaje mientras se obtienen los datos de Firestore.

