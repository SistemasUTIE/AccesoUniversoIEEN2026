<template>
  <q-page class="profile-page">
    <!-- =========================================================
         BREADCRUMBS
    ========================================================== -->
    <div class="profile-breadcrumbs">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" label="Inicio" to="/Inicio" />
        <q-breadcrumbs-el icon="person" label="Mi perfil" />
      </q-breadcrumbs>
    </div>

    <div class="profile-container">
      <!-- =======================================================
           HEADER DEL PERFIL
      ======================================================== -->
      <q-card class="profile-header-card">
        <div class="profile-header">
          <!-- Avatar -->
          <div class="profile-avatar-wrapper">
            <q-avatar size="110px" class="profile-avatar">
              <img :src="empleado.photoUrl || fotoPerfilPredeterminada" alt="Foto de perfil" />
            </q-avatar>

            <div class="profile-status-dot"></div>
          </div>

          <!-- Información -->
          <div class="profile-main-info">
            <div class="profile-name">
              {{ empleado.nombre }}
            </div>

            <div class="profile-position">
              {{ empleado.puesto }}
            </div>

            <div class="profile-area">
              <q-icon name="business" />
              {{ empleado.area }}
            </div>

            <div class="profile-status">
              <q-icon :name="empleado.isActive ? 'check_circle' : 'cancel'" />
              {{ empleado.isActive ? 'Cuenta activa' : 'Cuenta inactiva' }}
            </div>
          </div>

          <!-- Usuario -->
          <div class="profile-id">
            <div class="profile-id-label">Usuario</div>

            <div class="profile-id-value">
              {{ authStore.user?.userName || authStore.user?.username || '—' }}
            </div>
          </div>
        </div>
      </q-card>

      <!-- =======================================================
           NAVEGACIÓN DEL PERFIL
      ======================================================== -->
      <div class="profile-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="profile-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <div class="profile-tab-icon">
            <q-icon :name="tab.icon" />
          </div>

          <div class="profile-tab-content">
            <div class="profile-tab-title">
              {{ tab.title }}
            </div>

            <div class="profile-tab-description">
              {{ tab.description }}
            </div>
          </div>

          <q-icon name="chevron_right" class="profile-tab-arrow" />
        </button>
      </div>

      <!-- =======================================================
           CONTENIDO
      ======================================================== -->
      <q-card class="profile-content-card">
        <!-- =====================================================
             INFORMACIÓN PERSONAL
        ====================================================== -->
        <div v-if="activeTab === 'personal'">
          <div class="section-header">
            <div class="section-icon personal">
              <q-icon name="person" />
            </div>

            <div>
              <div class="section-title">Información personal</div>

              <div class="section-subtitle">
                Consulta la información personal asociada a tu cuenta.
              </div>
            </div>
          </div>

          <q-separator />

          <div class="information-grid">
            <div class="information-item">
              <div class="information-icon">
                <q-icon name="badge" />
              </div>

              <div>
                <div class="information-label">Nombre completo</div>

                <div class="information-value">
                  {{ empleado.nombre }}
                </div>
              </div>
            </div>

            <div class="information-item">
              <div class="information-icon">
                <q-icon name="fingerprint" />
              </div>

              <div>
                <div class="information-label">CURP</div>

                <div class="information-value">
                  {{ empleado.curp }}
                </div>
              </div>
            </div>

            <div class="information-item">
              <div class="information-icon">
                <q-icon name="description" />
              </div>

              <div>
                <div class="information-label">RFC</div>

                <div class="information-value">
                  {{ empleado.rfc }}
                </div>
              </div>
            </div>

            <div class="information-item">
              <div class="information-icon">
                <q-icon name="phone" />
              </div>

              <div>
                <div class="information-label">Teléfono</div>

                <div class="information-value">
                  {{ empleado.telefono }}
                </div>
              </div>
            </div>

            <div class="information-item information-item-wide">
              <div class="information-icon">
                <q-icon name="email" />
              </div>

              <div>
                <div class="information-label">Correo electrónico</div>

                <div class="information-value">
                  {{ empleado.email }}
                </div>
              </div>
            </div>

            <div class="information-item information-item-wide">
              <div class="information-icon">
                <q-icon name="home" />
              </div>

              <div>
                <div class="information-label">Domicilio</div>

                <div class="information-value">
                  {{ empleado.domicilio }}
                </div>
              </div>
            </div>
          </div>

          <!-- Cédula -->
          <div class="action-panel">
            <div class="action-panel-icon">
              <q-icon name="contact_emergency" />
            </div>

            <div class="action-panel-content">
              <div class="action-panel-title">Cédula de contacto</div>

              <div class="action-panel-description">
                Consulta y actualiza la información de contacto para casos de emergencia.
              </div>
            </div>

            <q-btn
              unelevated
              no-caps
              label="Ver cédula"
              icon-right="arrow_forward"
              class="profile-action-btn"
              :to="{ name: 'Datos_Personales' }"
            />
          </div>
        </div>

        <!-- =====================================================
             INFORMACIÓN LABORAL
        ====================================================== -->
        <div v-if="activeTab === 'laboral'">
          <div class="section-header">
            <div class="section-icon laboral">
              <q-icon name="business_center" />
            </div>

            <div>
              <div class="section-title">Información laboral</div>

              <div class="section-subtitle">
                Información relacionada con tu adscripción dentro del IEEN.
              </div>
            </div>
          </div>

          <q-separator />

          <div class="employment-card">
            <div class="employment-icon">
              <q-icon name="business" />
            </div>

            <div class="employment-main">
              <div class="employment-label">Área de adscripción</div>

              <div class="employment-value">
                {{ empleado.area }}
              </div>
            </div>
          </div>

          <div class="information-grid">
            <div class="information-item">
              <div class="information-icon">
                <q-icon name="badge" />
              </div>

              <div>
                <div class="information-label">Puesto</div>

                <div class="information-value">
                  {{ empleado.puesto }}
                </div>
              </div>
            </div>

            <div class="information-item">
              <div class="information-icon">
                <q-icon name="person_outline" />
              </div>

              <div>
                <div class="information-label">Tratamiento</div>

                <div class="information-value">
                  {{ empleado.tratamiento }}
                </div>
              </div>
            </div>

            <div class="information-item">
              <div class="information-icon">
                <q-icon name="calendar_month" />
              </div>

              <div>
                <div class="information-label">Antigüedad</div>

                <div class="information-value">
                  {{ empleado.antiguedad }}
                </div>
              </div>
            </div>

            <div class="information-item">
              <div class="information-icon">
                <q-icon name="verified_user" />
              </div>

              <div>
                <div class="information-label">Estado laboral</div>

                <div class="information-value status-text">
                  {{ empleado.isActive ? 'Activo' : 'Inactivo' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================
             CONTRASEÑA
        ====================================================== -->
        <div v-if="activeTab === 'password'">
          <div class="section-header">
            <div class="section-icon password">
              <q-icon name="lock" />
            </div>

            <div>
              <div class="section-title">Contraseña</div>

              <div class="section-subtitle">
                Mantén segura tu cuenta utilizando una contraseña segura.
              </div>
            </div>
          </div>

          <q-separator />

          <div class="security-feature">
            <div class="security-feature-icon">
              <q-icon name="key" />
            </div>

            <div class="security-feature-content">
              <div class="security-feature-title">Cambiar contraseña</div>

              <div class="security-feature-description">
                Puedes cambiar tu contraseña cuando lo necesites. Recuerda utilizar una contraseña
                que sea difícil de adivinar y que no utilices en otros servicios.
              </div>

              <div class="password-last-change">
                <q-icon name="schedule" />
                Último cambio: {{ empleado.ultimoCambioPassword }}
              </div>
            </div>

            <q-btn
              unelevated
              no-caps
              label="Cambiar contraseña"
              icon="lock_reset"
              class="profile-action-btn"
              @click="abrirCambioPassword"
            />
          </div>

          <!-- Recomendaciones -->
          <div class="recommendation-box">
            <div class="recommendation-title">
              <q-icon name="lightbulb" />
              Recomendaciones de seguridad
            </div>

            <div class="recommendation-list">
              <div>
                <q-icon name="check_circle" />
                Utiliza al menos 8 caracteres.
              </div>

              <div>
                <q-icon name="check_circle" />
                Combina mayúsculas, minúsculas y números.
              </div>

              <div>
                <q-icon name="check_circle" />
                Incluye caracteres especiales.
              </div>

              <div>
                <q-icon name="check_circle" />
                No compartas tu contraseña con otras personas.
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================
             SEGURIDAD
        ====================================================== -->
        <div v-if="activeTab === 'security'">
          <div class="section-header">
            <div class="section-icon security">
              <q-icon name="shield" />
            </div>

            <div>
              <div class="section-title">Seguridad de la cuenta</div>

              <div class="section-subtitle">Administra las opciones de seguridad de tu cuenta.</div>
            </div>
          </div>

          <q-separator />

          <!-- 2FA -->
          <div class="security-feature">
            <div class="security-feature-icon" :class="{ enabled: twofa }">
              <q-icon :name="twofa ? 'verified_user' : 'security'" />
            </div>

            <div class="security-feature-content">
              <div class="security-feature-title">Autenticación en dos pasos</div>

              <div class="security-feature-description">
                Añade una capa adicional de seguridad a tu cuenta. Cuando esta opción está activa,
                necesitarás un código adicional para iniciar sesión.
              </div>

              <div class="twofa-status" :class="{ enabled: twofa }">
                <q-icon :name="twofa ? 'check_circle' : 'cancel'" />

                {{ twofa ? 'Autenticación habilitada' : 'Autenticación deshabilitada' }}
              </div>
            </div>

            <q-btn
              unelevated
              no-caps
              :label="twofa ? 'Deshabilitar' : 'Habilitar'"
              :icon="twofa ? 'lock_open' : 'lock'"
              :class="twofa ? 'disable-security-btn' : 'profile-action-btn'"
              @click="abrirDialogoTwofa"
            />
          </div>

          <!-- Estado general -->
          <div class="account-security-card">
            <div class="account-security-header">
              <q-icon name="shield" />

              <div>
                <div class="account-security-title">Protección de la cuenta</div>

                <div class="account-security-subtitle">Estado actual de seguridad</div>
              </div>

              <q-space />

              <q-badge color="positive" rounded label="Protegida" />
            </div>

            <q-separator />

            <div class="security-checks">
              <div class="security-check">
                <q-icon name="check_circle" color="positive" />
                Contraseña configurada
              </div>

              <div class="security-check">
                <q-icon
                  :name="twofa ? 'check_circle' : 'radio_button_unchecked'"
                  :color="twofa ? 'positive' : 'grey-5'"
                />
                Autenticación en dos pasos
              </div>

              <div class="security-check">
                <q-icon name="check_circle" color="positive" />
                Cuenta activa
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <q-dialog v-model="dialogTwofa" persistent>
      <q-card class="password-dialog">
        <div class="dialog-header">
          <div class="dialog-header-icon">
            <q-icon :name="twofa ? 'lock_open' : 'verified_user'" />
          </div>

          <div>
            <div class="dialog-title">
              {{ twofa ? 'Deshabilitar autenticación' : twofaCodeSent ? 'Confirmar código' : 'Habilitar autenticación' }}
            </div>
            <div class="dialog-subtitle">
              {{
                twofaCodeSent
                  ? 'Ingresa el código que enviamos a tu correo.'
                  : twofa
                    ? 'Confirma tu contraseña para deshabilitarla.'
                    : 'Confirma tu contraseña. Te enviaremos un código a tu correo.'
              }}
            </div>
          </div>

          <q-space />
          <q-btn flat round dense icon="close" aria-label="Cerrar" @click="dialogTwofa = false" />
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <q-input
            v-if="twofa || !twofaCodeSent"
            v-model="twofaCurrentPassword"
            outlined
            dense
            autofocus
            type="password"
            label="Contraseña actual"
            autocomplete="current-password"
            class="dialog-input"
          />
          <q-input
            v-if="twofaCodeSent"
            v-model="twofaCode"
            outlined
            dense
            autofocus
            label="Código de verificación"
            inputmode="numeric"
            autocomplete="one-time-code"
            class="dialog-input"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-actions">
          <q-btn flat no-caps label="Cancelar" @click="dialogTwofa = false" />
          <q-btn
            unelevated
            no-caps
            color="primary"
            :label="twofa ? 'Deshabilitar' : twofaCodeSent ? 'Confirmar código' : 'Enviar código'"
            :disable="
              isUpdatingTwofa ||
              (twofa ? !twofaCurrentPassword : twofaCodeSent ? !twofaCode.trim() : !twofaCurrentPassword)
            "
            :loading="isUpdatingTwofa"
            @click="procesarCambioTwofa"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- =========================================================
         DIALOG CAMBIAR CONTRASEÑA
    ========================================================== -->
    <q-dialog v-model="dialogPassword" persistent>
      <q-card class="password-dialog">
        <!-- Header -->
        <div class="dialog-header">
          <div class="dialog-header-icon">
            <q-icon name="lock_reset" />
          </div>

          <div>
            <div class="dialog-title">Cambiar contraseña</div>

            <div class="dialog-subtitle">Actualiza la contraseña de tu cuenta</div>
          </div>

          <q-space />

          <q-btn flat round dense icon="close" @click="dialogPassword = false" />
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <q-input
            v-model="passwordActual"
            outlined
            dense
            label="Contraseña actual"
            :type="showActual ? 'text' : 'password'"
            class="dialog-input"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>

            <template #append>
              <q-icon
                :name="showActual ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showActual = !showActual"
              />
            </template>
          </q-input>

          <q-input
            v-model="passwordNueva"
            outlined
            dense
            label="Nueva contraseña"
            :type="showNueva ? 'text' : 'password'"
            class="dialog-input"
          >
            <template #prepend>
              <q-icon name="key" />
            </template>

            <template #append>
              <q-icon
                :name="showNueva ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showNueva = !showNueva"
              />
            </template>
          </q-input>

          <q-input
            v-model="passwordConfirmacion"
            outlined
            dense
            label="Confirmar nueva contraseña"
            :type="showConfirmacion ? 'text' : 'password'"
            class="dialog-input"
          >
            <template #prepend>
              <q-icon name="key" />
            </template>

            <template #append>
              <q-icon
                :name="showConfirmacion ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showConfirmacion = !showConfirmacion"
              />
            </template>
          </q-input>

          <!-- Requisitos -->
          <div class="dialog-requirements">
            <div class="dialog-requirements-title">Requisitos de la contraseña</div>

            <div class="requirement" :class="{ valid: passwordNueva.length >= 8 }">
              <q-icon
                :name="passwordNueva.length >= 8 ? 'check_circle' : 'radio_button_unchecked'"
              />
              Al menos 8 caracteres
            </div>

            <div class="requirement" :class="{ valid: hasUppercase }">
              <q-icon :name="hasUppercase ? 'check_circle' : 'radio_button_unchecked'" />
              Una letra mayúscula
            </div>

            <div class="requirement" :class="{ valid: hasNumber }">
              <q-icon :name="hasNumber ? 'check_circle' : 'radio_button_unchecked'" />
              Un número
            </div>

            <div class="requirement" :class="{ valid: hasSpecial }">
              <q-icon :name="hasSpecial ? 'check_circle' : 'radio_button_unchecked'" />
              Un carácter especial
            </div>

            <div class="requirement" :class="{ valid: passwordsMatch }">
              <q-icon :name="passwordsMatch ? 'check_circle' : 'radio_button_unchecked'" />
              Las contraseñas coinciden
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-actions">
          <q-btn flat no-caps label="Cancelar" @click="dialogPassword = false" />

          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Actualizar contraseña"
            icon="check"
            :disable="!passwordValid"
            :loading="isChangingPassword"
            @click="actualizarPassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { usersApi } from '@/api/users.api'
import { twoFactorApi } from '@/api/two-factor.api'
import fotoPerfilPredeterminada from '@/assets/perfil_Hombre.png'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

// ================================================================
// DATOS DEL EMPLEADO
// ================================================================

const empleado = ref({
  id: '—',
  nombre: '—',
  puesto: '—',
  area: '—',
  tratamiento: '—',
  curp: '—',
  rfc: '—',
  telefono: '—',
  email: '—',
  domicilio: '—',
  antiguedad: '—',
  ultimoCambioPassword: '—',
  photoUrl: null,
  isActive: false,
})

async function cargarEmpleado() {
  try {
    const data = await authStore.loadEmployee()
    empleado.value = {
      ...empleado.value,
      id: data.id || '—',
      nombre:
        data.fullName ||
        [data.name, data.paternalSurname, data.maternalSurname].filter(Boolean).join(' ') ||
        '—',
      puesto: data.positionName || '—',
      area: data.areaName || '—',
      tratamiento: data.treatmentAbbreviation || '—',
      curp: data.curp || '—',
      rfc: data.rfc || '—',
      telefono: data.phone || '—',
      email: data.email || '—',
      domicilio: data.address || '—',
      photoUrl: data.photoUrl || null,
      isActive: Boolean(data.isActive),
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'No fue posible cargar la información del empleado.',
      position: 'top-right',
    })
  }
}

onMounted(cargarEmpleado)

async function cargarEstadoDosFactores() {
  const userId = authStore.user?.id
  if (!userId) return

  try {
    const currentUser = await usersApi.getById(userId)
    const enabled = currentUser.twoFactorEnabled ?? currentUser.isTwoFactorEnabled
    if (enabled !== undefined && enabled !== null) twofa.value = Boolean(enabled)
  } catch {
    // Se conserva el estado disponible en la sesión si el servicio no devuelve el usuario.
  }
}

onMounted(cargarEstadoDosFactores)

// ================================================================
// TABS
// ================================================================

const tabs = [
  {
    id: 'personal',
    title: 'Información personal',
    description: 'Tus datos personales y contacto',
    icon: 'person',
  },

  {
    id: 'laboral',
    title: 'Información laboral',
    description: 'Tu adscripción y puesto',
    icon: 'business_center',
  },

  {
    id: 'password',
    title: 'Contraseña',
    description: 'Administra tu contraseña',
    icon: 'lock',
  },

  {
    id: 'security',
    title: 'Seguridad',
    description: 'Protege tu cuenta',
    icon: 'shield',
  },
]

const activeTab = ref('personal')

// ================================================================
// SEGURIDAD
// ================================================================

const twofa = ref(
  Boolean(authStore.user?.twoFactorEnabled ?? authStore.user?.isTwoFactorEnabled ?? false),
)
const dialogTwofa = ref(false)
const twofaCurrentPassword = ref('')
const twofaCode = ref('')
const twofaCodeSent = ref(false)
const isUpdatingTwofa = ref(false)

// ================================================================
// PASSWORD
// ================================================================

const dialogPassword = ref(false)

const passwordActual = ref('')
const passwordNueva = ref('')
const passwordConfirmacion = ref('')
const isChangingPassword = ref(false)

const showActual = ref(false)
const showNueva = ref(false)
const showConfirmacion = ref(false)

const hasUppercase = computed(() => {
  return /[A-Z]/.test(passwordNueva.value)
})

const hasNumber = computed(() => {
  return /\d/.test(passwordNueva.value)
})

const hasSpecial = computed(() => {
  return /[^A-Za-z0-9]/.test(passwordNueva.value)
})

const passwordsMatch = computed(() => {
  return passwordNueva.value.length > 0 && passwordNueva.value === passwordConfirmacion.value
})

const passwordValid = computed(() => {
  return (
    passwordActual.value.length > 0 &&
    passwordNueva.value.length >= 8 &&
    hasUppercase.value &&
    hasNumber.value &&
    hasSpecial.value &&
    passwordsMatch.value
  )
})

// ================================================================
// MÉTODOS
// ================================================================

const abrirCambioPassword = () => {
  passwordActual.value = ''
  passwordNueva.value = ''
  passwordConfirmacion.value = ''

  showActual.value = false
  showNueva.value = false
  showConfirmacion.value = false

  dialogPassword.value = true
}

const actualizarPassword = async () => {
  if (!passwordValid.value || isChangingPassword.value) return

  isChangingPassword.value = true
  $q.loading.show({
    message: 'Actualizando contraseña...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary',
  })

  try {
    await usersApi.changePassword({
      currentPassword: passwordActual.value,
      newPassword: passwordNueva.value,
      confirmPassword: passwordConfirmacion.value,
    })

    $q.loading.show({
      message: 'Contraseña actualizada. Se cerrará tu sesión...',
      boxClass: 'bg-grey-2 text-grey-9',
      spinnerColor: 'primary',
    })

    await new Promise((resolve) => setTimeout(resolve, 1800))
    authStore.logout()
    await router.replace({ name: 'login' })
  } catch (error) {
    $q.loading.hide()
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message || error.message || 'No fue posible cambiar la contraseña.',
      position: 'top-right',
    })
  } finally {
    $q.loading.hide()
    isChangingPassword.value = false
  }
}

