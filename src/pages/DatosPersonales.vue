<template>
  <q-page class="emergency-page" :aria-busy="cargando">
    <!-- =========================================================
         HEADER
    ========================================================== -->
    <div class="page-header">
      <div class="header-container">
        <div class="header-navigation">
          <q-btn flat round dense icon="arrow_back" class="back-btn" @click="regresar" />

          <q-breadcrumbs class="breadcrumbs">
            <q-breadcrumbs-el label="Mi perfil" icon="person" @click="regresar" />

            <q-breadcrumbs-el label="Cédula de contacto" icon="contact_emergency" />
          </q-breadcrumbs>
        </div>

        <div class="header-title">
          <div class="header-title-icon">
            <q-icon name="contact_emergency" />
          </div>

          <div>
            <h1>Cédula de contacto</h1>

            <p>Administra tu información personal y tus contactos de emergencia.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         CONTENIDO
    ========================================================== -->
    <div class="page-container">
      <!-- =======================================================
           IDENTIFICACIÓN DEL EMPLEADO
      ======================================================== -->
      <q-card class="employee-card">
        <div class="employee-card-content">
          <q-avatar size="72px" class="employee-avatar">
            <img :src="empleado.photoUrl || fotoPerfilPredeterminada" alt="Perfil" />
          </q-avatar>

          <div class="employee-info">
            <div class="employee-name">
              {{ empleado.nombre }}
            </div>

            <div class="employee-position">
              {{ empleado.puesto }}
            </div>

            <div class="employee-area">
              <q-icon name="business" />

              {{ empleado.area }}
            </div>
          </div>

          <q-space />

          <div class="cedula-status">
            <div class="status-badge" :class="cedulaCompleta ? 'complete' : 'pending'">
              <q-icon :name="cedulaCompleta ? 'check_circle' : 'warning'" />

              {{ cedulaCompleta ? 'Cédula actualizada' : 'Información pendiente' }}
            </div>
          </div>
        </div>
      </q-card>

      <!-- =======================================================
           MENSAJE DE ESTADO
      ======================================================== -->
      <div class="information-banner" :class="{ complete: cedulaCompleta }">
        <div class="banner-icon">
          <q-icon :name="cedulaCompleta ? 'verified_user' : 'info'" />
        </div>

        <div class="banner-content">
          <div class="banner-title">
            {{
              cedulaCompleta
                ? 'Tu información se encuentra actualizada'
                : 'Completa tu cédula de contacto'
            }}
          </div>

          <div class="banner-text">
            {{
              cedulaCompleta
                ? 'Puedes revisar y actualizar tu información cuando lo necesites.'
                : 'Completa tus datos personales y registra al menos un contacto de emergencia.'
            }}
          </div>
        </div>
      </div>

      <!-- =======================================================
           DATOS PERSONALES PARA EMERGENCIA
      ======================================================== -->
      <q-card class="section-card">
        <div class="section-card-header">
          <div class="section-title-container">
            <div class="section-icon personal">
              <q-icon name="medical_information" />
            </div>

            <div>
              <div class="section-title">Información personal para emergencias</div>

              <div class="section-subtitle">
                Estos datos serán utilizados para facilitar la atención y comunicación en caso de
                una emergencia.
              </div>
            </div>
          </div>
        </div>

        <q-separator />

        <q-form ref="personalForm" class="personal-form" @submit.prevent="guardarDatosPersonales">
          <!-- =====================================================
               UBICACIÓN
          ====================================================== -->
          <div class="form-section-title">
            <q-icon name="location_on" />

            Domicilio
          </div>

          <div class="form-grid">
            <!-- Estado -->
            <q-input v-model="formPersonal.estado" outlined dense label="Estado" readonly>
              <template #prepend>
                <q-icon name="map" />
              </template>
            </q-input>

            <!-- Municipio -->
            <q-select
              v-model="formPersonal.municipalityId"
              outlined
              dense
              label="Municipio"
              :options="municipiosNayarit"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              clearable
              :loading="cargandoMunicipios"
              :rules="[(val) => !!val || 'Seleccione un municipio']"
            >
              <template #prepend>
                <q-icon name="location_city" />
              </template>
            </q-select>

            <!-- Domicilio -->
            <q-input
              v-model="formPersonal.domicilio"
              outlined
              type="textarea"
              autogrow
              label="Domicilio actual"
              class="form-field-wide"
              :rules="[(val) => !!val?.trim() || 'Ingrese su domicilio']"
            >
              <template #prepend>
                <q-icon name="home" />
              </template>
            </q-input>

            <!-- CP -->
            <q-input v-model="formPersonal.cp" outlined dense label="Código postal" mask="#####">
              <template #prepend>
                <q-icon name="markunread_mailbox" />
              </template>
            </q-input>
          </div>

          <!-- =====================================================
               TELÉFONOS
          ====================================================== -->
          <div class="form-section-title">
            <q-icon name="phone" />

            Teléfonos de contacto
          </div>

          <div class="form-grid">
            <!-- Particular -->
            <q-input
              v-model="formPersonal.telefono"
              outlined
              dense
              label="Teléfono particular"
              mask="##########"
              :rules="[validarTelefono]"
            >
              <template #prepend>
                <q-icon name="smartphone" />
              </template>
            </q-input>

            <!-- Casa -->
            <q-input
              v-model="formPersonal.telefono_Casa"
              outlined
              dense
              label="Teléfono de casa"
              mask="##########"
              :rules="[validarTelefono]"
            >
              <template #prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </div>

          <!-- =====================================================
               INFORMACIÓN MÉDICA
          ====================================================== -->
          <div class="form-section-title">
            <q-icon name="health_and_safety" />

            Información médica
          </div>

          <div class="form-grid">
            <!-- Tipo sangre -->
            <q-input
              v-model="formPersonal.tipo_Sangre"
              outlined
              dense
              label="Tipo de sangre"
              class="blood-input"
            >
              <template #prepend>
                <q-icon name="bloodtype" />
              </template>
            </q-input>

            <!-- Alergias -->
            <q-input
              v-model="formPersonal.alergias"
              outlined
              type="textarea"
              autogrow
              label="Alergias"
              hint="Describe cualquier alergia que sea importante conocer."
              class="form-field-wide"
            >
              <template #prepend>
                <q-icon name="sick" />
              </template>
            </q-input>
          </div>

          <!-- =====================================================
               AVISOS DE PRIVACIDAD
          ====================================================== -->
          <div class="privacy-section">
            <div class="form-section-title">
              <q-icon name="privacy_tip" />

              Autorizaciones
            </div>

            <div class="privacy-description">
              Para guardar tu cédula es necesario leer y aceptar las autorizaciones
              correspondientes.
            </div>

            <div class="privacy-option">
              <q-checkbox
                v-model="formPersonal.leido"
                color="primary"
                checked-icon="task_alt"
                unchecked-icon="radio_button_unchecked"
              />

              <div>
                <div class="privacy-option-title">He leído el Aviso de Privacidad</div>

                <a
                  href="https://ieenayarit.org/Transparencia/Avisos/2024/AV_Cedula_contacto_emergencias.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Aviso de Privacidad
                  <q-icon name="open_in_new" />
                </a>
              </div>
            </div>

            <div class="privacy-option">
              <q-checkbox
                v-model="formPersonal.acepta_Aviso_Privacidad"
                color="primary"
                checked-icon="task_alt"
                unchecked-icon="radio_button_unchecked"
              />

              <div class="privacy-option-title">
                Autorizo que mis datos personales sean tratados conforme a las finalidades
                específicas precisadas en el Aviso de Privacidad.
              </div>
            </div>

            <div class="privacy-option">
              <q-checkbox
                v-model="formPersonal.uso_de_datos"
                color="primary"
                checked-icon="task_alt"
                unchecked-icon="radio_button_unchecked"
              />

              <div class="privacy-option-title">
                He proporcionado voluntariamente la información de mis contactos y autorizo al
                Instituto Estatal Electoral de Nayarit para llamar a cualquiera de los contactos
                registrados en caso de emergencia.
              </div>
            </div>
          </div>

          <!-- =====================================================
               ACCIONES
          ====================================================== -->
          <div class="form-actions">
            <q-btn flat no-caps label="Restablecer" icon="restart_alt" @click="restablecerDatos" />

            <q-space />

            <q-btn
              unelevated
              no-caps
              label="Guardar información"
              icon="save"
              class="save-btn"
              type="submit"
            />
          </div>
        </q-form>
      </q-card>

      <!-- =======================================================
           CONTACTOS
      ======================================================== -->
      <q-card class="section-card contacts-card">
        <div class="section-card-header">
          <div class="section-title-container">
            <div class="section-icon contacts">
              <q-icon name="groups" />
            </div>

            <div>
              <div class="section-title">Contactos de emergencia</div>

              <div class="section-subtitle">
                Registra las personas que podemos contactar en caso de emergencia.
              </div>
            </div>
          </div>

          <q-btn
            unelevated
            no-caps
            icon="person_add"
            label="Agregar contacto"
            class="add-contact-btn"
            :disable="contactos.length >= 3"
            @click="abrirNuevoContacto"
          />
        </div>

        <q-separator />

        <!-- =====================================================
             RESUMEN
        ====================================================== -->
        <div class="contacts-summary">
          <div class="summary-item">
            <div class="summary-number">
              {{ contactos.length }}
            </div>

            <div class="summary-label">
              Contacto{{ contactos.length === 1 ? '' : 's' }} registrado{{
                contactos.length === 1 ? '' : 's'
              }}
            </div>
          </div>

          <q-separator vertical />

          <div class="summary-item">
            <q-icon name="phone" color="positive" />

            <div class="summary-label">
              {{ totalTelefonos }} número{{ totalTelefonos === 1 ? '' : 's' }} registrado{{
                totalTelefonos === 1 ? '' : 's'
              }}
            </div>
          </div>

          <q-space />

          <div class="summary-limit" :class="{ warning: contactos.length >= 3 }">
            <q-icon name="info_outline" />

            {{
              contactos.length >= 3
                ? 'Límite de 3 contactos alcanzado'
                : 'Puedes registrar hasta 3 contactos'
            }}
          </div>
        </div>

        <q-separator />

        <!-- =====================================================
             LISTA
        ====================================================== -->
        <div class="contacts-list">
          <!-- EMPTY -->
          <div v-if="contactos.length === 0" class="empty-state">
            <div class="empty-icon">
              <q-icon name="person_off" />
            </div>

            <div class="empty-title">No hay contactos registrados</div>

            <div class="empty-text">
              Agrega una persona de confianza para completar tu cédula de contacto.
            </div>

            <q-btn
              unelevated
              no-caps
              icon="person_add"
              label="Agregar contacto"
              class="add-contact-btn"
              @click="abrirNuevoContacto"
            />
          </div>

          <!-- CONTACTOS -->
          <div v-for="contacto in contactos" v-else :key="contacto.id" class="contact-card">
            <!-- Avatar -->
            <div class="contact-avatar">
              <q-icon name="person" />
            </div>

            <!-- Datos -->
            <div class="contact-information">
              <div class="contact-name">
                {{ obtenerNombreCompleto(contacto) }}
              </div>

              <div class="contact-relation">
                {{ contacto.parentesco }}
              </div>

              <div class="contact-details">
                <div v-if="contacto.telefono_Celular" class="contact-detail">
                  <q-icon name="smartphone" />
                  {{ contacto.telefono_Celular }}
                  <span>Particular</span>
                </div>

                <div v-if="contacto.telefono_Casa" class="contact-detail">
                  <q-icon name="phone" />
                  {{ contacto.telefono_Casa }}
                  <span>Casa</span>
                </div>

                <div v-if="contacto.telefono_Trabajo" class="contact-detail">
                  <q-icon name="business" />
                  {{ contacto.telefono_Trabajo }}
                  <span>Laboral</span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="contact-actions">
              <q-btn
                flat
                round
                icon="edit"
                class="action-btn edit"
                @click="editarContacto(contacto)"
              >
                <q-tooltip> Editar contacto </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                icon="delete_outline"
                class="action-btn delete"
                @click="confirmarEliminar(contacto)"
              >
                <q-tooltip> Eliminar contacto </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </q-card>

      <!-- =======================================================
           AVISO FINAL
      ======================================================== -->
      <div class="bottom-information">
        <q-icon name="privacy_tip" />

        <div>
          <strong> Protección de tu información </strong>

          <span>
            La información registrada en esta cédula será utilizada para fines de contacto en
            situaciones de emergencia, conforme a las autorizaciones proporcionadas.
          </span>
        </div>
      </div>
    </div>

    <!-- =========================================================
         DIALOG CONTACTO
    ========================================================== -->
    <q-dialog v-model="dialogContacto" persistent>
      <q-card class="contact-dialog">
        <!-- HEADER -->
        <div class="dialog-header">
          <div class="dialog-header-icon">
            <q-icon :name="contactoEditando ? 'edit' : 'person_add'" />
          </div>

          <div>
            <div class="dialog-title">
              {{ contactoEditando ? 'Editar contacto' : 'Agregar contacto' }}
            </div>

            <div class="dialog-subtitle">
              {{
                contactoEditando
                  ? 'Actualiza los datos del contacto.'
                  : 'Registra una persona de confianza.'
              }}
            </div>
          </div>

          <q-space />

          <q-btn flat round dense icon="close" @click="cerrarDialogo" />
        </div>

        <q-separator />

        <q-form @submit.prevent="guardarContacto">
          <q-card-section class="dialog-body">
            <!-- =================================================
                 NOMBRE
            ================================================== -->
            <div class="form-section-title dialog-section-title">
              <q-icon name="person" />

              Datos del contacto
            </div>

            <div class="dialog-grid">
              <q-input
                v-model="formContacto.nombre"
                outlined
                dense
                label="Nombre(s)"
                :rules="[(val) => !!val?.trim() || 'El nombre es requerido']"
              />

              <q-input
                v-model="formContacto.apellido_Paterno"
                outlined
                dense
                label="Apellido paterno"
              />

              <q-input
                v-model="formContacto.apellido_Materno"
                outlined
                dense
                label="Apellido materno"
              />

              <q-select
                v-model="formContacto.parentesco"
                outlined
                dense
                label="Parentesco"
                :options="listaParentesco"
                :rules="[(val) => !!val || 'Seleccione un parentesco']"
                emit-value
                map-options
              />
            </div>

            <!-- =================================================
                 TELÉFONOS
            ================================================== -->
            <div class="form-section-title dialog-section-title">
              <q-icon name="phone" />

              Teléfonos
            </div>

            <div class="dialog-grid">
              <q-input
                v-model="formContacto.telefono_Celular"
                outlined
                dense
                label="Teléfono particular"
                mask="##########"
                :rules="[validarTelefonoContacto]"
              >
                <template #prepend>
                  <q-icon name="smartphone" />
                </template>
              </q-input>

              <q-input
                v-model="formContacto.telefono_Casa"
                outlined
                dense
                label="Teléfono de casa"
                mask="##########"
                :rules="[validarTelefonoContacto]"
              >
                <template #prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>

              <q-input
                v-model="formContacto.telefono_Trabajo"
                outlined
                dense
                label="Teléfono laboral"
                mask="##########"
                :rules="[validarTelefonoContacto]"
              >
                <template #prepend>
                  <q-icon name="business" />
                </template>
              </q-input>
            </div>

            <!-- =================================================
                 NOTA
            ================================================== -->
            <div class="contact-note">
              <q-icon name="info_outline" />

              <span> Se requiere al menos un número telefónico para registrar el contacto. </span>
            </div>
          </q-card-section>

          <q-separator />

          <!-- ACTIONS -->
          <q-card-actions class="dialog-actions">
            <q-btn flat no-caps label="Cancelar" @click="cerrarDialogo" />

            <q-btn
              unelevated
              no-caps
              icon="save"
              :label="contactoEditando ? 'Guardar cambios' : 'Guardar contacto'"
              class="save-btn"
              type="submit"
              :disable="!contactoValido"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- =========================================================
         DIALOG ELIMINAR
    ========================================================== -->
    <q-dialog v-model="dialogEliminar">
      <q-card class="delete-dialog">
        <div class="delete-icon">
          <q-icon name="delete_outline" />
        </div>

        <div class="delete-title">¿Eliminar contacto?</div>

        <div class="delete-text">
          ¿Deseas eliminar a

          <strong>
            {{ contactoEliminar ? obtenerNombreCompleto(contactoEliminar) : '' }}
          </strong>

          de tu cédula de contacto?
        </div>

        <div class="delete-warning">
          <q-icon name="warning" />

          Esta acción no se puede deshacer.
        </div>

        <div class="delete-actions">
          <q-btn flat no-caps label="Cancelar" @click="dialogEliminar = false" />

          <q-btn
            unelevated
            no-caps
            color="negative"
            label="Eliminar"
            icon="delete_outline"
            @click="eliminarContacto"
          />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="guardando" persistent no-shake>
      <q-card class="save-loading-card" role="status" aria-live="polite">
        <q-spinner-dots size="48px" color="primary" />
        <div>Se está guardando la información...</div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth.store'
