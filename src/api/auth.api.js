import { api } from '@/boot/axios'

export const authApi = {

  async login(credentials) {

    const response = await api.post(
      '/Auth/login',
      credentials
    )

    const result = response.data
    if (!result.success) {
      throw new Error(
        result.message || 'Error al iniciar sesión'
      )
    }

    return result.data
  },

  async completeTwoFactorLogin(challenge) {
    const response = await api.post('/Auth/two-factor', challenge)
    const result = response.data

    if (!result.success) {
      throw new Error(result.message || 'No fue posible verificar el código de doble factor.')
    }

    return result.data
  },

}