function abrirDialogoTwofa() {
  twofaCurrentPassword.value = ''
  twofaCode.value = ''
  twofaCodeSent.value = false
  dialogTwofa.value = true
}

async function procesarCambioTwofa() {
  if (isUpdatingTwofa.value) return

  isUpdatingTwofa.value = true
  $q.loading.show({
    message: twofa.value
      ? 'Deshabilitando autenticación en dos pasos...'
      : twofaCodeSent.value
        ? 'Verificando código...'
        : 'Enviando código de verificación...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary',
  })

  try {
    if (twofa.value) {
      await twoFactorApi.disable(twofaCurrentPassword.value)
      twofa.value = false
      twofaCurrentPassword.value = ''
      dialogTwofa.value = false
      $q.notify({
        type: 'positive',
        message: 'Autenticación en dos pasos deshabilitada.',
        position: 'top-right',
      })
    } else if (!twofaCodeSent.value) {
      await twoFactorApi.enable(twofaCurrentPassword.value, 'Email')
      twofaCodeSent.value = true
      twofaCurrentPassword.value = ''
      $q.notify({
        type: 'positive',
        message: 'Enviamos un código de verificación a tu correo.',
        position: 'top-right',
      })
    } else {
      await twoFactorApi.confirm(twofaCode.value.trim())
      twofa.value = true
      dialogTwofa.value = false
      $q.notify({
        type: 'positive',
        message: 'Autenticación en dos pasos habilitada.',
        position: 'top-right',
      })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.message ||
        'No fue posible actualizar la autenticación en dos pasos.',
      position: 'top-right',
    })
  } finally {
    $q.loading.hide()
    isUpdatingTwofa.value = false
  }
}
</script>