import { employeeContactsApi } from '@/api/employee-contacts.api'
import { employeesApi } from '@/api/employees.api'
import { municipalitiesApi } from '@/api/municipalities.api'
import fotoPerfilPredeterminada from '@/assets/perfil_Hombre.png'

const router = useRouter()

const $q = useQuasar()
const authStore = useAuthStore()

// ================================================================
// EMPLEADO — DATOS LOCALES
// ================================================================

const empleado = ref({ nombre: '—', puesto: '—', area: '—', photoUrl: null })
const cargando = ref(false)
const guardando = ref(false)

// ================================================================
// DATOS PERSONALES
// ================================================================

const datosIniciales = {
  estado: 'Nayarit',
  municipalityId: null,
  domicilio: '',
  cp: '',
  telefono: '',
  telefono_Casa: '',
  tipo_Sangre: '',
  alergias: '',
  leido: false,
  acepta_Aviso_Privacidad: false,
  uso_de_datos: false,
}

const formPersonal = ref({
  ...datosIniciales,
})

// ================================================================
// CONTACTOS
// ================================================================

const contactos = ref([])
const municipiosNayarit = ref([])
const cargandoMunicipios = ref(false)

function mapearContacto(contacto) {
  return {
    ...contacto,
    id: contacto.id,
    nombre: contacto.name || contacto.nombre || '',
    apellido_Paterno: contacto.paternalSurname || contacto.paternalName || contacto.apellido_Paterno || '',
    apellido_Materno: contacto.maternalSurname || contacto.maternalName || contacto.apellido_Materno || '',
    parentesco: contacto.relationship || contacto.parentesco || '',
    telefono_Casa: contacto.homePhone || contacto.telefono_Casa || '',
    telefono_Celular: contacto.mobilePhone || contacto.telefono_Celular || '',
    telefono_Trabajo: contacto.workPhone || contacto.telefono_Trabajo || '',
  }
}

