import { api } from '@/boot/axios'

export const municipalitiesApi = {
  async list() {
    const response = await api.get('/Municipalities')
    const result = response.data

    if (!result?.success || !Array.isArray(result.data)) {
      throw new Error(result?.message || 'No fue posible obtener los municipios.')
    }

    return result.data
  },
}