<style scoped>
/* ================================================================
   PÁGINA
================================================================ */

.profile-page {
  background: #f5f7fa;
  min-height: 100%;
  padding-bottom: 40px;
}

/* ================================================================
   BREADCRUMBS
================================================================ */

.profile-breadcrumbs {
  background: #ffffff;
  border-bottom: 1px solid #e8ebef;
  padding: 16px 32px;
}

/* ================================================================
   CONTENEDOR
================================================================ */

.profile-container {
  max-width: 1250px;
  margin: 0 auto;
  padding: 28px 24px;
}

/* ================================================================
   HEADER
================================================================ */

.profile-header-card {
  border-radius: 18px;
  border: 1px solid #e5e8ed;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 30px 34px;
}

.profile-avatar-wrapper {
  position: relative;
}

.profile-avatar {
  border: 5px solid #f1f3f6;
  background: #ffffff;
}

.profile-status-dot {
  position: absolute;
  right: 5px;
  bottom: 8px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: #21ba45;
  border: 4px solid white;
}

.profile-main-info {
  flex: 1;
}

.profile-name {
  font-size: 27px;
  font-weight: 700;
  color: #263238;
}

.profile-position {
  font-size: 16px;
  color: #667085;
  margin-top: 4px;
}

.profile-area {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #667085;
  margin-top: 10px;
}