function obtenerPayloadContacto() {
  return {
    name: formContacto.value.nombre.trim(),
    paternalSurname: formContacto.value.apellido_Paterno.trim(),
    maternalSurname: formContacto.value.apellido_Materno.trim(),
    relationship: formContacto.value.parentesco,
    homePhone: formContacto.value.telefono_Casa,
    mobilePhone: formContacto.value.telefono_Celular,
    workPhone: formContacto.value.telefono_Trabajo,
  }
}

async function cargarCedula() {
  cargando.value = true
  cargandoMunicipios.value = true
  try {
    const [data, municipalities] = await Promise.all([
      authStore.loadEmployee(),
      municipalitiesApi.list(),
    ])
    municipiosNayarit.value = municipalities.filter(
      (municipality) => municipality.stateName?.trim().toLocaleLowerCase() === 'nayarit',
    )
    empleado.value = {
      nombre: data.fullName || '—',
      puesto: data.positionName || '—',
      area: data.areaName || '—',
      photoUrl: data.photoUrl || null,
    }
    formPersonal.value = {
      estado: 'Nayarit',
      municipalityId: data.municipalityId || null,
      domicilio: data.address || '',
      cp: data.postalCode || '',
      telefono: data.phone || '',
      telefono_Casa: data.homePhone || '',
      tipo_Sangre: data.bloodType || '',
      alergias: data.allergies || '',
      leido: Boolean(data.hasReadPrivacyNotice),
      acepta_Aviso_Privacidad: Boolean(data.acceptsPrivacyNotice),
      uso_de_datos: Boolean(data.allowsDataUse),
    }
    const rows = await employeeContactsApi.list(data.id)
    contactos.value = rows.map(mapearContacto)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'No fue posible cargar la cédula de contacto.',
      position: 'top-right',
    })
  } finally {
    cargando.value = false
    cargandoMunicipios.value = false
  }
}

