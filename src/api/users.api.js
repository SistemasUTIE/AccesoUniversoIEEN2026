import { api } from '@/boot/axios'

export const usersApi = {
  async changePassword(passwords) {
    const response = await api.put('/Users/ChangePassword', passwords)
    const result = response.data

    if (result?.success === false) {
      throw new Error(result.message || 'No fue posible cambiar la contraseña.')
    }

    return result?.data ?? result
  },

  async getById(id) {
    const response = await api.get(`/Users/${encodeURIComponent(id)}`)
    const result = response.data

    if (!result?.success || !result.data) {
      throw new Error(result?.message || 'No fue posible obtener la información del usuario.')
    }

    return result.data
  },
}
