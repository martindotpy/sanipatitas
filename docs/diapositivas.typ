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


= Contexto actual

La clínica opera sin sistema digital. Todo se registra en papel, cuadernos y WhatsApp.

#align(center, image("/assets/img/as-is.png", height: 100%))

= Servicios del backend

#align(center)[
  #table(
    columns: (1.8fr, 3fr, 2.5fr),
    align: (left, left, left),
    inset: 8pt,
    stroke: 0.5pt,
    table.header([Servicio], [Interfaz REST], [Implementación]),
    [Auth Service], [`POST /sign-in/email` + `GET /jwks` + admin CRUD], [Bun + Elysia + Better Auth],

    [Patient Service], [CRUD `/patient` + `/client` + `/species` + `/breed`], [Java 25 + Quarkus 3.37.0],

    [Appointment Service], [CRUD `/appointment` + SSE events], [Java 25 + Quarkus 3.37.0],

    [EHR Service], [CRUD `/clinical/*` (condition, observation, immunization)], [Java 25 + Quarkus 3.37.0],

    [Inventory Service], [CRUD `/inventory/*` (product, stock, supplier)], [Java 25 + Quarkus 3.37.0],

    [Payment Service], [CRUD `/billing/*` (billing, item, payment)], [Java 25 + Quarkus 3.37.0],
  )
]


= Frontend

Astro 6 + React 19, Tailwind CSS v4, TanStack Router. Cliente API generado desde OpenAPI.

#align(center)[
  #table(
    columns: (1.5fr, 3fr),
    align: (left, left),
    inset: 6pt,
    stroke: 0.5pt,
    table.header([Capa], [Tecnología]),
    [Routing], [TanStack Router],
    [Estilos], [Tailwind CSS v4 + `@base-ui/react`],
    [Estado], [TanStack React Query + nanostores],
    [Cliente API], [`@hey-api/openapi-ts` desde OpenAPI],
    [Distribución], [PWA + Tauri (escritorio)],
  )
]


= Flujo de atención integral

El frontend orquesta seis servicios en una secuencia definida:

1. Escaneo de QR de la mascota → Patient Service
2. Verificación de cita → Appointment Service
3. Actualización de historial clínico → EHR Service
4. Prescripción de receta → EHR Service (prescription)
5. Facturación y descuento de stock → Payment + Inventory Service
6. Confirmación y QR actualizado

#align(center)[
  #image("/assets/diagrams/aprobacion-cita-veterinaria.png", width: 80%)
]


= Identificación por QR

Cada mascota tiene un código QR único con el protocolo `sanipatitas://patient/{uuid}`.

#align(center)[
  #block[
    Escaneo del código QR $->$
    Extracción del UUID $->$
    Consulta `GET /api/patient/{uuid}` $->$
    Ficha del paciente en pantalla
  ]
]

El QR se genera al registrar la mascota. El propietario recibe una etiqueta impresa para colocarla en el collar.


= API Gateway — HAProxy

Punto de entrada único que enruta según el prefijo de la ruta:

```text
/api/auth        -> auth:3000
/api/patient     -> patient:8080
/api/appointment -> appointment:8081
/api/clinical    -> ehr:8082
/api/inventory   -> inventory:8083
/api/billing     -> payment:8084
/*               -> frontend:1420
```

Cada servicio valida el JWT de forma autónoma consultando el endpoint JWKS del Auth Service.


= Autenticación JWT

#figure(
  image("/assets/diagrams/flujo-autenticacion.png", width: 80%),
  caption: [Flujo de autenticación y autorización],
)

JWT firmado con ES256 (curva elíptica P-256). Sesiones en Redis. Contraseñas con bcrypt. Renovación automática de tokens.


= Roles del sistema

#align(center)[
  #table(
    columns: (2fr, 3fr, 2.5fr),
    align: (left, left, left),
    inset: 7pt,
    stroke: 0.5pt,
    table.header([Rol], [Permisos], [Módulos]),
    [Administrador], [CRUD completo], [Usuarios, pacientes, clientes, citas],

    [Veterinario], [Lectura, creación, actualización], [Historial médico, citas],

    [Trabajador], [Lectura, creación, actualización], [Clientes, pacientes, citas],
  )
]

`@RolesAllowed` en controladores. DELETE solo para admin. Token inválido → 401. Sin permisos → 403.


= Modelado BPMN

Procesos modelados con Camunda 8 y BPMN 2.0.

#align(center)[
  #image("/assets/diagrams/auditoria-transaccion-critica.png", width: 80%)
]

Cinco procesos: auditoría, aprobación de citas, gestión de stock, registro de paciente, autenticación.

#align(center)[
  #image("/assets/diagrams/gestion-de-stock-inventario.png", width: 80%)
]


= Auditoría del sistema

Tres capas complementarias para dejar evidencia de toda operación crítica.

- **Logs en tiempo real:** AuditLogFilter (Quarkus) + auditMiddleware (Elysia) emiten logs JSON planos
- **Hibernate Envers:** Tablas `_aud` con snapshots históricos de cada entidad de negocio
- **Centralización:** Logs enviados directamente a Loki mediante HTTP. Dashboards en Grafana

Trazabilidad extremo a extremo mediante `correlationId` propagado entre servicios.


= Conclusiones

- Seis servicios backend independientes (Auth, Patient, Appointment, EHR, Inventory, Payment)
- Frontend Astro 6 + React 19 con cliente API generado desde OpenAPI
- Autenticación JWT ES256 con validación descentralizada mediante JWKS
- Auditoría en tres capas con trazabilidad por `correlationId`
- Códigos QR para identificación rápida de mascotas
- Despliegue con Docker + k3s


#focus-slide[
  #text(size: 1.4em)[
    Gracias
  ]
]