onMounted(cargarCedula)

// ================================================================
// CATÁLOGO PARENTESCO
// ================================================================

const listaParentesco = [
  'Esposa(o)',

  'Padre',

  'Madre',

  'Hija(o)',

  'Hermana(o)',

  'Otro',

  'Prefiero no contestar',
]

// ================================================================
// ESTADO DIALOG CONTACTO
// ================================================================

const dialogContacto = ref(false)

const contactoEditando = ref(null)

// ================================================================
// FORM CONTACTO
// ================================================================

const formContacto = ref({
  nombre: '',
  apellido_Paterno: '',
  apellido_Materno: '',
  parentesco: '',
  telefono_Celular: '',
  telefono_Casa: '',
  telefono_Trabajo: '',
})

// ================================================================
// ELIMINAR
// ================================================================

const dialogEliminar = ref(false)

const contactoEliminar = ref(null)

// ================================================================
// COMPUTED
// ================================================================

const totalTelefonos = computed(() => {
  return contactos.value.reduce(
    (total, contacto) => {
      let cantidad = 0

      if (contacto.telefono_Celular) {
        cantidad++
      }

      if (contacto.telefono_Casa) {
        cantidad++
      }

      if (contacto.telefono_Trabajo) {
        cantidad++
      }

      return total + cantidad
    },

    0,
  )
})