.profile-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #188038;
  background: #eaf7ee;
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.profile-id {
  min-width: 170px;
  padding-left: 25px;
  border-left: 1px solid #e6e9ed;
}

.profile-id-label {
  font-size: 12px;
  color: #98a2b3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-id-value {
  margin-top: 5px;
  font-size: 15px;
  font-weight: 600;
  color: #344054;
}

/* ================================================================
   TABS
================================================================ */

.profile-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.profile-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  border: 1px solid #e3e7ec;
  background: #ffffff;
  border-radius: 14px;
  padding: 17px 15px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.profile-tab:hover {
  border-color: #b8bec8;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.profile-tab.active {
  border-color: #6b2c91;
  box-shadow: 0 5px 18px rgba(107, 44, 145, 0.1);
}

.profile-tab-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #f2ebf7;
  color: #6b2c91;
  font-size: 21px;
}

.profile-tab.active .profile-tab-icon {
  background: #6b2c91;
  color: white;
}

.profile-tab-content {
  flex: 1;
}

.profile-tab-title {
  font-weight: 700;
  color: #344054;
  font-size: 14px;
}

.profile-tab-description {
  color: #98a2b3;
  font-size: 11px;
  margin-top: 3px;
}

.profile-tab-arrow {
  color: #b0b7c3;
}

