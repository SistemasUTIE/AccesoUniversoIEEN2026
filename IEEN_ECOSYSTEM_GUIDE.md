# Guía de integración para micrositios IEEN

Usa esta guía al revisar o crear un micrositio que pertenezca al ecosistema de aplicaciones del IEEN. Conserva el stack y la arquitectura del proyecto existente. No migres tecnologías, no actualices librerías y no reemplaces decisiones locales sin evidencia.

## Prompt para iniciar un proyecto

> Lee primero `IEEN_ECOSYSTEM_GUIDE.md` y las instrucciones locales (`AGENTS.md`, README y configuración del proyecto). Evalúa el proyecto antes de cambiarlo. Alinea autenticación, Axios, permisos, retorno al portal, botón morado y BottomSheet con esta guía y con el contrato vigente de AccesoIEEN. Conserva las vistas, rutas, APIs de negocio y modificaciones locales no relacionadas. Si un contrato de API o una relación entre registros no está documentado, detente en la lectura estática y solicita ese dato antes de cambiar escrituras. Explica el alcance y los archivos antes de editar; después entrega los cambios concretos y las comprobaciones realizadas.

## Antes de editar

1. Confirma el proyecto y la ruta exactos. Busca sus archivos de sesión, Axios, rutas, stores, layouts, estilos institucionales y llamadas de permisos.
2. Compara con el contrato actual que sigue esta guía; no copies código a ciegas desde otro micrositio.
3. Respeta las modificaciones existentes. No reemplaces archivos completos si un cambio acotado resuelve la diferencia.
4. No expongas valores de `.env`, tokens, claves ni respuestas que incluyan credenciales.

## Stack y arquitectura

- Mantén las tecnologías que ya usa el micrositio. En los sistemas Vue, respeta la versión local de Vue/Quasar y la estructura de carpetas existente.
- El proyecto IEEN de micrositios Laravel sigue su arquitectura CSS: `public/css/micrositios-base.css` está protegido; las variaciones van en `public/css/especificos/<micrositio>.css`, con alcance bajo el contenedor del micrositio.
- En los SPA Vue existentes, conserva los tokens `--ieen-*` definidos por el sistema y los estilos scoped existentes. Los valores institucionales compartidos actualmente incluyen morado `#5b2d82`, morado oscuro `#452263`, secundario `#73509a` y fondo suave `#f0e9f7`.
- Mantén separados los endpoints y los modelos propios de cada micrositio; comparte contratos de autenticación, no APIs de negocio que tengan distinto propósito.

## Axios y configuración

- Mantén una sola instancia Axios autenticada por aplicación en `src/api/http.js`. Los archivos de `src/api/` deben importarla desde `./http`; el boot de Axios solo conecta `$axios` y `$api` a Quasar y puede reexportar la instancia por compatibilidad.
- Lee `QCLI_API_BASE_URL` y `QCLI_LOGIN_URL` del entorno. En desarrollo se permiten URLs HTTP y valores de respaldo de desarrollo; en producción ambas URLs deben usar HTTPS. `.env.example` no sustituye la configuración local.
- Agrega `Authorization: Bearer <token>` a las llamadas autenticadas. Las llamadas de login y desafío MFA deben usar `skipAuth: true` para no adjuntar el token vencido.
- Un `401` de una llamada autenticada dispara `auth:reauthentication-required`; no debe redirigir inmediatamente al login. Un `401` de login/MFA se muestra dentro del diálogo y no debe disparar el evento.
- La instancia expone `redirectToLogin(returnToPanel)` y `notifyReauthenticationRequired(reason)` para mantener el mismo manejo entre proyectos.

## Sesión, expiración y MFA

- El token y los datos de sistema se reciben desde AccesoIEEN mediante `key`, `system` y, cuando aplique, `usr`. Limpia esos parámetros de la barra del navegador después de guardar la sesión.
- Detecta la expiración por `exp` del JWT. Al vencer, conserva el estado de navegación y muestra un diálogo modal persistente que bloquea el micrositio.
- El diálogo usa `POST /Auth/login` con `{ userName, password }`. Si la respuesta contiene `challengeId` y requiere MFA, completa el desafío en `POST /Auth/two-factor` con `{ challengeId, code }`. No confundas esta operación con las rutas de enrolamiento MFA del perfil.
- Al terminar login/MFA, almacena el token nuevo, actualiza el usuario/ID, programa su expiración y recarga permisos antes de cerrar el diálogo. La ruta actual debe conservarse.
- Ofrece “Volver al portal AccesoIEEN”; esa acción cierra la sesión local y usa el retorno de salida (`return=false`). “Regresar al panel” conserva el token para validarlo en AccesoIEEN (`return=true`).
- El `401` sirve también para abrir el flujo de renovación cuando el servidor rechaza un token antes de que venza el reloj local.

## Permisos

- Para cargar los permisos del usuario usa `GET /ModuleUserPermissions/user/{userId}`. Cada registro contiene `moduleId`, `userId`, `hasAccess`, `canCreate`, `canRead`, `canUpdate` y `canDelete`; la captura de Swagger confirmó este contrato de lectura.
- Cruza esos registros por `moduleId` con los módulos del sistema actual. Filtra por `userId` cuando la respuesta incluya ese campo. No uses el endpoint eliminado `GET /ModuleUserAccesses/user/{userId}` para inicializar la sesión.
- Normaliza booleanos tolerando `true`/`false`, `1`/`0` y variantes de mayúsculas, y tolera nombres de propiedades camelCase/PascalCase si la API los entrega.
- `hasAccess` debe ser verdadero además del `can*` específico para habilitar una acción. La autorización real siempre corresponde al backend; ocultar controles en Vue solo mejora la interfaz.
- El endpoint combinado de lectura no documenta por sí solo qué ID usar para actualizar por separado accesos y permisos. No reutilices el `id` devuelto para endpoints de escritura sin confirmar el contrato.

## Interfaz compartida

- El botón de aplicaciones usa el morado institucional `var(--ieen-brand)`, texto/icono blanco y `aria-label` descriptivo.
- El `BottomSheet` enumera sistemas del usuario y conserva las opciones `logout` (cerrar sesión) y `return-to-panel` (volver al panel). La navegación de sistema agrega `key=<token>` y `system=<systemName>` a la URL configurada para ese sistema.
- Mantén el mismo diseño de bienvenida, diálogo de renovación, campos, estados de carga, errores accesibles, MFA y botón de retorno. No elimines el foco visible ni el bloqueo modal.
- Conserva la identidad visual IEEN, diseño responsive y etiquetas accesibles. Evita colores nuevos o componentes duplicados.

## Comprobación y entrega

- Revisa que no haya URLs de API duplicadas ni interceptores distintos entre el boot y la capa API.
- Busca todas las referencias a `ModuleUserAccesses/user` antes de declarar migrada la lectura de permisos. Distingue las pantallas CRUD que también necesitan IDs de escritura.
- Ejecuta los chequeos disponibles del proyecto cuando el usuario pida verificar o cuando formen parte de la entrega acordada. Informa con precisión si solo hiciste lectura estática, lint, build o prueba real contra backend/navegador.
- Resume los archivos modificados, el contrato respetado, los chequeos ejecutados y cualquier contrato pendiente. No declares probado un flujo que no recorriste.
