<template>
  <q-page class="login-page">
    <div class="login-shell">
      <!-- ================================================= -->
      <!-- PANEL INSTITUCIONAL                              -->
      <!-- ================================================= -->

      <section class="login-brand-panel">
        <div class="panel-institucional">
          <img :src="imagenMesActual" alt="IEEN" class="imagen-mes" />
        </div>
        <!-- <div class="brand-decoration brand-decoration-one"></div>
        <div class="brand-decoration brand-decoration-two"></div>

        <div class="brand-content">
          <div class="brand-logo-wrapper">
            <img :src="ieenLogo" alt="Instituto Estatal Electoral de Nayarit" class="brand-logo" />
          </div>

          <div class="brand-kicker">ACCESO INSTITUCIONAL</div>

          <h2 class="brand-title">Universo IEEN</h2>

          <p class="brand-description">
            Un solo acceso para los sistemas y servicios institucionales del Instituto Estatal
            Electoral de Nayarit.
          </p>

          <div class="brand-values">
            <div class="brand-value">
              <q-icon name="how_to_vote" size="22px" />

              <div>
                <strong>Participación</strong>
                <span>La ciudadanía como eje de nuestra labor.</span>
              </div>
            </div>

            <div class="brand-value">
              <q-icon name="verified" size="22px" />

              <div>
                <strong>Certeza</strong>
                <span>Procesos confiables y transparentes.</span>
              </div>
            </div>

            <div class="brand-value">
              <q-icon name="balance" size="22px" />

              <div>
                <strong>Legalidad</strong>
                <span>Actuamos conforme a los principios institucionales.</span>
              </div>
            </div>

            <div class="brand-value">
              <q-icon name="diversity_3" size="22px" />

              <div>
                <strong>Inclusión</strong>
                <span>Un instituto cercano y para todas y todos.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="brand-footer">
          <span>NAYARIT</span>
          <span class="brand-footer-dot"></span>
          <span>TU VOZ CUENTA</span>
        </div> -->
      </section>

      <!-- ================================================= -->
      <!-- PANEL LOGIN                                      -->
      <!-- ================================================= -->

      <section class="login-form-panel">
        <!-- <div class="form-topbar">
          <div class="version-badge">v1.0.0</div>

          <q-btn
            round
            flat
            unelevated
            :icon="isDark ? 'light_mode' : 'dark_mode'"
            :aria-label="themeLabel"
            :title="themeLabel"
            class="theme-button"
            @click="toggleTheme"
          />
        </div> -->

        <div class="login-content">
          <div class="login-heading">
            <div class="login-overline">Bienvenido</div>

            <h1 class="login-title">Iniciar sesión</h1>

            <p class="login-subtitle">Ingresa tus credenciales para acceder al Universo IEEN.</p>
          </div>

          <q-form class="login-form" @submit.prevent="onSubmit">
            <!-- Usuario -->

            <div class="input-group">
              <label class="input-label"> Usuario </label>

              <q-input
                v-model="form.userName"
                outlined
                class="login-input"
                placeholder="Ingresa tu usuario"
                autocomplete="username"
                :rules="userRules"
                lazy-rules
              >
                <template #prepend>
                  <q-icon name="person_outline" class="input-icon" />
                </template>
              </q-input>
            </div>

            <!-- Contraseña -->

            <div class="input-group">
              <div class="input-label-row">
                <label class="input-label"> Contraseña </label>
              </div>

              <q-input
                v-model="form.password"
                outlined
                class="login-input"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                lazy-rules
              >
                <template #prepend>
                  <q-icon name="lock_outline" class="input-icon" />
                </template>

                <template #append>
                  <q-btn
                    flat
                    round
                    dense
                    tabindex="-1"
                    :icon="showPassword ? 'visibility' : 'visibility_off'"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <!-- Botón -->

            <q-btn
              type="submit"
              unelevated
              no-caps
              class="login-submit"
              label="Iniciar sesión"
              :loading="loading"
            >
              <template #loading>
                <q-spinner-dots size="24px" />
              </template>
            </q-btn>

            <!-- Mensaje -->

            <div class="security-message">
              <q-icon name="info_outline" size="18px" />

              <span>
                Acceso exclusivo para personal autorizado del Instituto Estatal Electoral de
                Nayarit.
              </span>
            </div>
          </q-form>

          <div class="login-bottom">
            <div class="bottom-line"></div>

            <div class="bottom-text">Universo IEEN</div>

            <div class="bottom-line"></div>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- FOOTER                                           -->
        <!-- ================================================= -->

        <div class="login-footer">
          <span> Instituto Estatal Electoral de Nayarit </span>

          <span> Acceso Seguro </span>
        </div>
      </section>
    </div>

    <!-- ================================================= -->
    <!-- PANTALLA DE CARGA                                 -->
    <!-- ================================================= -->

    <transition name="loading-fade">
      <div v-if="loading" class="login-loading">
        <div class="loading-card">
          <img :src="ieenLogo" alt="IEEN" class="loading-logo" />

          <q-spinner-dots size="46px" class="loading-spinner" />

          <div class="loading-title">Iniciando sesión</div>

          <div class="loading-text">Validando tus credenciales...</div>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useAuthStore } from '../stores/auth.store'