/* ================================================================
   CONTENT
================================================================ */

.profile-content-card {
  margin-top: 18px;
  border-radius: 18px;
  border: 1px solid #e5e8ed;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  padding: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 22px;
}

.section-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  font-size: 23px;
}

.section-icon.personal {
  background: #f1eafb;
  color: #6b2c91;
}

.section-icon.laboral {
  background: #eaf2fb;
  color: #2875bd;
}

.section-icon.password {
  background: #fff4df;
  color: #c47a00;
}

.section-icon.security {
  background: #e8f7ef;
  color: #188038;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #263238;
}

.section-subtitle {
  color: #98a2b3;
  font-size: 13px;
  margin-top: 3px;
}

/* ================================================================
   INFORMATION GRID
================================================================ */

.information-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

.information-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 21px 10px;
  border-bottom: 1px solid #eef0f3;
}

.information-item:nth-child(odd) {
  margin-right: 20px;
}

.information-item-wide {
  grid-column: span 1;
}

.information-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #f6f2f8;
  color: #6b2c91;
}

.information-label {
  font-size: 11px;
  color: #98a2b3;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.information-value {
  color: #344054;
  font-size: 15px;
  font-weight: 600;
  margin-top: 4px;
  word-break: break-word;
}

.status-text {
  color: #188038;
}