const cedulaCompleta = computed(() => {
  const personalCompleto = Boolean(
    formPersonal.value.estado &&
    formPersonal.value.municipalityId &&
    formPersonal.value.domicilio &&
    (formPersonal.value.telefono || formPersonal.value.telefono_Casa),
  )

  const autorizacionesCompletas =
    formPersonal.value.leido &&
    formPersonal.value.acepta_Aviso_Privacidad &&
    formPersonal.value.uso_de_datos

  const tieneContacto = contactos.value.length > 0

  return personalCompleto && autorizacionesCompletas && tieneContacto
})

const contactoValido = computed(() => {
  const nombreValido = formContacto.value.nombre.trim().length > 0

  const parentescoValido = Boolean(formContacto.value.parentesco)

  const telefonoValido = Boolean(
    formContacto.value.telefono_Celular ||
    formContacto.value.telefono_Casa ||
    formContacto.value.telefono_Trabajo,
  )

  return nombreValido && parentescoValido && telefonoValido
})

// ================================================================
// VALIDADORES
// ================================================================

const validarTelefono = (val) => {
  if (!val || val === '') {
    return true
  }

  return val.length === 10 || 'El número de teléfono debe tener 10 dígitos'
}

const validarTelefonoContacto = (val) => {
  if (!val || val === '') {
    return true
  }

  return val.length === 10 || 'El número debe tener 10 dígitos'
}

// ================================================================
// REGRESAR
// ================================================================

const regresar = () => {
  router.back()
}

// ================================================================
// RESTABLECER DATOS
// ================================================================

const restablecerDatos = () => {
  formPersonal.value = {
    ...datosIniciales,
  }

  $q.notify({
    type: 'info',

    icon: 'restart_alt',

    message: 'Los datos se restablecieron.',

    position: 'top-right',
  })
}

// ================================================================
// GUARDAR DATOS PERSONALES
// ================================================================

const guardarDatosPersonales = () => {
  if (
    !formPersonal.value.leido ||
    !formPersonal.value.acepta_Aviso_Privacidad ||
    !formPersonal.value.uso_de_datos
  ) {
    $q.notify({
      type: 'warning',

      icon: 'privacy_tip',

      message: 'Debes aceptar todas las autorizaciones para guardar la cédula.',

      position: 'top-right',
    })

    return
  }

  actualizarDatosEmpleado()
}

async function actualizarDatosEmpleado() {
  const employee = authStore.employee
  if (!employee?.id) {
    $q.notify({
      type: 'negative',
      message: 'No se encontró el identificador del empleado.',
      position: 'top-right',
    })
    return
  }

  const payload = {
    areaId: employee.areaId,
    positionId: employee.positionId,
    treatmentId: employee.treatmentId,
    employeeTypeId: employee.employeeTypeId,
    name: employee.name,
    paternalSurname: employee.paternalSurname,
    maternalSurname: employee.maternalSurname,
    email: employee.email,
    secondaryEmail: employee.secondaryEmail,
    birthDate: employee.birthDate?.slice(0, 10),
    rfc: employee.rfc,
    curp: employee.curp,
    voterKey: employee.voterKey,
    socialSecurityNumber: employee.socialSecurityNumber,
    phone: formPersonal.value.telefono,
    gender: employee.gender,
    isActive: employee.isActive,
    address: formPersonal.value.domicilio,
    municipalityId: formPersonal.value.municipalityId,
    postalCode: formPersonal.value.cp,
    homePhone: formPersonal.value.telefono_Casa,
    bloodType: formPersonal.value.tipo_Sangre,
    allergies: formPersonal.value.alergias,
    acceptsPrivacyNotice: formPersonal.value.acepta_Aviso_Privacidad,
    hasReadPrivacyNotice: formPersonal.value.leido,
    allowsDataUse: formPersonal.value.uso_de_datos,
    isPrerecorded: employee.isPrerecorded,
    bankAccount: employee.bankAccount,
    acceptedByName: employee.acceptedByName,
    checkerId: employee.checkerId,
  }

  guardando.value = true
  try {
    const updatedEmployee = await employeesApi.update(employee.id, payload)
    authStore.employee = { ...employee, ...updatedEmployee, ...payload }
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Información personal guardada correctamente.',
      position: 'top-right',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      icon: 'error',
      message: error.message || 'No fue posible guardar la información personal.',
      position: 'top-right',
    })
  } finally {
    guardando.value = false
  }
}

// ================================================================
// ABRIR NUEVO CONTACTO
// ================================================================

