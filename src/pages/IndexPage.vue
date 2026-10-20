<template>
  <q-page class="systems-page" :class="{ 'systems-page--birthday': itsBirthday }">
    <div class="systems-container">
      <!-- ENCABEZADO -->

      <div class="systems-header">
        <div class="systems-header__content">
          <h1>Mis sistemas</h1>

          <p>Selecciona un sistema para comenzar a trabajar.</p>
        </div>

        <div v-if="hasSystems" class="systems-counter">
          <q-icon name="apps" size="20px" />
          <span
            >{{ systems.length }}
            {{ systems.length === 1 ? 'sistema disponible' : 'sistemas disponibles' }}</span
          >
        </div>
      </div>

      <!-- CARGANDO -->

      <div v-if="loading" class="systems-loading">
        <q-spinner-dots size="42px" color="primary" />

        <div>
          <strong>Preparando tu espacio de trabajo</strong>
          <span>Cargando sistemas disponibles...</span>
        </div>
      </div>

      <!-- SIN SISTEMAS -->

      <div v-else-if="!hasSystems" class="systems-empty">
        <div class="systems-empty__icon">
          <q-icon name="apps" size="42px" />
        </div>

        <div class="systems-empty__title">No tienes sistemas disponibles</div>

        <div class="systems-empty__text">Actualmente no tienes sistemas habilitados.</div>
      </div>

      <!-- SISTEMAS -->

      <div v-else class="systems-grid">
        <q-card
          v-for="system in systems"
          :key="system.id"
          class="system-card"
          flat
          bordered
          clickable
          @click="openSystem(system)"
        >
          <q-card-section class="system-card__main">
            <div class="system-card__icon" aria-hidden="true">
              <q-icon name="dashboard_customize" size="42px" />
            </div>

            <div class="system-info">
              <div class="system-name">
                {{ system.systemName }}
              </div>

              <div class="system-description">
                {{ system.description }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useSystemsStore } from '@/stores/systems.store'
import { useAuthStore } from '@/stores/auth.store'
const systemsStore = useSystemsStore()
const authStore = useAuthStore()
const { itsBirthday } = storeToRefs(authStore)
const { systems, loading, hasSystems } = storeToRefs(systemsStore)

const $q = useQuasar()

onMounted(async () => {
  try {
    await systemsStore.loadSystems()
  } catch (error) {
    console.error('Error al cargar los sistemas del usuario:', error)

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message || error.message || 'No fue posible cargar tus sistemas.',
      icon: 'error',
      position: 'top-right',
    })
  }
})

function openSystem(system) {
  $q.loading.show({
    message: 'redirigiendo al sistema...',
    spinnerColor: 'primary',
    spinnerSize: 42,
  })

  const url = new URL(system.url, window.location.origin)
  url.searchParams.set('key', authStore.token)
  url.searchParams.set('system', system.systemName)

  window.location.assign(url.toString())
}
</script>

<style scoped>
.systems-page {
  min-height: 100%;
  padding: 40px 28px 56px;
  background: #f7f7fa;
}

.systems-container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.systems-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 0 2px 30px;
}

