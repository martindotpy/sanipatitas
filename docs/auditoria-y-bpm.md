# Administracion de procesos y auditoria

## Auditoria transversal

La auditoria queda implementada en dos capas complementarias:

### 1. Logs estructurados (tiempo real)

En Quarkus, `AuditLogFilter` vive en `shared/java` y se aplica transversalmente a `patient` y `appointment`. Cada evento registra:
- `who`: usuario autenticado desde el JWT, o `anonymous`
- `role`: rol del usuario
- `when`: fecha ISO-8601 del evento
- `action`: `CREATE`, `UPDATE` o `DELETE`
- `service`: servicio que ejecuto la accion
- `resourceType` y `resourceId`: recurso afectado
- `method`, `path`, `status`, `durationMs` y `correlationId`

En Auth, `auditMiddleware` registra las escrituras del flujo de autenticacion con el mismo esquema y propaga `X-Correlation-Id`.

### 2. Hibernate Envers (historico en base de datos)

Se integra `quarkus-hibernate-envers` sobre una unidad de persistencia JDBC dedicada (`audit`), separada de la unidad reactiva principal. Hibernate genera automaticamente las tablas:

- `revinfo`: metadata de cada revision (`username`, `role`, `timestamp`)
- `patient_aud`, `appointment_aud`, `client_aud`, `breed_aud`, `species_aud`: snapshots historicos

Las entidades estan anotadas con `@Audited`. `SanipatitasRevisionListener` captura el usuario y rol del JWT para cada revision.

Para disparar la auditoria desde operaciones reactivas, se inyecta `SanipatitasAuditService` en los servicios de negocio y se llama `recordCreate(entity)`, `recordUpdate(entity)` o `recordDelete(entity)` despues de cada escritura.

### 3. Loki + Grafana

Levantados con `docker compose up`. Accesibles en:

- **Loki**: `http://localhost:3100` (API push: `/loki/api/v1/push`)
- **Grafana**: `http://localhost:3001` (login anonimo como Admin, Loki ya configurado como datasource, dashboards importados automaticamente)

Los dashboards se importan automaticamente desde `docker/grafana/provisioning/dashboards/`. La provision se monta en `/var/lib/grafana/provisioning` (path writable) via `GF_PATHS_PROVISIONING`.

**Todos los servicios envian logs directo a Loki via HTTP** (sin plugin de Docker ni sidecar):

| Servicio | Mecanismo | Archivo |
|---|---|---|
| Auth (Elysia/Bun) | `loki-transport.ts` (Pino) | `shared/typescript/src/log/transport/loki-transport.ts` |
| Patient (Quarkus) | `LokiLogHandler` (JUL) | `shared/java/.../audit/LokiLogHandler.java` |
| Appointment (Quarkus) | `LokiLogHandler` (JUL) | `shared/java/.../audit/LokiLogHandler.java` |

Variables de entorno requeridas por servicio:

```yaml
environment:
  - LOKI_ENABLED=true
  - LOKI_URL=http://observability-loki:3100
  - SERVICE_NAME=patient   # o auth, appointment
```

`LokiLogHandler` se registra automaticamente via `LokiLogSetup` (`@Observes @Initialized(ApplicationScoped.class)`) en el root JUL logger. Bufferea logs en lotes de 100 y los envia async con `java.net.http.HttpClient`. Si `LOKI_ENABLED` no es `true`, no se activa (cero overhead).

## BPM

Los BPMN listos para importar en Camunda Modeler estan en:

- `docs/bpmn/auditoria-transaccion-critica.bpmn`
- `docs/bpmn/aprobacion-cita-veterinaria.bpmn`
- `docs/bpmn/alerta-inventario-venta.bpmn`

Los flujos son deliberadamente basicos y compatibles con una integracion simulada: el backend puede publicar eventos de negocio y un worker externo puede completar tareas de servicio o usuario segun el proceso.
