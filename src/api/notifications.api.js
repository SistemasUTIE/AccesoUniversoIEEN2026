import { api } from '@/boot/axios'

function unwrap(response, fallbackMessage) {
  const result = response?.data
  if (result?.success === false) throw new Error(result.message || fallbackMessage)
  return result?.data ?? result
}

export const notificationsApi = {
  async getSummary() {
    return unwrap(
      await api.get('/SystemNotifications/summary'),
      'No fue posible obtener el resumen de notificaciones.',
    )
  },

  async getPaged(page = 1, pageSize = 20) {
    return unwrap(
      await api.get('/SystemNotifications/paged', { params: { page, pageSize } }),
      'No fue posible obtener las notificaciones.',
    )
  },

  async markRead(id) {
    return unwrap(
      await api.post(`/SystemNotifications/${encodeURIComponent(id)}/read`),
      'No fue posible marcar la notificación como leída.',
    )
  },

  async markUnread(id) {
    return unwrap(
      await api.post(`/SystemNotifications/${encodeURIComponent(id)}/unread`),
      'No fue posible marcar la notificación como no leída.',
    )
  },

  async markAllRead() {
    return unwrap(
      await api.post('/SystemNotifications/read-all'),
      'No fue posible marcar las notificaciones como leídas.',
    )
  },
}
