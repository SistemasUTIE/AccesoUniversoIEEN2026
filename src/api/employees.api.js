import { api } from '@/boot/axios'

export const employeesApi = {
  async getById(id) {
    const response = await api.get(`/Employees/${encodeURIComponent(id)}`)
    const result = response.data

    if (!result?.success || !result.data) {
      throw new Error(result?.message || 'No fue posible obtener la información del empleado.')
    }

    return result.data
  },

  async update(id, employee) {
    const response = await api.put(`/Employees/${encodeURIComponent(id)}`, employee)
    const result = response.data

    if (result?.success === false) {
      throw new Error(result.message || 'No fue posible actualizar la información del empleado.')
    }

    return result?.data ?? result
  },
}