/* ================================================================
   ACTION PANEL
================================================================ */

.action-panel {
  display: flex;
  align-items: center;
  gap: 17px;
  background: #f8f6fa;
  border: 1px solid #e8dff0;
  border-radius: 14px;
  padding: 18px;
  margin-top: 25px;
}

.action-panel-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee5f3;
  color: #6b2c91;
  border-radius: 11px;
  font-size: 22px;
}

.action-panel-content {
  flex: 1;
}

.action-panel-title {
  font-weight: 700;
  color: #344054;
}

.action-panel-description {
  color: #667085;
  font-size: 12px;
  margin-top: 3px;
}

.profile-action-btn {
  background: #6b2c91;
  color: white;
  border-radius: 9px;
  padding: 9px 17px;
}

/* ================================================================
   LABORAL
================================================================ */

.employment-card {
  display: flex;
  align-items: center;
  gap: 17px;
  margin-top: 24px;
  margin-bottom: 5px;
  padding: 20px;
  border-radius: 14px;
  background: #f5f8fc;
  border: 1px solid #e0e9f2;
}

.employment-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e7f0f9;
  color: #2875bd;
  border-radius: 12px;
  font-size: 24px;
}

.employment-label {
  color: #98a2b3;
  font-size: 12px;
}

.employment-value {
  color: #344054;
  font-weight: 700;
  font-size: 17px;
  margin-top: 4px;
}

