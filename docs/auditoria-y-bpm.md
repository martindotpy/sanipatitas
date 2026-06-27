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

**Quarkus**: `%prod.quarkus.log.console.json=true` produce JSON que Docker puede enviar a Loki via el driver `loki`.
**Auth (Elysia/Bun)**: Pino emite JSON a stdout. Con `LOKI_ENABLED=true` y `LOKI_URL=http://loki:3100` se activa el transporte directo HTTP.

Para produccion, agregar a `docker-compose.yaml`:

```yaml
logging:
  driver: loki
  options:
    loki-url: "http://observability-loki:3100/loki/api/v1/push"
    loki-external-labels: "service={{.Name}},environment=production"
```

(Requiere el plugin Docker Loki: `docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions`)

En desarrollo, Loki y Grafana se levantan con `docker compose up` y los logs son accesibles en `http://localhost:3001` (Grafana con Loki como datasource).

## BPM

Los BPMN listos para importar en Camunda Modeler estan en:

- `docs/bpmn/auditoria-transaccion-critica.bpmn`
- `docs/bpmn/aprobacion-cita-veterinaria.bpmn`
- `docs/bpmn/alerta-inventario-venta.bpmn`

Los flujos son deliberadamente basicos y compatibles con una integracion simulada: el backend puede publicar eventos de negocio y un worker externo puede completar tareas de servicio o usuario segun el proceso.
