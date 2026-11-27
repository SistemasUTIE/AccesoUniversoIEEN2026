import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr'
import { notificationsApi } from '@/api/notifications.api'
import { useAuthStore } from '@/stores/auth.store'
import { API_BASE_URL } from '@/boot/axios'



const HUB_ROUTE = 'hubs/notifications'
const PAGE_SIZE = 20
const MAX_NOTIFICATIONS = 200
const RECONNECT_DELAYS = [0, 2000, 10000, 30000]
const RESTART_DELAY = 30000


function resolveHubUrl() {
  const apiUrl = new URL(API_BASE_URL, window.location.origin)
  const base = apiUrl.href.endsWith('/') ? apiUrl.href : `${apiUrl.href}/`
  return new URL(HUB_ROUTE, base).toString()
}


function readProperty(source, names) {
  for (const name of names) {
    if (source?.[name] !== undefined && source?.[name] !== null) return source[name]
  }
  return undefined
}

function normalizeBoolean(value) {
  if (value === true || value === 1) return true
  return ['true', '1'].includes(String(value ?? '').trim().toLowerCase())
}

function normalizeNotification(item, index = 0) {
  const id = readProperty(item, ['id', 'Id', 'notificationId', 'NotificationId'])
  const title = readProperty(item, ['title', 'Title'])
  const message = readProperty(item, ['message', 'Message', 'description', 'Description'])

  return {
    id: String(id ?? `notification-${index}-${Date.now()}`),
    systemName: readProperty(item, ['systemName', 'SystemName']) || '',
    type: readProperty(item, ['type', 'Type']) || '',
    moduleName: readProperty(item, ['moduleName', 'ModuleName', 'moduleAcronym', 'ModuleAcronym']) || '',
    routeName: readProperty(item, ['routeName', 'RouteName', 'targetRoute', 'TargetRoute']) || '',
    targetUrl: readProperty(item, ['targetUrl', 'TargetUrl', 'path', 'Path', 'url', 'Url']) || '',
    title: typeof title === 'string' && title.trim() ? title.trim() : 'Notificación',
    message: typeof message === 'string' && message.trim() ? message.trim() : 'Tienes una nueva notificación.',
    recordId: readProperty(item, ['recordId', 'RecordId']) || null,
    isRead: normalizeBoolean(readProperty(item, ['isRead', 'IsRead'])),
    createdAt: readProperty(item, ['createdAt', 'CreatedAt']) || null,
    readAt: readProperty(item, ['readAt', 'ReadAt']) || null,
  }
}

function getPageItems(result) {
  if (Array.isArray(result)) return result

  const nestedData = readProperty(result, ['data', 'Data'])
  if (Array.isArray(nestedData)) return nestedData

  const items = readProperty(result, ['items', 'Items', 'results', 'Results', 'notifications', 'Notifications'])
  return Array.isArray(items) ? items : []
}

function getHasMore(result, page, pageSize, itemCount) {
  const pagination = readProperty(result, ['pagination', 'Pagination', 'meta', 'Meta']) || result
  const explicitHasMore = readProperty(pagination, ['hasNextPage', 'HasNextPage', 'hasMore', 'HasMore', 'hasNext', 'HasNext'])
  if (explicitHasMore !== undefined) return normalizeBoolean(explicitHasMore)

  const totalPages = Number(readProperty(pagination, ['totalPages', 'TotalPages', 'pageCount', 'PageCount']))
  if (Number.isFinite(totalPages) && totalPages > 0) return page < totalPages

  const totalCount = Number(readProperty(pagination, ['totalCount', 'TotalCount', 'total', 'Total']))
  if (Number.isFinite(totalCount) && totalCount >= 0) return page * pageSize < totalCount

  return itemCount >= pageSize
}

function getUnreadCount(summary) {
  if (typeof summary === 'number') return summary

  const value = readProperty(summary, [
    'unreadCount', 'UnreadCount', 'unreadNotificationsCount', 'UnreadNotificationsCount',
    'unreadNotifications', 'UnreadNotifications', 'totalUnreadCount', 'TotalUnreadCount',
    'unreadTotal', 'UnreadTotal', 'totalUnread', 'TotalUnread', 'notReadCount', 'NotReadCount',
    'unread', 'Unread',
  ])
  const count = Number(value)
  return Number.isFinite(count) && count >= 0 ? count : null
}

