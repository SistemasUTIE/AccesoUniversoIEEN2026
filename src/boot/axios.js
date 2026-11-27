import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

export const API_BASE_URL = import.meta.env.QCLI_API_BASE_URL || 'http://sistema.ieenayarit.org:9884/api'

const api = axios.create({ baseURL: API_BASE_URL })

let redirectingForExpiredSession = false

function redirectToLogin(router, { expired = false } = {}) {
  if (redirectingForExpiredSession) return

  const currentRoute = router.currentRoute.value
  if (currentRoute?.name === 'login') return

  redirectingForExpiredSession = true

  const query = {}
  if (currentRoute?.fullPath) {
    query.redirect = currentRoute.fullPath
  }
  if (expired) {
    query.expired = '1'
  }

  router.replace({ name: 'login', query }).finally(() => {
    redirectingForExpiredSession = false
  })
}

// ---------------------------------------
// Response interceptor
// ---------------------------------------

export default boot(({ app, router }) => {
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()
      const sessionExpired = authStore.isSessionExpired

      if (!authStore.validateSession()) {
        redirectToLogin(router, { expired: sessionExpired })
        return config
      }

      config.headers.Authorization = `Bearer ${authStore.token}`

      return config
    },
    (error) => Promise.reject(error),
  )

  api.interceptors.response.use(
    (response) => {
      return response
    },

    (error) => {
      const authStore = useAuthStore()
      const hadSession = Boolean(authStore.token)

      if (error.response?.status === 401 && hadSession && !redirectingForExpiredSession) {
        authStore.logout()
        redirectToLogin(router, { expired: true })
      }

      return Promise.reject(error)
    },
  )

  // Axios disponible globalmente
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