const abrirNuevoContacto = () => {
  contactoEditando.value = null

  formContacto.value = {
    nombre: '',

    apellido_Paterno: '',

    apellido_Materno: '',

    parentesco: '',

    telefono_Celular: '',

    telefono_Casa: '',

    telefono_Trabajo: '',
  }

  dialogContacto.value = true
}

// ================================================================
// EDITAR CONTACTO
// ================================================================

const editarContacto = (contacto) => {
  contactoEditando.value = contacto.id

  formContacto.value = {
    nombre: contacto.nombre || '',

    apellido_Paterno: contacto.apellido_Paterno || '',

    apellido_Materno: contacto.apellido_Materno || '',

    parentesco: contacto.parentesco || '',

    telefono_Celular: contacto.telefono_Celular || '',

    telefono_Casa: contacto.telefono_Casa || '',

    telefono_Trabajo: contacto.telefono_Trabajo || '',
  }

  dialogContacto.value = true
}

// ================================================================
// GUARDAR CONTACTO
// ================================================================

const guardarContacto = async () => {
  if (!contactoValido.value) {
    $q.notify({
      type: 'negative',

      icon: 'error',

      message: 'Completa los datos requeridos y registra al menos un teléfono.',

      position: 'top-right',
    })

    return
  }

  try {
    guardando.value = true
    const employeeId = authStore.employee?.id
    if (!employeeId) throw new Error('No se encontró el identificador del empleado.')
    const payload = obtenerPayloadContacto()
    if (contactoEditando.value) {
      await employeeContactsApi.update(employeeId, contactoEditando.value, payload)
    } else {
      await employeeContactsApi.create(employeeId, payload)
    }
    contactos.value = (await employeeContactsApi.list(employeeId)).map(mapearContacto)

    $q.notify({ type: 'positive', icon: 'check_circle', message: 'Contacto guardado correctamente.', position: 'top-right' })
    cerrarDialogo()
  } catch (error) {
    $q.notify({ type: 'negative', icon: 'error', message: error.message || 'No fue posible guardar el contacto.', position: 'top-right' })
  } finally {
    guardando.value = false
  }
}

// ================================================================
// CERRAR DIALOG
// ================================================================

const cerrarDialogo = () => {
  dialogContacto.value = false

  contactoEditando.value = null
}

// ================================================================
// NOMBRE COMPLETO
// ================================================================

const obtenerNombreCompleto = (contacto) => {
  return [contacto.nombre, contacto.apellido_Paterno, contacto.apellido_Materno]

    .filter(Boolean)

    .join(' ')
}

// ================================================================
// ELIMINAR
// ================================================================

const confirmarEliminar = (contacto) => {
  contactoEliminar.value = contacto

  dialogEliminar.value = true
}

const eliminarContacto = async () => {
  if (!contactoEliminar.value) {
    return
  }

  try {
    guardando.value = true
    const employeeId = authStore.employee?.id
    if (!employeeId) throw new Error('No se encontró el identificador del empleado.')
    await employeeContactsApi.remove(employeeId, contactoEliminar.value.id)
    contactos.value = contactos.value.filter((contacto) => contacto.id !== contactoEliminar.value.id)
    $q.notify({ type: 'positive', icon: 'check_circle', message: 'Contacto eliminado correctamente.', position: 'top-right' })
  } catch (error) {
    $q.notify({ type: 'negative', icon: 'error', message: error.message || 'No fue posible eliminar el contacto.', position: 'top-right' })
  } finally {
    guardando.value = false
    contactoEliminar.value = null
    dialogEliminar.value = false
  }
}
</script>

<style scoped>
.save-loading-card {
  display: flex;
  min-width: min(320px, calc(100vw - 40px));
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 28px;
  text-align: center;
}

/* ================================================================
   GENERAL
================================================================ */

.emergency-page {
  min-height: 100%;

  background: #f5f7fa;

  padding-bottom: 45px;
}

/* ================================================================
   HEADER
================================================================ */

.page-header {
  background: #ffffff;

  border-bottom: 1px solid #e6e9ed;
}

.header-container {
  max-width: 1250px;

  margin: auto;

  padding: 18px 24px 24px;
}

.header-navigation {
  display: flex;

  align-items: center;

  gap: 8px;
}

.back-btn {
  color: #667085;
}

.breadcrumbs {
  color: #667085;

  font-size: 13px;
}

.header-title {
  display: flex;

  align-items: center;

  gap: 17px;

  margin-top: 25px;
}

.header-title-icon {
  width: 58px;

  height: 58px;

  min-width: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  background: #eee5f3;

  color: #6b2c91;

  font-size: 29px;
}

.header-title h1 {
  margin: 0;

  color: #263238;

  font-size: 25px;

  font-weight: 700;
}

.header-title p {
  margin: 5px 0 0;

  color: #98a2b3;

  font-size: 13px;
}

/* ================================================================
   CONTAINER
================================================================ */

.page-container {
  max-width: 1250px;

  margin: auto;

  padding: 25px 24px;
}

/* ================================================================
   EMPLEADO
================================================================ */

.employee-card {
  border-radius: 16px;

  border: 1px solid #e5e8ed;

  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.035);
}

.employee-card-content {
  display: flex;

  align-items: center;

  gap: 17px;

  padding: 22px 25px;
}

.employee-avatar {
  border: 3px solid #f1edf4;
}

.employee-info {
  min-width: 0;
}