.systems-overline {
  color: #9e306d;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.systems-header h1 {
  margin: 7px 0 8px;
  color: #292431;
  font-size: clamp(2rem, 4vw, 2.55rem);
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.systems-header p {
  margin: 0;
  color: #706b76;
  font-size: 0.97rem;
}

.systems-counter {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  padding: 10px 14px;
  border: 1px solid #e6e1e9;
  border-radius: 10px;
  background: #fff;
  color: #5f5164;
  font-size: 0.8rem;
  font-weight: 700;
}

.systems-counter .q-icon {
  color: #9e306d;
}

.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ========================================
   TARJETA DEL SISTEMA
   ======================================== */

.system-card {
  display: flex;
  min-height: 278px;
  flex-direction: column;
  overflow: hidden;

  border-color: #e7e3e9;
  border-radius: 16px;
  background: #fff;

  box-shadow: 0 3px 12px rgba(42, 31, 49, 0.045);

  cursor: pointer;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.system-card:hover {
  border-color: rgba(158, 48, 109, 0.38);
  box-shadow: 0 14px 28px rgba(42, 31, 49, 0.1);
  transform: translateY(-3px);
}

.system-card:active {
  transform: translateY(-1px);
}

/* Contenido principal de la tarjeta */

.system-card__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 28px 24px;

  text-align: center;
}

/* Icono */

.system-card__icon {
  display: flex;
  width: 72px;
  height: 72px;

  align-items: center;
  justify-content: center;

  margin-bottom: 18px;

  border-radius: 18px;

  background: #f7eff4;
  color: #9e306d;

  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.system-card:hover .system-card__icon {
  background: #f3e5ed;
  transform: scale(1.05);
}

/* Información */

.system-info {
  width: 100%;
}

/* Nombre */

.system-name {
  color: #2c2631;

  font-size: 1.12rem;
  font-weight: 800;
  line-height: 1.3;

  text-align: center;
}

/* Descripción */

.system-description {
  display: -webkit-box;

  overflow: hidden;

  margin-top: 12px;

  color: #756f79;

  font-size: 0.86rem;
  line-height: 1.55;

  text-align: center;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

/* ========================================
   ESTADOS DE CARGA Y VACÍO
   ======================================== */

.systems-loading,
.systems-empty {
  display: flex;

  min-height: 300px;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 40px 24px;

  border: 1px solid #e7e3e9;
  border-radius: 16px;

  background: #fff;

  text-align: center;
}

.systems-loading {
  gap: 18px;
  color: #6d6670;
}

.systems-loading strong,
.systems-loading span {
  display: block;
}

.systems-loading strong {
  color: #403843;
  font-size: 0.95rem;
}

.systems-loading span {
  margin-top: 4px;
  font-size: 0.83rem;
}

.systems-empty__icon {
  display: flex;

  width: 76px;
  height: 76px;

  align-items: center;
  justify-content: center;

  margin-bottom: 18px;

  border-radius: 50%;

  background: #f7eff4;
  color: #9e306d;
}

.systems-empty__title {
  color: #403843;
  font-size: 1.08rem;
  font-weight: 800;
}

.systems-empty__text {
  margin-top: 6px;
  color: #77717a;
  font-size: 0.88rem;
}

/* ========================================
   BANNER DE CUMPLEAÑOS
   ======================================== */

.birthday-banner {
  position: relative;
  min-height: 260px;
  margin-bottom: 30px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  background-image: url('@/assets/birthday-background.png');
  background-position: center;
  background-size: cover;
  box-shadow: 0 6px 20px rgba(42, 31, 49, 0.07);
}

.birthday-banner__content {
  display: flex;
  min-height: 260px;
  align-items: flex-end;
  justify-content: center;
  padding: 30px;
}

.birthday-banner__message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 4px 16px rgba(42, 31, 49, 0.06);
  backdrop-filter: blur(3px);
}

.birthday-banner__name {
  color: #26384d;
  font-size: 1.15rem;
  font-weight: 800;
  text-align: center;
}

.birthday-banner__text {
  margin-top: 4px;
  color: #6d6d6d;
  font-size: 0.85rem;
  text-align: center;
}

.systems-page--birthday {
  min-height: 100vh;

  background-image: url('@/assets/birthday-background.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;

  background-color: #f7f7fa;
}

/* ========================================
   RESPONSIVE
   ======================================== */

@media (max-width: 600px) {
  .systems-page {
    padding: 28px 16px 40px;
  }

  .systems-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
    padding-bottom: 24px;
  }

  .systems-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .system-card {
    min-height: 0;
  }

  .system-card__main {
    min-height: 210px;
  }
}
</style>
