import { useAuthStore } from '../stores/auth.store'

export function authGuard(to, from, next) {
  const authStore = useAuthStore()
  const sessionExpired = authStore.isSessionExpired

  if (!authStore.validateSession()) {
    next({
      name: 'login',
      query: {
        redirect: to.fullPath,
        ...(sessionExpired ? { expired: '1' } : {}),
      },
    })
    return
  }

  next()
}

export function guestGuard(to, from, next) {
  const authStore = useAuthStore()

  if (authStore.validateSession()) {
    next(getSafeRedirect(to.query.redirect) || { name: 'home' })
    return
  }

  next()
}

export function getSafeRedirect(redirect) {
  const value = Array.isArray(redirect) ? redirect[0] : redirect
  if (typeof value !== 'string') return null

  const cleaned = value.trim()
  if (!cleaned.startsWith('/') || cleaned.startsWith('//') || cleaned.startsWith('/login')) {
    return null
  }

  return cleaned
}
