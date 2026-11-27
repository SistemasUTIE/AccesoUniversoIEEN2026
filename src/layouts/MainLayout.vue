<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="main-header">
      <q-toolbar class="main-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Abrir menú"
          class="nav-menu-button"
          @click="toggleLeftDrawer"
        />

        <div class="toolbar-brand" aria-label="Universo IEEN">
          <q-avatar square size="36px" class="toolbar-brand__mark">
            <q-icon name="how_to_vote" size="22px" />
          </q-avatar>

          <div class="toolbar-brand__copy">
            <strong>Universo IEEN</strong>
            <span>Acceso institucional</span>
          </div>
        </div>

        <q-space />

        <div class="notification-connection" role="status" aria-live="polite">
          <span class="notification-connection__dot" :class="{ 'notification-connection__dot--connected': isConnected }" aria-hidden="true"></span>
          <span>{{
            status === 'connected'
              ? 'Conectado'
              : status === 'connecting'
                ? 'Conectando'
                : status === 'reconnecting'
                  ? 'Reconectando'
                  : status === 'error'
                    ? 'Error al conectar'
                    : 'Desconectado'
          }}</span>
        </div>

        <q-btn
          round
          flat
          icon="notifications_none"
          :aria-label="visibleUnreadCount ? `Notificaciones, ${visibleUnreadCount} sin leer` : 'Notificaciones'"
          class="notifications-button"
        >
          <q-badge v-if="visibleUnreadCount" color="negative" floating rounded>
            {{ visibleUnreadCount > 99 ? '99+' : visibleUnreadCount }}
          </q-badge>

          <q-menu anchor="bottom right" self="top right" @show="refreshNotifications">
            <q-card flat class="notifications-menu">
              <q-card-section class="notifications-menu__heading">
                <div>
                  <strong>Notificaciones</strong>
                  <span>{{ visibleUnreadCount }} sin leer</span>
                </div>
                <q-icon :name="isConnected ? 'cloud_done' : 'cloud_off'" :color="isConnected ? 'positive' : 'negative'" />
              </q-card-section>
              <q-separator />
              <q-list v-if="notifications.length" separator class="notifications-menu__list">
                <q-item v-for="notification in notifications" :key="notification.id" class="notifications-menu__item" :class="{ 'notifications-menu__item--unread': !notification.isRead }">
                  <q-item-section avatar>
                    <q-icon :name="notification.isRead ? 'drafts' : 'mark_email_unread'" :color="notification.isRead ? 'grey-6' : 'primary'" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="notifications-menu__title">{{ notification.title }}</q-item-label>
                    <q-item-label v-if="notification.systemName" caption>{{ notification.systemName }}</q-item-label>
                    <q-item-label class="notifications-menu__message" lines="3">{{ notification.message }}</q-item-label>
                    <q-item-label caption>{{ formatNotificationDate(notification.createdAt) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side class="notifications-menu__actions">
                                    <q-btn
                  v-if="notification.systemName"
                  flat
                  dense
                  no-caps
                  color="primary"
                  icon="open_in_new"
                  label="Ir"
                  :aria-label="`Ir al sistema ${notification.systemName}`"
                  @click.stop="goToNotificationSystem(notification)"
                />
<q-btn
                      flat
                      round
                      dense
                      :icon="notification.isRead ? 'mark_email_unread' : 'mark_email_read'"
                      :aria-label="notification.isRead ? 'Marcar como no leída' : 'Marcar como leída'"
                      :disable="updatingNotificationIds.includes(notification.id)"
                      :loading="updatingNotificationIds.includes(notification.id)"
                      @click.stop="updateNotificationReadState(notification)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else-if="isLoadingNotifications" class="notifications-menu__empty">
                <q-spinner color="primary" size="24px" />
                <span>Cargando notificaciones…</span>
              </div>
              <div v-else-if="notificationsError" class="notifications-menu__empty notifications-menu__empty--error">
                <q-icon name="error_outline" size="24px" />
                <span>{{ notificationsError }}</span>
                <q-btn flat dense no-caps label="Reintentar" @click="refreshNotifications" />
              </div>
              <div v-else class="notifications-menu__empty">
                <q-icon name="notifications_off" size="24px" />
                <span>Aún no hay notificaciones.</span>
              </div>
              <q-card-section v-if="hasUnreadNotifications" class="notifications-menu__bulk-action">
                <q-btn
                  flat
                  dense
                  no-caps
                  color="primary"
                  label="Marcar todas como leídas"
                  :loading="isMarkingAllRead"
                  @click="markAllNotificationsRead"
                />
              </q-card-section>
              <q-card-actions v-if="hasMoreNotifications" align="center" class="notifications-menu__pagination">
                <q-btn flat dense no-caps color="primary" label="Cargar anteriores" :loading="isLoadingMoreNotifications" @click="loadMoreNotifications" />
              </q-card-actions>
            </q-card>
          </q-menu>
        </q-btn>

        <q-btn
          flat
          no-caps
          icon="logout"
          label="Cerrar sesión"
          aria-label="Cerrar sesión"
          class="nav-logout-button"
          @click="logoutDialogOpen = true"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="main-drawer">
      <div v-if="itsBirthday" class="birthday-confetti" aria-hidden="true">
        <span
          v-for="n in 35"
          :key="n"
          class="confetti-piece"
          :class="`confetti-piece--${(n % 4) + 1}`"
        ></span>
      </div>

      <div class="drawer-content">
        <section class="user-welcome" aria-label="Información de sesión">
          <q-avatar size="48px" class="user-welcome__avatar">
            <q-icon :name="itsBirthday ? 'cake' : 'person'" size="27px" />
          </q-avatar>

          <div class="user-welcome__content">
            <span class="user-welcome__greeting">Bienvenido(a)</span>
            <strong class="user-welcome__name">{{ userDisplayName }}</strong>
          </div>
        </section>

        <q-separator class="drawer-separator" />

        <nav aria-label="Navegación principal">
          <div class="drawer-brand">
            <div class="drawer-brand__eyebrow text-center">UNIVERSO IEEN</div>
          </div>

          <q-list class="drawer-menu" padding>
            <q-item :to="{ name: 'home' }" exact clickable active-class="drawer-menu__item--active">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Menú principal</q-item-label>
                <q-item-label caption>Mis sistemas</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              :to="{ name: 'profile' }"
              exact
              clickable
              active-class="drawer-menu__item--active"
            >
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Mi perfil</q-item-label>
                <q-item-label caption>Información de cuenta</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </nav>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="logoutDialogOpen" persistent>
      <q-card class="logout-dialog">
        <q-card-section class="logout-dialog__content">
          <div class="logout-dialog__icon">
            <q-icon name="logout" size="30px" />
          </div>

          <div class="logout-dialog__title">¿Cerrar sesión?</div>

          <div class="logout-dialog__message">¿Estás seguro de que deseas cerrar tu sesión?</div>
        </q-card-section>

        <q-card-actions class="logout-dialog__actions">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            class="logout-dialog__cancel"
            @click="logoutDialogOpen = false"
          />

          <q-btn
            unelevated
            no-caps
            label="Cerrar sesión"
            icon-right="logout"
            class="logout-dialog__confirm"
            @click="confirmLogout"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationsHub } from '@/composables/useNotificationsHub'
import { useSystemsStore } from '@/stores/systems.store'

const leftDrawerOpen = ref(false)
const logoutDialogOpen = ref(false)

const router = useRouter()

const authStore = useAuthStore()
const systemsStore = useSystemsStore()
const { itsBirthday } = storeToRefs(authStore)
const {
  status,
  isConnected,
  notifications,
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
} = useNotificationsHub()

const userDisplayName = computed(() => {
  const user = authStore.user
  return user?.fullName || user?.name || user?.userName || user?.username || 'Usuario'
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function confirmLogout() {
  authStore.logout()
  router.replace({ name: 'login' })
}

async function goToNotificationSystem(notification) {
  const targetName = normalizeNotificationSystemName(notification?.systemName)
  if (!targetName) return
  try {
    if (!systemsStore.systems.length) await systemsStore.loadSystems()
    const system = systemsStore.systems.find((item) => normalizeNotificationSystemName(item.systemName || item.name) === targetName)
    if (!system?.url || !authStore.token) return
    const systemUrl = new URL(system.url, window.location.origin)
    const basePath = systemUrl.pathname.replace(/\/+$/, '')
    if (
      systemUrl.origin === window.location.origin &&
      (window.location.pathname === basePath || window.location.pathname.startsWith(`${basePath}/`))
    ) {
      const route = resolveLocalNotificationRoute(notification)
      if (route) await router.push(route)
      return
    }
    const url = new URL(system.url, window.location.origin)
    url.searchParams.set('key', authStore.token)
    url.searchParams.set('system', system.systemName || system.name)
    window.location.assign(url.toString())
  } catch (error) {
    console.error('No fue posible abrir el sistema de origen:', error)
  }
}

function resolveLocalNotificationRoute(notification) {
  if (notification?.routeName && router.hasRoute(notification.routeName)) {
    return { name: notification.routeName }
  }
  const targetUrl = String(notification?.targetUrl || '').trim()
  if (targetUrl) {
    try {
      const destination = new URL(targetUrl, window.location.origin)
      if (destination.origin === window.location.origin) {
        return `${destination.pathname}${destination.search}${destination.hash}`
      }
    } catch {
      // Usa los datos de la notificación para localizar la sección.
    }
  }
  const hint = normalizeNotificationSystemName(
    [notification?.moduleName, notification?.type, notification?.title, notification?.message]
      .filter(Boolean)
      .join(' '),
  )
  if (hint.includes('dato personal')) return { name: 'Datos_Personales' }
  if (hint.includes('perfil')) return { name: 'profile' }
  return { name: 'home' }
}

function normalizeNotificationSystemName(value) {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

function formatNotificationDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString()
}

onMounted(async () => {
  try {
    const employee = await authStore.loadEmployee()
    await authStore.loadBirthday(employee.birthDate)
  } catch (error) {
    console.error('No fue posible cargar la información del empleado:', error)
  }
})
</script>

<style scoped>
.main-header {
  background: #fff;
  border-bottom: 3px solid #c45c91;
  box-shadow: 0 4px 16px rgba(82, 82, 90, 0.12);
}

.main-toolbar {
  min-height: 68px;
  padding: 0 28px;
}

.nav-menu-button {
  margin-right: 14px;
  color: #9d3f73;
  background: #f9edf3;
}

.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.toolbar-brand__mark {
  flex-shrink: 0;
  background: #c45c91;
  color: #fff;
  box-shadow: 0 4px 10px rgba(196, 92, 145, 0.26);
}

.toolbar-brand__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.toolbar-brand__copy strong {
  color: #52525a;
  font-size: 0.98rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  line-height: 1.1;
}

.toolbar-brand__copy span {
  margin-top: 3px;
  color: #ad5c89;
  font-size: 0.67rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.nav-logout-button {
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid #e8b8d0;
  border-radius: 9px;
  color: #9d3f73;
  background: #fff8fb;
  font-size: 0.8rem;
  font-weight: 700;
}

.notification-connection {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-right: 12px;
  color: #625b67;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.notification-connection__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #c62828;
  box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.12);
}

.notification-connection__dot--connected {
  background: #2e7d32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
}

.notifications-button {
  margin-right: 10px;
  color: #6b3c87;
}

.notifications-menu {
  width: 360px;
  max-width: calc(100vw - 24px);
  max-height: min(70vh, 520px);
}

.notifications-menu__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.notifications-menu__bulk-action {
  padding: 0 12px 8px;
  text-align: right;
}

.notifications-menu__heading strong,
.notifications-menu__heading span {
  display: block;
}

.notifications-menu__heading strong {
  color: #302936;
  font-size: 0.95rem;
}

.notifications-menu__heading span {
  margin-top: 2px;
  color: #817986;
  font-size: 0.72rem;
}

.notifications-menu__list {
  max-height: calc(min(70vh, 520px) - 58px);
  overflow-y: auto;
}

.notifications-menu__item {
  min-height: 76px;
  padding: 12px 16px;
}

.notifications-menu__item--unread {
  background: #f8f4fa;
}

.notifications-menu__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  padding-left: 8px;
}

.notifications-menu__title {
  color: #38313d;
  font-weight: 700;
}

.notifications-menu__message {
  margin-top: 3px;
  color: #625b67;
  line-height: 1.4;
}

.notifications-menu__empty {
  display: flex;
  min-height: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #817986;
  font-size: 0.82rem;
}

.notifications-menu__empty--error {
  color: #9b1c31;
}

.notifications-menu__pagination {
  padding: 4px 12px 10px;
}

.nav-logout-button:hover {
  background: #f8e5ef;
}

.main-drawer {
  color: #443d47;
}

.drawer-content {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  padding: 24px 14px;
  background: #fff;
}

.drawer-brand {
  padding: 4px 12px 24px;
}

.drawer-brand__eyebrow,
.drawer-section-title {
  color: #9e306d;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.drawer-brand__title {
  margin-top: 5px;
  color: #302936;
  font-size: 1.2rem;
  font-weight: 800;
}

.user-welcome {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 4px;
  padding: 15px 14px;
  border: 1px solid #e9e1e7;
  border-radius: 14px;
  background: #faf5f8;
}

.user-welcome__avatar {
  flex-shrink: 0;
  background: #9e306d;
  color: #fff;
}

.user-welcome__content {
  min-width: 0;
}

.user-welcome__greeting,
.user-welcome__name {
  display: block;
}

.user-welcome__greeting {
  color: #766c76;
  font-size: 0.72rem;
  font-weight: 600;
}

.user-welcome__name {
  overflow: hidden;
  margin-top: 2px;
  color: #3c3440;
  font-size: 0.9rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-separator {
  margin: 24px 12px 18px;
  background: #ece7ed;
}

.drawer-section-title {
  padding: 0 16px 8px;
}

.drawer-menu {
  padding: 0;
}

.drawer-menu :deep(.q-item) {
  min-height: 58px;
  margin: 4px 0;
  border-radius: 10px;
  color: #514a54;
}

.drawer-menu :deep(.q-item__section--avatar) {
  min-width: 42px;
  color: #867b87;
}

.drawer-menu :deep(.q-item__label) {
  font-size: 0.86rem;
  font-weight: 700;
}

.drawer-menu :deep(.q-item__label--caption) {
  margin-top: 2px;
  color: #908791;
  font-size: 0.72rem;
  font-weight: 500;
}

.drawer-menu :deep(.drawer-menu__item--active) {
  background: #f7eff4;
  color: #8d2b62;
}

.drawer-menu :deep(.drawer-menu__item--active .q-item__section--avatar) {
  color: #9e306d;
}

.drawer-menu__item--pending {
  cursor: default;
}

/* ========================================
   CONFETI DE CUMPLEAÑOS
   ======================================== */

.main-drawer {
  position: relative;
  overflow: hidden;
}

.birthday-confetti {
  position: absolute;
  inset: 0;
  z-index: 5;

  overflow: hidden;

  pointer-events: none;
}

/* Cada pieza */

.confetti-piece {
  position: absolute;
  top: -20px;

  width: 6px;
  height: 12px;

  opacity: 0;

  animation:
    confetti-fall 5s linear infinite,
    confetti-sway 2.2s ease-in-out infinite alternate;
}

/* Colores */

.confetti-piece--1 {
  background: #532680;
}

.confetti-piece--2 {
  background: #c45c91;
}

.confetti-piece--3 {
  background: #52525a;
}

.confetti-piece--4 {
  background: #95909b;
}

/* ========================================
   POSICIONES
   ======================================== */

.confetti-piece:nth-child(1) {
  left: 4%;
  animation-delay: 0s;
}
.confetti-piece:nth-child(2) {
  left: 9%;
  animation-delay: 1.4s;
}
.confetti-piece:nth-child(3) {
  left: 14%;
  animation-delay: 2.8s;
}
.confetti-piece:nth-child(4) {
  left: 19%;
  animation-delay: 0.7s;
}
.confetti-piece:nth-child(5) {
  left: 24%;
  animation-delay: 3.1s;
}
.confetti-piece:nth-child(6) {
  left: 29%;
  animation-delay: 1.8s;
}
.confetti-piece:nth-child(7) {
  left: 34%;
  animation-delay: 4s;
}
.confetti-piece:nth-child(8) {
  left: 39%;
  animation-delay: 2.3s;
}
.confetti-piece:nth-child(9) {
  left: 44%;
  animation-delay: 0.4s;
}
.confetti-piece:nth-child(10) {
  left: 49%;
  animation-delay: 3.5s;
}
.confetti-piece:nth-child(11) {
  left: 54%;
  animation-delay: 1.2s;
}
.confetti-piece:nth-child(12) {
  left: 59%;
  animation-delay: 4.3s;
}
.confetti-piece:nth-child(13) {
  left: 64%;
  animation-delay: 2.1s;
}
.confetti-piece:nth-child(14) {
  left: 69%;
  animation-delay: 0.9s;
}
.confetti-piece:nth-child(15) {
  left: 74%;
  animation-delay: 3.7s;
}
.confetti-piece:nth-child(16) {
  left: 79%;
  animation-delay: 1.6s;
}
.confetti-piece:nth-child(17) {
  left: 84%;
  animation-delay: 4.5s;
}
.confetti-piece:nth-child(18) {
  left: 89%;
  animation-delay: 2.6s;
}
.confetti-piece:nth-child(19) {
  left: 94%;
  animation-delay: 0.2s;
}

.confetti-piece:nth-child(20) {
  left: 6%;
  animation-delay: 3.3s;
}
.confetti-piece:nth-child(21) {
  left: 16%;
  animation-delay: 1.1s;
}
.confetti-piece:nth-child(22) {
  left: 27%;
  animation-delay: 4.1s;
}
.confetti-piece:nth-child(23) {
  left: 38%;
  animation-delay: 2.9s;
}
.confetti-piece:nth-child(24) {
  left: 47%;
  animation-delay: 0.6s;
}
.confetti-piece:nth-child(25) {
  left: 57%;
  animation-delay: 3.9s;
}
.confetti-piece:nth-child(26) {
  left: 68%;
  animation-delay: 1.9s;
}
.confetti-piece:nth-child(27) {
  left: 77%;
  animation-delay: 4.7s;
}
.confetti-piece:nth-child(28) {
  left: 87%;
  animation-delay: 2.4s;
}
.confetti-piece:nth-child(29) {
  left: 97%;
  animation-delay: 0.8s;
}
.confetti-piece:nth-child(30) {
  left: 32%;
  animation-delay: 3.6s;
}
.confetti-piece:nth-child(31) {
  left: 52%;
  animation-delay: 1.5s;
}
.confetti-piece:nth-child(32) {
  left: 72%;
  animation-delay: 4.2s;
}
.confetti-piece:nth-child(33) {
  left: 82%;
  animation-delay: 2.7s;
}
.confetti-piece:nth-child(34) {
  left: 12%;
  animation-delay: 0.3s;
}
.confetti-piece:nth-child(35) {
  left: 92%;
  animation-delay: 3s;
}

/* ========================================
   CAÍDA
   ======================================== */

@keyframes confetti-fall {
  0% {
    top: -20px;
    opacity: 0;
    transform: rotate(0deg);
  }

  10% {
    opacity: 0.8;
  }

  90% {
    opacity: 0.7;
  }

  100% {
    top: 105%;
    opacity: 0;
    transform: rotate(360deg);
  }
}

/* Movimiento lateral */

@keyframes confetti-sway {
  0% {
    margin-left: -8px;
  }

  100% {
    margin-left: 8px;
  }
}

@media (max-width: 600px) {
  .main-toolbar {
    min-height: 60px;
    padding: 0 16px;
  }

  .toolbar-brand__copy span {
    display: none;
  }

  .nav-logout-button {
    min-width: 38px;
    padding: 0;
  }

  .notification-connection {
    gap: 0;
    margin-right: 6px;
  }

  .notification-connection > span:last-child {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .notifications-button {
    margin-right: 4px;
  }

  .nav-logout-button :deep(.q-btn__content) {
    font-size: 0;
  }

  .nav-logout-button :deep(.q-icon) {
    margin: 0;
    font-size: 20px;
  }
}
.logout-dialog {
  width: 100%;
  max-width: 420px;

  border: 1px solid #e7e3e9;
  border-radius: 20px;

  background: #fff;

  box-shadow: 0 20px 50px rgba(42, 31, 49, 0.16);

  overflow: hidden;
}

.logout-dialog__content {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 34px 32px 24px;

  text-align: center;
}

.logout-dialog__icon {
  display: flex;

  width: 68px;
  height: 68px;

  align-items: center;
  justify-content: center;

  margin-bottom: 20px;

  border-radius: 50%;

  background: #f7eff4;
  color: #9e306d;
}

.logout-dialog__title {
  color: #2c2631;

  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.3;
}

.logout-dialog__message {
  max-width: 310px;

  margin-top: 9px;

  color: #756f79;

  font-size: 0.88rem;
  line-height: 1.55;
}

.logout-dialog__actions {
  display: flex;

  justify-content: center;

  gap: 10px;

  padding: 16px 28px 28px;
}

.logout-dialog__cancel {
  min-height: 40px;

  padding: 0 18px;

  border-radius: 9px;

  color: #756f79;

  font-size: 0.82rem;
  font-weight: 700;
}

.logout-dialog__cancel:hover {
  background: #f7f5f7;
}

.logout-dialog__confirm {
  min-height: 40px;

  padding: 0 18px;

  border-radius: 9px;

  background: #9e306d;
  color: #fff;

  font-size: 0.82rem;
  font-weight: 700;

  box-shadow: 0 5px 12px rgba(158, 48, 109, 0.2);
}

.logout-dialog__confirm:hover {
  background: #8d2b62;
}
</style>