export function useNotificationsHub() {
  const authStore = useAuthStore()
  const $q = useQuasar()
  const status = ref('disconnected')
  const notifications = ref([])
  const unreadCount = ref(0)
  const hasUnreadNotifications = computed(() =>
    unreadCount.value > 0 || notifications.value.some((notification) => !notification.isRead),
  )
  const visibleUnreadCount = computed(() =>
    unreadCount.value || notifications.value.filter((notification) => !notification.isRead).length,
  )
  const currentPage = ref(1)
  const hasMoreNotifications = ref(false)
  const isLoadingNotifications = ref(false)
  const isLoadingMoreNotifications = ref(false)
  const isMarkingAllRead = ref(false)
  const updatingNotificationIds = ref([])
  const notificationsError = ref('')
  const isConnected = computed(() => status.value === 'connected')

  let connection = null
  let generation = 0
  let retryTimer = null
  let disposed = false
  let loadSequence = 0
  let lastLoggedToken = ''
  const realtimeNotificationIds = new Set()

  function getSignalRAccessToken() {
    const token = authStore.token || localStorage.getItem('token') || ''
    const localDevelopment = import.meta.env.DEV &&
      ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)

    if (localDevelopment && token && token !== lastLoggedToken) {
      console.info('[NotificationsHub] Token enviado a SignalR (solo desarrollo local):', token)
      lastLoggedToken = token
    }

    return token
  }

  function clearRetryTimer() {
    if (retryTimer !== null) {
      window.clearTimeout(retryTimer)
      retryTimer = null
    }
  }

  async function refreshSummary() {
    const summary = await notificationsApi.getSummary()
    const count = getUnreadCount(summary)
    if (count !== null) unreadCount.value = count
  }

  async function refreshNotifications() {
    if (!authStore.isAuthenticated) return

    const requestSequence = ++loadSequence
    isLoadingNotifications.value = true
    notificationsError.value = ''

    const [summaryResult, pageResult] = await Promise.allSettled([
      notificationsApi.getSummary(),
      notificationsApi.getPaged(1, PAGE_SIZE),
    ])

    if (disposed || requestSequence !== loadSequence) return

    if (summaryResult.status === 'fulfilled') {
      const count = getUnreadCount(summaryResult.value)
      if (count !== null) unreadCount.value = count
    }

    if (pageResult.status === 'fulfilled') {
      const pageItems = getPageItems(pageResult.value)
      const refreshedNotifications = pageItems.slice(0, MAX_NOTIFICATIONS).map(normalizeNotification)
      const refreshedIds = new Set(refreshedNotifications.map((notification) => notification.id))
      const pendingRealtimeNotifications = notifications.value.filter((notification) =>
        realtimeNotificationIds.has(notification.id) && !refreshedIds.has(notification.id),
      )
      notifications.value = [...pendingRealtimeNotifications, ...refreshedNotifications]
        .slice(0, MAX_NOTIFICATIONS)
      refreshedNotifications.forEach((notification) => realtimeNotificationIds.delete(notification.id))
      currentPage.value = 1
      hasMoreNotifications.value = getHasMore(pageResult.value, 1, PAGE_SIZE, pageItems.length)
    } else {
      notificationsError.value = 'No fue posible cargar las notificaciones.'
    }

    isLoadingNotifications.value = false
  }

  async function loadMoreNotifications() {
    if (!hasMoreNotifications.value || isLoadingMoreNotifications.value || !authStore.isAuthenticated) return

    const nextPage = currentPage.value + 1
    const requestSequence = ++loadSequence
    isLoadingMoreNotifications.value = true
    notificationsError.value = ''

    try {
      const result = await notificationsApi.getPaged(nextPage, PAGE_SIZE)
      if (disposed || requestSequence !== loadSequence) return

      const pageItems = getPageItems(result).map(normalizeNotification)
      const knownIds = new Set(notifications.value.map((item) => item.id))
      notifications.value = [...notifications.value, ...pageItems.filter((item) => !knownIds.has(item.id))]
        .slice(0, MAX_NOTIFICATIONS)
      currentPage.value = nextPage
      hasMoreNotifications.value = notifications.value.length < MAX_NOTIFICATIONS &&
        getHasMore(result, nextPage, PAGE_SIZE, pageItems.length)
    } catch {
      notificationsError.value = 'No fue posible cargar más notificaciones.'
    } finally {
      if (requestSequence === loadSequence) isLoadingMoreNotifications.value = false
    }
  }

  function showActionError(error, fallback) {
    $q.notify({
      type: 'negative',
      message: error?.response?.data?.message || error?.message || fallback,
      position: 'top-right',
    })
  }

  function handleNotificationCreated(payload) {
    const data = readProperty(payload, ['data', 'Data', 'notification', 'Notification']) || payload
    const notification = normalizeNotification(data)
    const hasStableId = readProperty(data, ['id', 'Id', 'notificationId', 'NotificationId'])
    const alreadyKnown = hasStableId && notifications.value.some((item) => item.id === notification.id)

    if (hasStableId && !alreadyKnown) {
      realtimeNotificationIds.add(notification.id)
      notifications.value = [notification, ...notifications.value]
        .slice(0, MAX_NOTIFICATIONS)
      if (!notification.isRead) unreadCount.value += 1
    }

    if (!alreadyKnown) {
      const reason = readProperty(data, ['reason', 'Reason', 'motive', 'Motive', 'motivo', 'Motivo']) ||
        [notification.title, notification.message].filter(Boolean).join(' — ')

      $q.notify({
        type: 'positive',
        icon: 'notifications_active',
        position: 'top-right',
        timeout: 7000,
        message: 'Nueva notificación',
        caption: `Motivo: ${reason}`,
      })
    }

      window.dispatchEvent(
        new CustomEvent('ieen:notification-created', { detail: notification }),
      )
    }

    void refreshNotifications()

  async function updateNotificationReadState(notification) {
    if (!authStore.isAuthenticated || !notification?.id || updatingNotificationIds.value.includes(notification.id)) return

    const markAsRead = !notification.isRead
    const sessionToken = authStore.token
    updatingNotificationIds.value = [...updatingNotificationIds.value, notification.id]
    try {
      if (markAsRead) await notificationsApi.markRead(notification.id)
      else await notificationsApi.markUnread(notification.id)
      if (!authStore.isAuthenticated || authStore.token !== sessionToken) return

      notification.isRead = markAsRead
      notification.readAt = markAsRead ? new Date().toISOString() : null
      unreadCount.value = Math.max(0, unreadCount.value + (markAsRead ? -1 : 1))
      void refreshSummary().catch(() => { })
    } catch (error) {
      showActionError(error, markAsRead
        ? 'No fue posible marcar la notificación como leída.'
        : 'No fue posible marcar la notificación como no leída.')
    } finally {
      updatingNotificationIds.value = updatingNotificationIds.value.filter((id) => id !== notification.id)
    }
  }

  async function markAllNotificationsRead() {
    if (!authStore.isAuthenticated || isMarkingAllRead.value || !hasUnreadNotifications.value) return

    const sessionToken = authStore.token
    isMarkingAllRead.value = true
    try {
      await notificationsApi.markAllRead()
      if (!authStore.isAuthenticated || authStore.token !== sessionToken) return
      notifications.value = notifications.value.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt || new Date().toISOString(),
      }))
      unreadCount.value = 0
      void refreshSummary().catch(() => { })
    } catch (error) {
      showActionError(error, 'No fue posible marcar las notificaciones como leídas.')
    } finally {
      isMarkingAllRead.value = false
    }
  }

  function scheduleRestart(currentGeneration) {
    if (disposed || retryTimer !== null || currentGeneration !== generation) return

    retryTimer = window.setTimeout(() => {
      retryTimer = null
      if (disposed || currentGeneration !== generation || !authStore.isAuthenticated) return
      if (connection && connection.state !== HubConnectionState.Disconnected) return

      const token = getSignalRAccessToken()
      if (!token) return
      void startConnection(token, currentGeneration)
    }, RESTART_DELAY)
  }

  async function startConnection(token, currentGeneration) {
    if (disposed || currentGeneration !== generation || !token) return

    status.value = 'connecting'
    let currentConnection = null
    let hubUrl = ''
    try {
      hubUrl = resolveHubUrl()
      console.info('[NotificationsHub] Intentando conectar', {
        url: hubUrl,
        tokenDisponible: Boolean(authStore.token || localStorage.getItem('token')),
        autenticacion: 'Bearer mediante accessTokenFactory',
      })

      currentConnection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: getSignalRAccessToken,
          withCredentials: false,
        })
        .withAutomaticReconnect(RECONNECT_DELAYS)
        .configureLogging(import.meta.env.DEV ? LogLevel.Warning : LogLevel.Error)
        .build()

      connection = currentConnection
      currentConnection.on('notificationCreated', handleNotificationCreated)
      currentConnection.onreconnecting(() => {
        if (connection === currentConnection) status.value = 'reconnecting'
      })
      currentConnection.onreconnected(() => {
        if (connection !== currentConnection || currentGeneration !== generation) return
        status.value = 'connected'
        void refreshNotifications()
      })
      currentConnection.onclose(() => {
        if (disposed || connection !== currentConnection || currentGeneration !== generation) return
        connection = null
        status.value = 'disconnected'
        scheduleRestart(currentGeneration)
      })

      await currentConnection.start()
      if (disposed || currentGeneration !== generation) {
        await currentConnection.stop()
        return
      }
      status.value = 'connected'
      console.info('[NotificationsHub] Conexión establecida', { url: hubUrl })
      void refreshNotifications()
    } catch (error) {
      if (disposed || currentGeneration !== generation) {
        if (currentConnection) await currentConnection.stop().catch(() => { })
        return
      }
      if (currentConnection && connection === currentConnection) connection = null
      status.value = 'error'
      if (currentConnection) await currentConnection.stop().catch(() => { })
      console.warn(`[NotificationsHub] No se pudo conectar a ${hubUrl || '(URL no resuelta)'}:`, error)
      scheduleRestart(currentGeneration)
    }
  }

  async function syncConnection(token) {
    const currentGeneration = ++generation
    loadSequence += 1
    clearRetryTimer()
    status.value = 'disconnected'
    isLoadingNotifications.value = false
    isLoadingMoreNotifications.value = false
    updatingNotificationIds.value = []
    isMarkingAllRead.value = false

    const previousConnection = connection
    connection = null
    if (previousConnection) await previousConnection.stop().catch(() => { })

    if (disposed || currentGeneration !== generation) return
    if (!token) {
      notifications.value = []
      realtimeNotificationIds.clear()
      unreadCount.value = 0
      notificationsError.value = ''
      lastLoggedToken = ''
      return
    }

    notifications.value = []
    realtimeNotificationIds.clear()
    unreadCount.value = 0
    notificationsError.value = ''
    void refreshNotifications()
    await startConnection(token, currentGeneration)
  }

  watch(
    [() => authStore.token, () => authStore.isAuthenticated],
    ([token, authenticated]) => void syncConnection(authenticated ? token : null),
    { immediate: true },
  )

  onBeforeUnmount(() => {
    disposed = true
    generation += 1
    loadSequence += 1
    clearRetryTimer()
    const activeConnection = connection
    connection = null
    if (activeConnection) void activeConnection.stop().catch(() => { })
  })

  return {
    status,
    isConnected,
    notifications,
    unreadCount,
    visibleUnreadCount,
    hasUnreadNotifications,
    hasMoreNotifications,
    isLoadingNotifications,
    isLoadingMoreNotifications,
    isMarkingAllRead,
    updatingNotificationIds,
    notificationsError,
    refreshNotifications,
    loadMoreNotifications,
    updateNotificationReadState,
    markAllNotificationsRead,
  }
}
