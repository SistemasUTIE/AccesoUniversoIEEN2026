import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { setItem, getItem, removeItem, setJson, getJson, storageKeys } from '../utils/storage'

import { authApi } from '@/api/auth.api'
import { useSystemsStore } from '@/stores/systems.store'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getItem(storageKeys.authToken))
  const user = ref(getJson(storageKeys.authUser))
  const expiration = ref(getItem(storageKeys.authExpiration))
  const itsBirthday = ref(false)

  const expirationTimestamp = computed(() => obtenerTimestamp(expiration.value))

  const isSessionExpired = computed(() => {
    if (!token.value) return false
    return !expirationTimestamp.value || Date.now() >= expirationTimestamp.value
  })

  const isAuthenticated = computed(() => {
    return Boolean(token.value) && !isSessionExpired.value
  })

  function validateSession() {
    if (isSessionExpired.value) {
      logout()
      return false
    }

    return isAuthenticated.value
  }

  async function login(credentials) {
    const response = await authApi.login(credentials)

    guardarSesion(response)

    return response
  }

  async function loadBirthday(fechaNacimiento) {
    const hoy = new Date()
    const [, mes, dia] = fechaNacimiento.split('-').map(Number)
    itsBirthday.value = (hoy.getMonth() + 1 === mes && hoy.getDate() === dia)
  }

  function guardarSesion(session) {
    if (!session?.token || !obtenerTimestamp(session.expiration)) {
      throw new Error('La respuesta de autenticación no contiene una sesión válida.')
    }

    token.value = session.token
    user.value = session.user ?? null
    expiration.value = session.expiration

    setItem(storageKeys.authToken, session.token)
    setJson(storageKeys.authUser, user.value)
    setItem(storageKeys.authExpiration, session.expiration)
  }

  function logout() {
    token.value = null
    user.value = null
    expiration.value = null

    removeItem(storageKeys.authToken)
    removeItem(storageKeys.authUser)
    removeItem(storageKeys.authExpiration)

    useSystemsStore().clearSystems()
  }

  return {
    token,
    user,
    expiration,
    isAuthenticated,
    isSessionExpired,
    itsBirthday,
    validateSession,
    login,
    guardarSesion,
    logout,
    loadBirthday
  }
})

function obtenerTimestamp(expiration) {
  if (expiration === null || expiration === undefined || expiration === '') return null

  const value = String(expiration).trim()
  if (!value) return null

  if (/^\d+$/.test(value)) {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return null
    return numericValue < 100000000000 ? numericValue * 1000 : numericValue
  }

  const parsedValue = Date.parse(value)
  return Number.isNaN(parsedValue) ? null : parsedValue
}
