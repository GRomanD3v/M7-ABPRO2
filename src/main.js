import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
//Importar Firebase Auth y Store
import { auth } from './firebase/init'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuthStore } from './stores/auth'


import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'


// 1. Crear la instancia de vuetify
const vuetify = createVuetify({ components, directives })



// 1. Crear la instancia de Pinia
const pinia = createPinia()

// 2. Crear la instancia de la aplicación (guardarla en una variable 'app')
const app = createApp(App)

// 3. Aplicar Pinia y Router a la aplicación ANTES de montarla

app.use(pinia)
app.use(router)
app.use(vuetify)

//Mantener sesión activa al iniciar la aplicación
const authStore = useAuthStore()
await authStore.initAuth();

/*
onAuthStateChanged(auth, (user) => {
    if (user) {
        authStore.user = user
        console.log('Usuario ingresó correctamente:', user.mail)
    } else {
        authStore.user = null
        console.log('Usuario salió del sistema')
    }
})
    */

// 4. Montar la aplicación
app.mount('#app')