.employee-name {
  color: #344054;

  font-size: 18px;

  font-weight: 700;
}

.employee-position {
  color: #667085;

  font-size: 13px;

  margin-top: 2px;
}

.employee-area {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #98a2b3;

  font-size: 12px;

  margin-top: 7px;
}

.cedula-status {
  margin-left: 15px;
}

.status-badge {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 13px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;
}

.status-badge.complete {
  background: #eaf7ee;

  color: #188038;
}

.status-badge.pending {
  background: #fff5e3;

  color: #a96800;
}

/* ================================================================
   BANNER
================================================================ */

.information-banner {
  display: flex;

  align-items: center;

  gap: 14px;

  margin-top: 17px;

  padding: 17px 20px;

  border-radius: 13px;

  background: #fff8e9;

  border: 1px solid #f3dfae;
}

.information-banner.complete {
  background: #eef9f2;

  border-color: #ccebd7;
}

.banner-icon {
  width: 42px;

  height: 42px;

  min-width: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.7);

  color: #b87500;

  font-size: 21px;
}

.complete .banner-icon {
  color: #188038;
}

.banner-title {
  color: #344054;

  font-weight: 700;

  font-size: 14px;
}

.banner-text {
  color: #667085;

  font-size: 12px;

  margin-top: 3px;
}

/* ================================================================
   CARD SECCIONES
================================================================ */

.section-card {
  margin-top: 18px;

  border-radius: 16px;

  border: 1px solid #e5e8ed;

  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.035);

  overflow: hidden;
}

.section-card-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 22px 25px;
}

.section-title-container {
  display: flex;

  align-items: center;

  gap: 13px;
}

.section-icon {
  width: 45px;

  height: 45px;

  min-width: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  font-size: 22px;
}

.section-icon.personal {
  background: #eee5f3;

  color: #6b2c91;
}

.section-icon.contacts {
  background: #edf5fb;

  color: #2875bd;
}

.section-title {
  color: #344054;

  font-weight: 700;

  font-size: 17px;
}

.section-subtitle {
  max-width: 700px;

  color: #98a2b3;

  font-size: 12px;

  margin-top: 3px;
}

/* ================================================================
   FORM
================================================================ */

.personal-form {
  padding: 25px;
}

.form-section-title {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-bottom: 15px;

  color: #344054;

  font-size: 14px;

  font-weight: 700;
}

.form-section-title .q-icon {
  color: #6b2c91;
}

.form-section-title:not(:first-child) {
  margin-top: 25px;
}

.form-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 17px;
}

.form-field-wide {
  grid-column: span 2;
}

.blood-input {
  max-width: 260px;
}

/* ================================================================
   PRIVACIDAD
================================================================ */

.privacy-section {
  margin-top: 28px;

  padding: 20px;

  border-radius: 13px;

  background: #faf8fc;

  border: 1px solid #e9e0ee;
}

.privacy-description {
  color: #667085;

  font-size: 12px;

  margin: -3px 0 15px 29px;
}

.privacy-option {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin-top: 9px;
}

.privacy-option-title {
  color: #475467;

  font-size: 12px;

  line-height: 1.5;

  padding-top: 7px;
}

.privacy-option a {
  display: inline-flex;

  align-items: center;

  gap: 4px;

  margin-top: 3px;

  color: #6b2c91;

  font-size: 12px;

  text-decoration: none;
}

.privacy-option a:hover {
  text-decoration: underline;
}

/* ================================================================
   ACTIONS
================================================================ */

.form-actions {
  display: flex;

  align-items: center;

  gap: 8px;

  margin-top: 25px;

  padding-top: 20px;

  border-top: 1px solid #eef0f3;
}

.save-btn {
  background: #6b2c91;

  color: #ffffff;

  border-radius: 9px;

  padding: 9px 17px;
}

/* ================================================================
   CONTACTS HEADER
================================================================ */

.contacts-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 22px 25px;
}

.add-contact-btn {
  background: #6b2c91;

  color: white;

  border-radius: 9px;

  padding: 9px 16px;
}

/* ================================================================
   CONTACT SUMMARY
================================================================ */

.contacts-summary {
  display: flex;

  align-items: center;

  gap: 20px;

  padding: 15px 25px;
}

.summary-item {
  display: flex;

  align-items: center;

  gap: 8px;
}

.summary-number {
  color: #344054;

  font-size: 21px;

  font-weight: 700;
}

.summary-label {
  color: #98a2b3;

  font-size: 12px;
}

.summary-limit {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #98a2b3;

  font-size: 11px;
}

.summary-limit.warning {
  color: #a96800;
}

/* ================================================================
   CONTACT LIST
================================================================ */

.contacts-list {
  padding: 8px 25px 25px;
}

.contact-card {
  display: flex;

  align-items: center;

  gap: 17px;

  padding: 18px 15px;

  margin-top: 10px;

  border: 1px solid #e8ebef;

  border-radius: 13px;

  transition: 0.2s ease;
}

.contact-card:hover {
  border-color: #d6c7df;

  box-shadow: 0 4px 14px rgba(107, 44, 145, 0.06);
}

.contact-avatar {
  width: 52px;

  height: 52px;

  min-width: 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #f0ebf3;

  color: #6b2c91;

  font-size: 22px;
}

.contact-information {
  flex: 1;

  min-width: 0;
}

.contact-name {
  color: #344054;

  font-size: 15px;

  font-weight: 700;
}

