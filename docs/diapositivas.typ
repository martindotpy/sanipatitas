#import "@preview/touying:0.7.3": *
#import themes.metropolis: *
#import "@preview/numbly:0.1.0": numbly

#show: metropolis-theme.with(
  aspect-ratio: "16-9",
  footer: self => self.info.institution,
  config-colors(
    primary: rgb("#e74e4e"),
    primary-light: rgb("#e63737"),
    secondary: rgb("#1a1a1a"),
    neutral-lightest: rgb("#FFFFFF"),
    neutral-dark: rgb("#333333"),
    neutral-darkest: rgb("#000000"),
  ),
  config-info(
    title: [Sanipatitas — HC Veterinaria],
    subtitle: [Arquitectura Orientada al Servicio],
    author: [
      Alcántara Paico, Luis Sebastián \
      Contreras Delgado, Jorge Renzo Paolo \
      Huamán Domador, Luis Alberto \
      Ramos Yampufe, Martin Alexander \
      Ruiz Cardoza, Richard
    ],
    date: datetime.today(),
    institution: [Universidad Tecnológica del Perú],
  ),
)

#set heading(numbering: numbly("{1}.", default: "1.1"))

#title-slide()


= Implementación Backend

== Servicios del sistema

#align(center)[
  #table(
    columns: (1.8fr, 3fr, 2.5fr),
    align: (left, left, left),
    inset: 8pt,
    stroke: 0.5pt,
    table.header([*Servicio*], [*Interfaz REST*], [*Implementación*]),
    [Auth Service], [`POST /sign-in/email` + `GET /jwks` + admin CRUD], [Bun + Elysia + Better Auth],

    [Patient Service],
    [CRUD `/patient` + `/client` + `/species` + `/breed`],
    [Java 25 + Quarkus 3.37.0 + Hibernate Reactive],

    [Appointment Service],
    [CRUD `/appointment` + `GET /appointment/events` (SSE)],
    [Java 25 + Quarkus 3.37.0 + Hibernate Reactive],
  )
]

Los tres servicios comparten librerías comunes, lo que garantiza consistencia en
modelos de dominio, validaciones y middleware transversal.

== API REST y base de datos

Cada servicio expone una API REST documentada con OpenAPI 3.0. Las
especificaciones se generan automáticamente: SmallRye OpenAPI en Quarkus y
Better Auth en Elysia.

#align(center)[
  #table(
    columns: (1.5fr, 3fr, 2.5fr),
    align: (left, left, left),
    inset: 7pt,
    stroke: 0.5pt,
    table.header([*Servicio*], [*Endpoint*], [*Roles*]),
    [Auth], [`POST /api/auth/sign-in/email`], [público],
    [Auth], [`POST /api/auth/sign-up/email`], [público],
    [Auth], [`GET /api/auth/jwks`], [público],
    [Auth], [`POST /api/auth/token`], [público],
    [Auth], [`GET /api/auth/session`], [autenticado],
    [Auth], [`*/api/auth/admin/*`], [admin],
    [Patient], [`GET /api/patient`], [admin, veterinarian, worker],
    [Patient], [`POST /api/patient`], [admin, worker],
    [Patient], [`PUT /api/patient/{id}`], [admin, worker],
    [Patient], [`DELETE /api/patient/{id}`], [admin],
    [Appointment], [`GET /api/appointment`], [admin, veterinarian, worker],
    [Appointment], [`POST /api/appointment`], [admin, veterinarian, worker],
    [Appointment], [`PUT /api/appointment/{id}`], [admin, veterinarian, worker],
    [Appointment], [`DELETE /api/appointment/{id}`], [admin],
    [Appointment], [`GET /api/appointment/events`], [admin, veterinarian, worker],
  )
]

PostgreSQL 17 con `tsvector` para texto completo en español y claves UUID v7.

== Comunicación entre servicios

HAProxy expone un único punto de entrada y enruta según el prefijo de la ruta:

```text
/api/auth        -> auth:3000
/api/patient     -> patient:8080
/api/appointment -> appointment:8081
/*               -> frontend:1420
```

La comunicación inter-servicios se realiza mediante HTTP con propagación de
token JWT. Cada servicio valida el token de forma autónoma consultando el
endpoint JWKS del Auth Service, eliminando la dependencia de un punto central de
validación en cada petición.


= Integración Frontend

== Stack del cliente

El frontend está construido con *Astro 6* (SSR con adaptador Node.js) y *React
19*. Se distribuye como PWA y como aplicación de escritorio mediante *Tauri*
(Rust).

