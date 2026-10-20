const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

function getStorage() {
  return canUseStorage() ? window.localStorage : null
}

export const storageKeys = {
  authToken: 'token',
  authUser: 'user',
  authExpiration: 'expiration',
}

export function setItem(key, value) {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.setItem(key, String(value))
  } catch {
    // La sesión en memoria debe seguir funcionando si el navegador bloquea el storage.
  }
}

export function getItem(key, fallback = null) {
  const storage = getStorage()
  if (!storage) return fallback

  try {
    return storage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function removeItem(key) {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.removeItem(key)
  } catch {
    // No bloquear el cierre de sesión cuando el almacenamiento no está disponible.
  }
}

export function setJson(key, value) {
  setItem(key, JSON.stringify(value))
}

export function getJson(key) {
  const value = getItem(key)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
