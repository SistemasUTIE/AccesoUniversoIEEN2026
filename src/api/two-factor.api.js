import { api } from '@/boot/axios'

export const twoFactorApi = {
  async enable(currentPassword, method = 'Email') {
    const response = await api.post('/TwoFactor/enable', { currentPassword, method })
    return validarRespuesta(
      response.data,
      'No fue posible iniciar la activación de la autenticación en dos pasos.',
    )
  },

  async confirm(code) {
    const response = await api.post('/TwoFactor/confirm', { code })
    return validarRespuesta(
      response.data,
      'No fue posible confirmar el código de autenticación.',
    )
  },

  async disable(currentPassword) {
    const response = await api.delete('/TwoFactor/disable', { data: { currentPassword } })
    return validarRespuesta(
      response.data,
      'No fue posible deshabilitar la autenticación en dos pasos.',
    )
  },
}

function validarRespuesta(result, defaultMessage) {
  if (result?.success === false) {
    throw new Error(result.message || defaultMessage)
  }

  return result?.data ?? result
}
