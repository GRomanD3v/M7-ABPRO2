import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import AdminVue from '@/views/AdminView.vue'
import { useCursoStore } from '@/stores/curso'

describe('AdminVue.vue - Eliminar curso', () => {
  let cursoStore

  beforeEach(() => {
    setActivePinia(createPinia())
    cursoStore = useCursoStore()

    // mock de la función eliminarCurso
    cursoStore.eliminarCurso = vi.fn().mockResolvedValue({ success: true })

    // Agregamos un curso de prueba
    cursoStore.cursos = [
      { id: 'curso1', nombre: 'Curso de Prueba', codigo: '001', precio: 1000, inscritos: 0, cupos: 10, estado: true }
    ]
  })

  it('abre el modal y llama a eliminarCurso al confirmar', async () => {
    const wrapper = mount(AdminVue)

    // Abrir modal de eliminar
    await wrapper.vm.openDeleteModal('curso1', 'Curso de Prueba')
    expect(wrapper.vm.isConfirmDeleteModalOpen).toBe(true)
    expect(wrapper.vm.pendingDeleteCourse.nombre).toBe('Curso de Prueba')

    // Confirmar eliminación
    await wrapper.vm.confirmDeleteCourse()

    // Verificar que eliminarCurso fue llamado con el id correcto
    expect(cursoStore.eliminarCurso).toHaveBeenCalledWith('curso1')
    expect(wrapper.vm.isConfirmDeleteModalOpen).toBe(false)
    expect(wrapper.vm.pendingDeleteCourse).toBe(null)
  })
})