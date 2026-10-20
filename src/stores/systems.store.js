import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { systemsApi } from '@/api/systems.api'

export const useSystemsStore = defineStore('systems', () => {
  const systems = ref([])
  const loading = ref(false)
  const hasSystems = computed(() => Array.isArray(systems.value) && systems.value.length > 0)

  async function loadSystems() {
    loading.value = true

    try {
      const response = await systemsApi.getCurrent()

      systems.value = Array.isArray(response.data) ? response.data : []

      return systems.value
    } catch (error) {
      // No conservar accesos visibles si no fue posible validar la sesión actual.
      systems.value = []
      throw error
    } finally {
      loading.value = false
    }
  }



  function clearSystems() {
    systems.value = []
  }

  return {
    systems,
    loading,
    hasSystems,
    loadSystems,
    clearSystems,

  }
})