/* ================================================================
   SECURITY FEATURES
================================================================ */

.security-feature {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px 5px;
}

.security-feature-icon {
  width: 58px;
  height: 58px;
  min-width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff5e5;
  color: #c47a00;
  border-radius: 14px;
  font-size: 27px;
}

.security-feature-icon.enabled {
  background: #e7f7ee;
  color: #188038;
}

.security-feature-content {
  flex: 1;
}

.security-feature-title {
  font-size: 17px;
  font-weight: 700;
  color: #344054;
}

.security-feature-description {
  max-width: 680px;
  margin-top: 6px;
  color: #667085;
  line-height: 1.5;
  font-size: 13px;
}

.password-last-change {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  color: #98a2b3;
  font-size: 12px;
}

.twofa-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 11px;
  color: #98a2b3;
  font-size: 12px;
}

.twofa-status.enabled {
  color: #188038;
  font-weight: 600;
}

.disable-security-btn {
  background: #f5f5f5;
  color: #667085;
  border-radius: 9px;
  padding: 9px 17px;
}

/* ================================================================
   RECOMMENDATIONS
================================================================ */

.recommendation-box {
  margin-top: 15px;
  background: #fafafa;
  border: 1px solid #eaecf0;
  border-radius: 14px;
  padding: 20px;
}

