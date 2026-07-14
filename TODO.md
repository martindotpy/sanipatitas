# TODO - Sanipatitas

Basado en el documento del proyecto vs lo implementado actualmente.

---

## Arquitectura de Microservicios

| Microservicio | Stack | Estado |
|---|---|---|
| **Auth** | Bun + Elysia + Better Auth | ✅ Implementado |
| **Patients** (clientes/tutores, pacientes, especies, razas) | Java + Quarkus | ✅ Implementado |
| **EHR** (historial clínico: conditions, observations, immunizations, procedures, prescriptions) | Java + Quarkus | ✅ Implementado (extraído) |
| **Appointments** | Java + Quarkus | ✅ Implementado |
| **Inventory** | Java + Quarkus (nuevo) | ❌ Pendiente |
| **Payments** | Java + Quarkus (nuevo) | ❌ Pendiente |

---

## Estado por Microservicio

### 1. Auth Service ✅

**Implementado:**
- JWT, RBAC (admin, veterinarian, worker)
- Registro, login, logout, refresh, email verification, password reset
- Sessions, OAuth
- JWKS endpoint para verificación de tokens entre servicios
- Perfil de usuario (editar nombre/apellido, cambiar contraseña)

**Pendiente:**
- [ ] Frontend: tabla de usuarios con CRUD (admin panel)
- [ ] Tests unitarios

### 2. Patient Service ✅

**CRUD Base:**
- Pacientes, clientes/tutores, especies, razas — completo

**Pendiente:**
- [ ] Extraer módulo EHR a su propio microservicio
- [ ] Tests unitarios

### 3. EHR Service ✅ (Extraído de Patient Service)

El código EHR se extrajo exitosamente a `services/ehr/` (puerto 8082).

**Entidades migradas:**
- Condiciones médicas (FHIR Condition)
- Observaciones médicas (FHIR Observation)
- Inmunizaciones (FHIR Immunization)
- Procedimientos (FHIR Procedure)
- Recetas / Prescripciones (con items)

**Acciones completadas:**
- [x] Scaffold `services/ehr/` con Quarkus (pom.xml, Dockerfile, application.properties)
- [x] Migrar 42 archivos Java de clinical de patient → ehr (controllers, requests, mappers, usecases)
- [x] Renombrar package de `.patient` a `.ehr`
- [x] Eliminar código clinical de patient service (solo queda patient CRUD + stats)
- [x] Agregar módulo `services/ehr` en pom.xml raíz
- [x] Agregar ruta `/api/clinical/*` en HAProxy → ehr-backend (:8082)
- [x] Agregar `service-ehr` en docker-compose.yaml
- [x] Actualizar `openapi-ts.config.ts` (separar patient de ehr, corregir puerto appointment)

**Pendiente:**
- [ ] Reconstruir imágenes Docker y verificar servicios
- [ ] Regenerar OpenAPI SDK
- [ ] Verificar frontend (paths no cambian, todo bajo `/api/clinical/`)
- [ ] Tests

### 4. Appointment Service ✅

CRUD de citas + SSE events + stats.

**Pendiente:**
- [ ] Tests unitarios

### 5. Inventory Service ❌

Nuevo microservicio Java + Quarkus.

**Acciones:**
- [ ] Scaffold `services/inventory/` con Quarkus
- [ ] Crear esquemas Drizzle para `products` e `inventory_movements`
- [ ] Generar migración SQL
- [ ] Agregar entidades Java (Product, InventoryMovement)
- [ ] Implementar CRUD productos
- [ ] Implementar registro de movimientos (entrada, salida, ajuste)
- [ ] Implementar alertas de stock bajo y vencimiento
- [ ] Agregar ruta en HAProxy
- [ ] Crear frontend: tabla de productos, formulario crear/editar, alertas de stock
- [ ] Crear frontend: historial de movimientos
- [ ] Tests

### 6. Payments Service ❌

Nuevo microservicio Java + Quarkus. Maneja pagos (cash, card, transfer) y su relación con ventas.

**Acciones:**
- [ ] Scaffold `services/payments/` con Quarkus
- [ ] Crear esquemas Drizzle para `sales`, `sale_items` y `payments`
- [ ] Generar migración SQL
- [ ] Agregar entidades Java (Sale, SaleItem, Payment)
- [ ] Implementar registro de ventas con método de pago
- [ ] Implementar descuento automático de stock al vender
- [ ] Agregar ruta en HAProxy
- [ ] Crear frontend: formulario de venta, carrito, comprobante
- [ ] Crear frontend: historial de ventas
- [ ] Tests

---

## Dashboard / Estadísticas ✅

| Componente | Backend | Frontend | Estado |
|---|---|---|---|
| Endpoint stats paciente | `PatientStatsController` | N/A | ✅ Completo |
| Endpoint stats citas | `AppointmentStatsController` | N/A | ✅ Completo |
| Dashboard page | N/A | `DashboardSection` | ✅ Completo |

**Pendiente (requiere Inventory + Payments):**
- [ ] Ingresos del mes / gráfico de barras
- [ ] Productos con stock bajo

---

## Infraestructura Pendiente

- [ ] CI/CD pipeline (GitHub Actions o similar)
- [ ] Entorno de staging
- [ ] Backup automatizado de PostgreSQL
- [ ] Monitoreo de salud de servicios
- [ ] Logs estructurados (Loki configurado pero no en uso activo)
- [ ] Rate limiting en APIs
- [ ] Validación de entrada más robusta

---

## Tests Pendientes

- [ ] Auth Service: tests de registro, login, JWT, refresh, roles
- [ ] Patient Service: tests de CRUD patients, clients, breeds, species, EHR
- [ ] Appointment Service: tests de CRUD appointments, cambio de estado, eventos
- [ ] Inventory Service: tests de CRUD productos y movimientos
- [ ] Payments Service: tests de ventas y pagos
- [ ] Frontend: tests de componentes React
- [ ] Frontend: tests de hooks
- [ ] E2E: flujo completo (login → paciente → cita → EHR)
- [ ] Database: tests de migraciones y seeds

---

## Documentación Pendiente

- [ ] Diagrama BPMN real
- [ ] Diagrama de clases UML real
- [ ] Lean Canvas como imagen
- [ ] Diagrama de Gantt real
- [ ] Documentación de arquitectura actualizada
- [ ] Manual de usuario
- [ ] Guía de instalación y despliegue