.contact-relation {
  color: #98a2b3;

  font-size: 12px;

  margin-top: 3px;
}

.contact-details {
  display: flex;

  flex-wrap: wrap;

  gap: 12px;

  margin-top: 9px;
}

.contact-detail {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #667085;

  font-size: 12px;
}

.contact-detail .q-icon {
  color: #6b2c91;
}

.contact-detail span {
  color: #98a2b3;

  font-size: 10px;
}

.contact-actions {
  display: flex;

  gap: 2px;
}

.action-btn {
  color: #98a2b3;
}

.action-btn.edit:hover {
  color: #6b2c91;

  background: #f4edf7;
}

.action-btn.delete:hover {
  color: #c62828;

  background: #fff0f0;
}

/* ================================================================
   EMPTY
================================================================ */

.empty-state {
  text-align: center;

  padding: 48px 20px;
}

.empty-icon {
  width: 65px;

  height: 65px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: auto;

  border-radius: 50%;

  background: #f4f1f5;

  color: #9b86a6;

  font-size: 28px;
}

.empty-title {
  margin-top: 14px;

  color: #344054;

  font-size: 16px;

  font-weight: 700;
}

.empty-text {
  max-width: 430px;

  margin: 6px auto 18px;

  color: #98a2b3;

  font-size: 12px;
}

/* ================================================================
   BOTTOM INFO
================================================================ */

.bottom-information {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  margin-top: 18px;

  padding: 15px 18px;

  border-radius: 11px;

  background: #f9fafb;

  color: #667085;

  font-size: 11px;
}

.bottom-information > .q-icon {
  color: #6b2c91;

  font-size: 19px;
}

.bottom-information div {
  display: flex;

  flex-direction: column;

  gap: 3px;
}

.bottom-information strong {
  color: #475467;
}

/* ================================================================
   DIALOG CONTACTO
================================================================ */

.contact-dialog {
  width: 620px;

  max-width: 95vw;

  border-radius: 17px;

  overflow: hidden;
}

.dialog-header {
  display: flex;

  align-items: center;

  gap: 13px;

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

  font-size: 22px;
}

.dialog-title {
  color: #344054;

  font-size: 17px;

  font-weight: 700;
}

.dialog-subtitle {
  color: #98a2b3;

  font-size: 12px;

  margin-top: 2px;
}

.dialog-body {
  padding: 23px;
}

.dialog-section-title {
  margin-top: 0 !important;

  margin-bottom: 17px;
}

.dialog-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 16px;
}

.contact-note {
  display: flex;

  align-items: flex-start;

  gap: 7px;

  margin-top: 20px;

  padding: 12px;

  border-radius: 9px;

  background: #f8f6fa;

  color: #667085;

  font-size: 11px;
}

.contact-note .q-icon {
  color: #6b2c91;
}

.dialog-actions {
  justify-content: flex-end;

  padding: 14px 20px;
}

/* ================================================================
   DELETE DIALOG
================================================================ */

.delete-dialog {
  width: 400px;

  max-width: 92vw;

  border-radius: 17px;

  padding: 28px;

  text-align: center;
}

.delete-icon {
  width: 60px;

  height: 60px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: auto;

  border-radius: 50%;

  background: #fff0f0;

  color: #c62828;

  font-size: 28px;
}

.delete-title {
  margin-top: 17px;

  color: #344054;

  font-size: 19px;

  font-weight: 700;
}

.delete-text {
  margin-top: 8px;

  color: #667085;

  font-size: 13px;

  line-height: 1.5;
}

.delete-warning {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  margin-top: 17px;

  padding: 10px;

  border-radius: 9px;

  background: #fff8e9;

  color: #a96800;

  font-size: 11px;
}

.delete-actions {
  display: flex;

  justify-content: flex-end;

  gap: 8px;

  margin-top: 23px;
}

/* ================================================================
   RESPONSIVE
================================================================ */

@media (max-width: 800px) {
  .section-card-header,
  .contacts-header {
    align-items: flex-start;

    flex-direction: column;
  }

  .add-contact-btn {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field-wide {
    grid-column: auto;
  }

  .blood-input {
    max-width: none;
  }

  .dialog-grid {
    grid-template-columns: 1fr;
  }

  .summary-help {
    width: 100%;
  }
}

@media (max-width: 650px) {
  .header-container,
  .page-container {
    padding-left: 14px;

    padding-right: 14px;
  }

  .header-title {
    align-items: flex-start;
  }

  .header-title h1 {
    font-size: 21px;
  }

  .employee-card-content {
    align-items: flex-start;
  }

  .cedula-status {
    display: none;
  }

  .personal-form {
    padding: 18px 14px;
  }

  .contacts-summary {
    flex-wrap: wrap;
  }

  .contacts-list {
    padding-left: 12px;

    padding-right: 12px;
  }

  .contact-card {
    align-items: flex-start;
  }

  .contact-actions {
    flex-direction: column;
  }

  .contact-details {
    flex-direction: column;

    gap: 5px;
  }
}

@media (max-width: 500px) {
  .employee-card-content {
    padding: 18px;
  }

  .employee-avatar {
    width: 58px;

    height: 58px;
  }

  .employee-name {
    font-size: 15px;
  }

  .employee-position,
  .employee-area {
    font-size: 11px;
  }

  .section-title {
    font-size: 15px;
  }

  .privacy-section {
    padding: 14px;
  }
}
</style>
