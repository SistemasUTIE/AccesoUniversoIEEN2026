import { api } from '@/boot/axios'

export const systemsApi = {

  async getCurrent() {
    const response = await api.get('/SystemUsers/current')

    if (!response.data.success) {
      throw new Error(
        response.data.message || 'No fue posible obtener los sistemas.'
      )
    }
    console.log('respuesta', response.data)
    return response.data
  }

}
