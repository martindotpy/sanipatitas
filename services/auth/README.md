# Auth Service

Variables de entorno requeridas para ejecutar el servicio de autenticación.

## Variables de Entorno

| Variable              | Requerida | Descripción                                      | Valor por Defecto       | Ejemplo                                    |
| --------------------- | --------- | ------------------------------------------------ | ----------------------- | ------------------------------------------ |
| `PORT`                | No        | Puerto del servidor                              | `3000`                  | `3000`                                     |
| `NODE_ENV`            | No        | Entorno de ejecución                             | `development`           | `production`                               |
| `DATABASE_URL`        | **Sí**    | URL de conexión a PostgreSQL                     | —                       | `postgres://user:pass@host:5432/db`        |
| `BETTER_AUTH_SECRET`  | **Sí**    | Secreto para firmar tokens JWT                   | —                       | `generar-una-cadena-segura-aleatoria`      |
| `BETTER_AUTH_URL`     | **Sí**    | URL pública del servicio de autenticación        | —                       | `http://localhost`                         |
| `ADMIN_EMAIL`         | **Sí**    | Email del usuario administrador inicial          | —                       | `admin@ejemplo.com`                        |
| `ADMIN_PASSWORD`      | **Sí**    | Contraseña del administrador inicial (min. 8)    | —                       | `contraseña-segura`                        |
| `REDIS_URL`           | No        | URL de conexión a Redis                          | `redis://localhost:6379` | `redis://host.docker.internal:6379`        |
| `RESEND_API_KEY`      | **Sí**    | API key de Resend para envío de emails           | —                       | `re_xxxxxxxxxxxxx`                         |
| `EMAIL_FROM`          | **Sí**    | Remitente de correos de verificación             | —                       | `Sanipatitas <onboarding@resend.dev>`      |

### Ejemplo `.env`

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://sanipatitas-user:sanipatitas-password@localhost:5432/sanipatitas-db
BETTER_AUTH_SECRET=mi-secreto-super-seguro-cambiar-en-produccion
BETTER_AUTH_URL=http://localhost
ADMIN_EMAIL=admin@ejemplo.com
ADMIN_PASSWORD=mi-contraseña-segura
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=Sanipatitas <onboarding@resend.dev>
```
