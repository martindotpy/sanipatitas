# Appointment Service

Variables de entorno requeridas para ejecutar el microservicio de citas.

## Variables de Entorno

| Variable                              | Requerida | Descripción                                        | Valor por Defecto | Ejemplo                                                        |
| ------------------------------------- | --------- | -------------------------------------------------- | ----------------- | -------------------------------------------------------------- |
| `QUARKUS_DATASOURCE_REACTIVE_URL`     | **Sí**    | URL de conexión reactiva a PostgreSQL              | —                 | `vertx-reactive:postgresql://user:pass@host:5432/db`          |
| `QUARKUS_DATASOURCE_JDBC_URL`         | **Sí**    | URL de conexión JDBC a PostgreSQL                  | —                 | `jdbc:postgresql://host:5432/db`                               |
| `QUARKUS_DATASOURCE_USERNAME`         | **Sí**    | Usuario de base de datos                           | —                 | `sanipatitas-user`                                             |
| `QUARKUS_DATASOURCE_PASSWORD`         | **Sí**    | Contraseña de base de datos                        | —                 | `sanipatitas-password`                                         |
| `QUARKUS_REDIS_HOSTS`                 | No        | Host(s) de Redis para caché                        | —                 | `redis://host:6379`                                            |
| `MP_JWT_VERIFY_PUBLICKEY_LOCATION`    | **Sí**    | URL del endpoint JWKS del servicio de autenticación | —                 | `http://service-auth:3000/api/auth/jwks`                       |
| `MP_JWT_VERIFY_ISSUER`               | **Sí**    | Emisor del token JWT                               | —                 | `http://localhost`                                              |
| `MP_JWT_VERIFY_AUDIENCES`            | **Sí**    | Audiencia del token JWT                            | —                 | `http://localhost`                                              |
| `LOKI_ENABLED`                        | No        | Habilitar envío de logs a Loki                     | `false`           | `true`                                                         |
| `LOKI_URL`                            | No        | URL del servidor Loki                              | —                 | `http://observability-loki:3100`                                |
| `SERVICE_NAME`                        | No        | Nombre del servicio para logs                      | —                 | `appointment`                                                  |

### Ejemplo `.env`

```env
QUARKUS_DATASOURCE_REACTIVE_URL=vertx-reactive:postgresql://sanipatitas-user:sanipatitas-password@localhost:5432/sanipatitas-db?loggerLevel=OFF
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/sanipatitas-db
QUARKUS_DATASOURCE_USERNAME=sanipatitas-user
QUARKUS_DATASOURCE_PASSWORD=sanipatitas-password
QUARKUS_REDIS_HOSTS=redis://localhost:6379
MP_JWT_VERIFY_PUBLICKEY_LOCATION=http://localhost:3000/api/auth/jwks
MP_JWT_VERIFY_ISSUER=http://localhost
MP_JWT_VERIFY_AUDIENCES=http://localhost
LOKI_ENABLED=false
LOKI_URL=http://localhost:3100
SERVICE_NAME=appointment
```
