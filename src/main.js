import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router';

// 1. Crear la instancia de Pinia
const pinia = createPinia()

// 2. Crear la instancia de la aplicación (guardarla en una variable 'app')
const app = createApp(App)

// 3. Aplicar Pinia y Router a la aplicación ANTES de montarla
app.use(pinia)
app.use(router)

// 4. Montar la aplicación
app.mount('#app')