#align(center)[
  #table(
    columns: (1.5fr, 3fr),
    align: (left, left),
    inset: 6pt,
    stroke: 0.5pt,
    table.header([*Capa*], [*Tecnología*]),
    [Routing], [TanStack Router con code-splitting por archivo],
    [Estilos], [Tailwind CSS v4 + `@base-ui/react` + `@sanipatitas/ui`],
    [Estado], [TanStack React Query + nanostores],
    [Formularios], [React Hook Form + Zod],
    [Tablas], [TanStack React Table],
    [Cliente API], [`@hey-api/openapi-ts` generado desde OpenAPI],
    [Iconos], [React Icons (Tabler), SVG vía `vite-plugin-svgr`],
    [Notificaciones], [Sonner (toasts)],
    [Temas], [next-themes (claro/oscuro)],
    [PWA], [`@vite-pwa/astro` con Workbox],
  )
]

== Cliente API generado automáticamente

`@hey-api/openapi-ts` genera automáticamente tipos TypeScript, funciones HTTP y
hooks de TanStack React Query a partir de los esquemas OpenAPI de cada servicio.
Cada servicio expone su especificación en un endpoint dedicado:

- Auth: `GET /api/auth/openapi.json`
- Patient: `GET /api/patient/openapi.json`
- Appointment: `GET /api/appointment/openapi.json`

Un script de build (`generate-api-client`) consulta los tres endpoints y
produce:

#cols[
  - `sdk.gen.ts` — funciones `fetch` tipadas
  - `types.gen.ts` — interfaces TypeScript
][
  - `zod.gen.ts` — esquemas Zod para validación
  - `@tanstack/react-query.gen.ts` — hooks `useQuery` y `useMutation`
]

Cada petición incluye el JWT en `Authorization: Bearer {token}`, almacenado en
cookie `httpOnly` (`sanipatitas.session_token`). Si el backend responde `401`,
se redirige al login.

== Flujos de usuario principales

*Identificación por QR.* Escaneo del código `sanipatitas://patient/{uuid}` →
extracción del UUID → `GET /api/patient/{uuid}` → ficha del paciente en panel
lateral.

*Gestión de citas.* Selección de paciente y cliente → verificación de
disponibilidad → registro de cita. Appointment Service publica evento SSE que
actualiza la vista de todos los usuarios en tiempo real.

*Consulta de historial.* El veterinario accede a la ficha y consulta el
historial. Las tablas de Hibernate Envers (`patient_aud`, `appointment_aud`)
permiten reconstruir el historial completo de cambios.


= Administración de Procesos y Auditoría

== Servicio transversal de auditoría

Registro de transacciones críticas (`POST`, `PUT`, `PATCH`, `DELETE`) sobre
pacientes, clientes, especies, razas, citas y autenticación. Cada evento
registra:

- `type`: `"audit"` para distinguir de otros logs
- `who`: usuario del claim `sub` del JWT, y `role` del usuario
- `when`: timestamp ISO-8601 con milisegundos
- `service`: servicio de origen (`patient`, `appointment`, `auth`)
- `action`: tipo de operación (`CREATE`, `UPDATE`, `DELETE`)
- `resourceType` y `resourceId`: recurso afectado
- `method`, `path`, `status` y `durationMs`: metadatos HTTP
- `correlationId`: trazabilidad entre servicios

Implementación en tres capas:

*Logs en tiempo real.* `AuditLogFilter` en Quarkus y `auditMiddleware` en Elysia
interceptan cada petición y emiten logs JSON con el mismo esquema de campos.

*Hibernate Envers.* `quarkus-hibernate-envers` sobre una unidad JDBC dedicada.
Cada entidad `@Audited` genera tablas `_AUD` con snapshots históricos.
`SanipatitasRevisionEntity` registra `username` y `role` por revisión. Tablas:
`revinfo`, `patient_aud`, `client_aud`, `appointment_aud`, `breed_aud`,
`species_aud`, `user_aud`.

== Centralización en Loki y Grafana

Los servicios envían logs directamente a *Loki* mediante HTTP, sin plugins de
Docker ni sidecars:

#align(center)[
  #table(
    columns: (1.5fr, 2fr),
    align: (left, left),
    inset: 6pt,
    stroke: 0.5pt,
    table.header([*Servicio*], [*Mecanismo*]),
    [Auth (Elysia/Bun)], [`loki-transport.ts` (Pino)],
    [Patient (Quarkus)], [`LokiLogHandler` (JUL)],
    [Appointment (Quarkus)], [`LokiLogHandler` (JUL)],
  )
]

`LokiLogHandler` se registra automáticamente mediante `LokiLogSetup`
(`@Observes @Initialized`). Bufferea lotes de 100 registros y los envía
asíncronamente. Variables: `LOKI_ENABLED=true`, `LOKI_URL`, `SERVICE_NAME`.

Los dashboards de Grafana se aprovisionan automáticamente. LogQL:
```logql
{service=~"patient|appointment|auth"} | json | type="audit"
```


= Modelado de procesos con BPMN

== Procesos modelados con Camunda 8