import { getSafeRedirect } from '../router/guards'

import ieenLogo from '../assets/ieen-logo.png'

import enero from '../assets/login/enero.png'
import febrero from '../assets/login/febrero.png'
// import marzo from '../assets/login/marzo.png'
// import abril from '../assets/login/abril.png'
// import mayo from '../assets/login/mayo.png'
// import junio from '../assets/login/junio.png'
// import julio from '../assets/login/julio.png'
// import agosto from '../assets/login/agosto.png'
import septiembre from '../assets/login/septiembre.png'
import octubre from '../assets/login/octubre.png'
// import noviembre from '../assets/login/noviembre.png'
// import diciembre from '../assets/login/diciembre.png'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const authStore = useAuthStore()

// =====================================================
// FORMULARIO
// =====================================================

const form = ref({
  userName: '',
  password: '',
})

const imagenesMes = {
  1: enero,
  2: febrero,
  // 3: marzo,
  // 4: abril,
  // 5: mayo,
  // 6: junio,
  // 7: julio,
  // 8: agosto,
  9: septiembre,
  10: octubre,
  // 11: noviembre,
  // 12: diciembre
}

const imagenMesActual = computed(() => {
  const mes = new Date().getMonth() + 1
  return imagenesMes[mes]
})

const showPassword = ref(false)

const loading = ref(false)

// =====================================================
// TEMA
// =====================================================

//const isDark = computed(() => $q.dark.isActive)

// const themeLabel = computed(() => {
//   return isDark.value ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
// })

// function toggleTheme() {
//   $q.dark.set(!isDark.value)
// }

// =====================================================
// VALIDACIONES
// =====================================================

const userRules = [(value) => !!value || 'El usuario es requerido.']

const passwordRules = [
  (value) => !!value || 'La contraseña es requerida.',

  (value) => value.length >= 6 || 'La contraseña debe tener al menos 6 caracteres.',
]

// =====================================================
// LOGIN
// =====================================================

