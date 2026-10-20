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
  }

}
