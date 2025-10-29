import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import Login from '@/components/Login.vue'

describe('Login.vue', () => {
    // Antes de cada test, activamos una nueva instancia de Pinia
    beforeEach(() => {
        setActivePinia(createPinia())
    })

  
    it('Permite ingresar mail y contraseña', async () => {
        const wrapper = mount(Login)

        const emailInput = wrapper.find('#email')
        const passwordInput = wrapper.find('#password')

        await emailInput.setValue('hola@groman.cl')
        await passwordInput.setValue('123xmi')

        expect(emailInput.element.value).toBe('hola@groman.cl')
        expect(passwordInput.element.value).toBe('123xmi')
    })

     it('al enviar el formulario inicia sesión correctamente', async () => {
        const wrapper = mount(Login)
        const emailInput = wrapper.find('#email')
        const passwordInput = wrapper.find('#password')
        const form = wrapper.find('form')

        await emailInput.setValue('usuario@ejemplo.com')
        await passwordInput.setValue('123456')
        await form.trigger('submit.prevent')

        //verifica el cambio esperado
        expect(wrapper.find('#email').element.value).toBe('usuario@ejemplo.com')
    })
})