async function onSubmit() {
  loading.value = true

  try {
    await authStore.login({
      userName: form.value.userName,
      password: form.value.password,
    })

    $q.notify({
      type: 'positive',
      message: 'Inicio de sesión correcto.',
      icon: 'check_circle',
      position: 'top-right',
    })

    router.replace(getSafeRedirect(route.query.redirect) || { name: 'home' })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)

    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'No fue posible iniciar sesión.'

    $q.notify({
      type: 'negative',
      message,
      icon: 'error',
      position: 'top-right',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.panel-institucional {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  overflow: hidden;
}

.imagen-mes {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
  object-position: center;
}
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;

  background:
    radial-gradient(circle at 10% 20%, rgba(173, 45, 114, 0.1), transparent 35%),
    radial-gradient(circle at 90% 85%, rgba(67, 45, 91, 0.12), transparent 38%), #f5f6fa;
}

.login-shell {
  width: 100%;
  max-width: 1220px;
  min-height: 700px;

  display: grid;
  grid-template-columns: 0.92fr 1.08fr;

  overflow: hidden;

  border-radius: 28px;

  background: white;

  box-shadow:
    0 30px 80px rgba(33, 26, 45, 0.16),
    0 8px 24px rgba(33, 26, 45, 0.08);

  border: 1px solid rgba(64, 42, 84, 0.08);
}

/* =====================================================
   BRAND PANEL
   ===================================================== */

.login-brand-panel {
  position: relative;

  overflow: hidden;

  color: white;

  background: #3d2156;

  padding: 0;
}

.brand-decoration {
  position: absolute;
  pointer-events: none;
}

.brand-decoration-one {
  width: 420px;
  height: 420px;

  right: -160px;
  top: -130px;

  border-radius: 50%;

  border: 70px solid rgba(255, 255, 255, 0.05);
}

.brand-decoration-two {
  width: 500px;
  height: 500px;

  left: -300px;
  bottom: -300px;

  border-radius: 50%;

  background: rgba(227, 38, 132, 0.12);
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-logo-wrapper {
  width: 180px;

  padding: 12px 14px;

  margin-bottom: 54px;

  border-radius: 18px;

  background: rgba(255, 255, 255, 0.96);

  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.brand-logo {
  display: block;

  width: 100%;
  height: auto;
}

.brand-kicker {
  display: inline-flex;

  padding: 7px 13px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.1);

  border: 1px solid rgba(255, 255, 255, 0.16);

  font-size: 0.7rem;
  font-weight: 700;

  letter-spacing: 0.14em;

  margin-bottom: 20px;
}

.brand-title {
  margin: 0;

  font-size: clamp(3rem, 4vw, 4.4rem);

  line-height: 0.95;

  font-weight: 800;

  letter-spacing: -0.03em;
}

.brand-description {
  max-width: 470px;

  margin: 24px 0 0;

  font-size: 1rem;

  line-height: 1.7;

  color: rgba(255, 255, 255, 0.8);
}

.brand-values {
  display: grid;

  gap: 12px;

  margin-top: 34px;

  max-width: 500px;
}

.brand-value {
  display: flex;
  align-items: flex-start;

  gap: 12px;

  padding: 13px 15px;

  border-radius: 15px;

  background: rgba(255, 255, 255, 0.075);

  border: 1px solid rgba(255, 255, 255, 0.09);
}

.brand-value strong {
  display: block;

  font-size: 0.89rem;
}

.brand-value span {
  display: block;

  margin-top: 3px;

  font-size: 0.78rem;

  line-height: 1.4;

  color: rgba(255, 255, 255, 0.66);
}

.brand-footer {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;

  gap: 10px;

  font-size: 0.72rem;

  font-weight: 700;

  letter-spacing: 0.18em;
}

.brand-footer-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #d93a8d;
}

/* =====================================================
   FORM PANEL
   ===================================================== */

.login-form-panel {
  position: relative;

  display: flex;
  flex-direction: column;

  background: #ffffff;
}

.form-topbar {
  display: flex;

  justify-content: space-between;
  align-items: center;

  padding: 24px 28px;
}

.version-badge {
  padding: 7px 12px;

  border-radius: 999px;

  background: #f3f1f6;

  color: #655b70;

  font-size: 0.72rem;

  font-weight: 700;

  letter-spacing: 0.04em;
}

.theme-button {
  color: #493454;
}

.login-content {
  width: 100%;
  max-width: 500px;

  margin: auto;

  padding: 40px 44px;
}

.login-overline {
  color: #a82e6f;

  font-size: 0.74rem;

  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.15em;
}

.login-title {
  margin: 10px 0 0;

  color: #252231;

  font-size: 2.45rem;

  line-height: 1.1;

  font-weight: 800;
}

.login-subtitle {
  margin: 13px 0 34px;

  color: #72707b;

  font-size: 0.97rem;

  line-height: 1.6;
}

/* =====================================================
   INPUTS
   ===================================================== */

.login-form {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  margin-bottom: 7px;

  color: #44414d;

  font-size: 0.83rem;

  font-weight: 700;
}

.login-input :deep(.q-field__control) {
  min-height: 54px;

  border-radius: 14px;

  background: #fbfbfd;
}

.login-input :deep(.q-field__control:before) {
  border-color: #dcdbe3;
}

.login-input :deep(.q-field__control:hover:before) {
  border-color: #b7a5bf;
}

.login-input :deep(.q-field--focused .q-field__control:after) {
  border-color: #9e306d;
}

.input-icon {
  color: #8a778f;
}

.password-toggle {
  color: #77727d;
}

/* =====================================================
   BUTTON
   ===================================================== */

.login-submit {
  width: 100%;

  min-height: 56px;

  margin-top: 10px;

  border-radius: 14px;

  color: white !important;

  background: linear-gradient(135deg, #7f2a67 0%, #a72f70 58%, #c1387d 100%);

  font-size: 0.98rem;

  font-weight: 700;

  box-shadow: 0 12px 24px rgba(155, 43, 108, 0.22);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.login-submit:hover {
  transform: translateY(-1px);

  box-shadow: 0 16px 30px rgba(155, 43, 108, 0.28);
}

/* =====================================================
   SECURITY
   ===================================================== */

.security-message {
  display: flex;
  align-items: flex-start;

  gap: 10px;

  margin-top: 18px;

  padding: 13px 14px;

  border-radius: 14px;

  background: #f7f5fa;

  border: 1px solid #ece8ef;

  color: #6c6671;

  font-size: 0.78rem;

  line-height: 1.45;
}

.security-message .q-icon {
  color: #7e6791;

  flex-shrink: 0;
}

.login-bottom {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-top: 42px;
}

.bottom-line {
  flex: 1;

  height: 1px;

  background: #eceaf0;
}

.bottom-text {
  color: #aaa6af;

  font-size: 0.72rem;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 0.1em;
}

.login-footer {
  display: flex;

  justify-content: space-between;

  gap: 20px;

  padding: 20px 30px;

  border-top: 1px solid #efedf2;

  color: #aaa6af;

  font-size: 0.7rem;
}

/* =====================================================
   LOADING
   ===================================================== */

.login-loading {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(39, 25, 49, 0.78);

  backdrop-filter: blur(12px);
}

.loading-card {
  width: min(360px, calc(100vw - 40px));

  padding: 42px 30px;

  text-align: center;

  border-radius: 24px;

  background: white;

  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
}

.loading-logo {
  width: 150px;

  margin-bottom: 25px;
}

.loading-spinner {
  color: #a72f70;
}

.loading-title {
  margin-top: 20px;

  color: #292431;

  font-size: 1.1rem;

  font-weight: 800;
}

.loading-text {
  margin-top: 7px;

  color: #77727d;

  font-size: 0.85rem;
}

/* =====================================================
   ANIMACIÓN
   ===================================================== */

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.22s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

/* =====================================================
   RESPONSIVE
   ===================================================== */

@media (max-width: 900px) {
  .login-page {
    padding: 16px;
  }

  .login-shell {
    grid-template-columns: 1fr;

    min-height: auto;
  }

  .login-brand-panel {
    display: none;
  }

  .login-content {
    max-width: 560px;

    padding: 38px 28px;
  }
}

@media (max-width: 520px) {
  .login-page {
    padding: 0;
  }

  .login-shell {
    min-height: 100vh;

    border-radius: 0;

    box-shadow: none;

    border: 0;
  }

  .form-topbar {
    padding: 18px 20px;
  }

  .login-content {
    padding: 30px 22px;
  }

  .login-title {
    font-size: 2rem;
  }

  .login-footer {
    padding: 18px 20px;

    flex-direction: column;
  }
}
</style>