Se utilizó *Camunda 8* con *BPMN 2.0* para modelar los flujos de negocio del
sistema. Se modelaron cinco procesos:

#figure(
  image("/assets/diagrams/auditoria-transaccion-critica.png", width: 100%),
  caption: [Auditoría de transacción crítica],
)

#figure(
  image("/assets/diagrams/aprobacion-cita-veterinaria.png", width: 100%),
  caption: [Aprobación de cita veterinaria],
)

#figure(
  image("/assets/diagrams/gestion-productos-stock.png", width: 100%),
  caption: [Gestión de productos y control de stock],
)

#figure(
  image("/assets/diagrams/registro-paciente.png", width: 100%),
  caption: [Registro de paciente],
)

#figure(
  image("/assets/diagrams/flujo-autenticacion.png", width: 100%),
  caption: [Flujo de autenticación y autorización],
)


= Seguridad Implementada

== Autenticación con JWT (ES256)

*Flujo de autenticación:*
- Credenciales → `POST /api/auth/sign-in/email`
- Better Auth valida contra la tabla `user` de PostgreSQL (hash bcrypt)
- Sesión en Redis + JWT firmado con ES256 (curva P-256), clave privada
  almacenada en la tabla `jwks`
- Claims: `sub` (UUID), `role` (`admin`/`veterinarian`/`worker`), `iss`, `aud`,
  `exp`, `iat`
- Token en cookie `httpOnly` y en header `Authorization: Bearer {token}`

*Validación autónoma:*
```properties
mp.jwt.verify.publickey.algorithm=ES256
mp.jwt.verify.publickey.location=http://localhost/api/auth/jwks
smallrye.jwt.claims.groups=role
```

Cada servicio obtiene la clave pública del endpoint JWKS y verifica la firma sin
depender del Auth Service. `TracingFilter` y `AuditLogFilter` leen `sub` y
`role` para los registros de auditoría y el MDC.

== Roles y autorización

#align(center)[
  #table(
    columns: (2fr, 3fr, 2.5fr),
    align: (left, left, left),
    inset: 7pt,
    stroke: 0.5pt,
    table.header([*Rol*], [*Permisos*], [*Módulos*]),
    [Administrador (`admin`)], [Acceso total: CRUD completo], [Usuarios, pacientes, clientes, especies, razas, citas],

    [Veterinario (`veterinarian`)], [Acceso clínico: leer, crear, actualizar], [Historial médico, citas],

    [Trabajador (`worker`)], [Acceso operativo: leer, crear, actualizar], [Clientes, pacientes, citas],
  )
]

Autorización en dos capas: `@RolesAllowed` en controladores REST (`DELETE` solo
`admin`) y `TracingFilter` (prioridad `AUTHENTICATION + 100`) para propagar
`who` y `role`. Token inválido → `401`; sin permisos → `403`.

== Propagación del token y seguridad en frontend

*Comunicación inter-servicios.* Mismo JWT del usuario propagado vía
`Authorization`. `correlationId` generado por `TracingFilter` se propaga en
`X-Correlation-Id` para correlacionar eventos en Loki y Grafana.

*Seguridad en el frontend:*
- Token exclusivamente en cookie `httpOnly` con `Secure` y `SameSite=None`
  (anti-XSS y CSRF)
- Better Auth gestiona la renovación automática del token antes de que expire
- CORS restringido a `tauri://localhost`, `http://tauri.localhost` y
  `http://localhost:1420`
- Sesiones en Redis con prefijo `sanipatitas:auth:` para invalidación
  centralizada


= Conclusiones

== Conclusiones

- Tres servicios backend independientes (Auth, Patient, Appointment), cada uno
  con su stack y base de datos propios, compartiendo librerías comunes

- La autenticación con JWT + ES256 + JWKS permite validación descentralizada:
  cada servicio verifica tokens de forma autónoma sin depender del Auth Service
  en cada petición

- La auditoría transversal en tres capas (logs en tiempo real + Hibernate
  Envers + Loki/Grafana) deja evidencia estructurada de toda operación crítica
  con trazabilidad extremo a extremo mediante `correlationId`

- El modelado BPMN con Camunda 8 documenta formalmente 5 procesos de negocio:
  auditoría, citas, inventario, registro de pacientes y autenticación

- El frontend en Astro 6 + React 19 consume los servicios mediante un cliente
  tipado generado automáticamente desde OpenAPI, eliminando duplicación manual y
  garantizando sincronización con los contratos del backend

- La seguridad se aborda en múltiples capas: JWT ES256, bcrypt, roles con
  `@RolesAllowed`, CORS restrictivo, cookies `httpOnly` y sesiones centralizadas
  en Redis

== ¡Gracias!

#focus-slide[
  #text(size: 1.4em)[
    *Gracias*
  ]
]
