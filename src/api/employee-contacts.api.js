import { api } from '@/boot/axios'

export const employeeContactsApi = {
  async list(employeeId) {
    const response = await api.get(
      `/Employees/${encodeURIComponent(employeeId)}/contacts`,
    )
    const result = response.data

    if (result?.success === false) {
      throw new Error(result.message || 'No fue posible obtener los contactos.')
    }

    const data = result?.data ?? result
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.items)) return data.items
    if (Array.isArray(data?.contacts)) return data.contacts
    if (Array.isArray(data?.data)) return data.data
    return []
  },

  async create(employeeId, contact) {
    const response = await api.post(
      `/Employees/${encodeURIComponent(employeeId)}/contacts`,
      contact,
    )
    return response.data?.data ?? response.data
  },

  async update(employeeId, contactId, contact) {
    const response = await api.put(
      `/Employees/${encodeURIComponent(employeeId)}/contacts/${encodeURIComponent(contactId)}`,
      contact,
    )
    return response.data?.data ?? response.data
  },

  async remove(employeeId, contactId) {
    const response = await api.delete(
      `/Employees/${encodeURIComponent(employeeId)}/contacts/${encodeURIComponent(contactId)}`,
    )
    return response.data?.data ?? response.data
  },
}