.recommendation-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  color: #344054;
}

.recommendation-title .q-icon {
  color: #c47a00;
}

.recommendation-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
  color: #667085;
  font-size: 13px;
}

.recommendation-list div {
  display: flex;
  align-items: center;
  gap: 7px;
}

.recommendation-list .q-icon {
  color: #21ba45;
}

/* ================================================================
   ACCOUNT SECURITY
================================================================ */

.account-security-card {
  margin-top: 10px;
  border: 1px solid #e5e8ed;
  border-radius: 14px;
  overflow: hidden;
}

.account-security-header {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px;
}

.account-security-header > .q-icon {
  font-size: 27px;
  color: #188038;
}

.account-security-title {
  font-weight: 700;
  color: #344054;
}

.account-security-subtitle {
  color: #98a2b3;
  font-size: 12px;
  margin-top: 2px;
}

.security-checks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 17px;
  gap: 10px;
}

.security-check {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #667085;
}

/* ================================================================
   DIALOG
================================================================ */

.password-dialog {
  width: 540px;
  max-width: 95vw;
  border-radius: 17px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: #faf8fc;
}

.dialog-header-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #eee5f3;
  color: #6b2c91;
  font-size: 23px;
}

.dialog-title {
  font-size: 17px;
  font-weight: 700;
  color: #344054;
}

.dialog-subtitle {
  color: #98a2b3;
  font-size: 12px;
  margin-top: 2px;
}

.dialog-input {
  margin-bottom: 16px;
}

.dialog-requirements {
  margin-top: 7px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.dialog-requirements-title {
  font-weight: 700;
  color: #344054;
  font-size: 13px;
  margin-bottom: 10px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #98a2b3;
  font-size: 12px;
  margin-top: 7px;
}

.requirement.valid {
  color: #188038;
  font-weight: 600;
}

.dialog-actions {
  justify-content: flex-end;
  padding: 15px 20px;
}

/* ================================================================
   RESPONSIVE
================================================================ */

@media (max-width: 900px) {
  .profile-tabs {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-header {
    align-items: flex-start;
  }

  .profile-id {
    display: none;
  }

  .security-checks {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .profile-container {
    padding: 18px 12px;
  }

  .profile-breadcrumbs {
    padding: 13px 15px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    align-items: center;
    padding: 25px 18px;
  }

  .profile-status {
    margin-left: auto;
    margin-right: auto;
  }

  .profile-tabs {
    grid-template-columns: 1fr;
  }

  .profile-content-card {
    padding: 20px 15px;
  }

  .information-grid {
    grid-template-columns: 1fr;
  }

  .information-item:nth-child(odd) {
    margin-right: 0;
  }

  .information-item-wide {
    grid-column: span 1;
  }

  .security-feature {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-panel {
    flex-wrap: wrap;
  }

  .recommendation-list {
    grid-template-columns: 1fr;
  }

  .profile-action-btn,
  .disable-security-btn {
    width: 100%;
  }
}
</style>
