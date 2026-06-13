## Documentación de Endpoints

### Autenticación

| Método | Endpoint | Descripción | Protección |
|---------|----------|-------------|------------|
| POST | /api/registro | Registrar un nuevo usuario | Pública |
| POST | /api/login | Iniciar sesión y obtener JWT | Pública |
| GET | /api/perfil | Obtener información del usuario autenticado | JWT |

### Usuarios

| Método | Endpoint | Descripción | Protección |
|---------|----------|-------------|------------|
| GET | /api/usuarios | Obtener listado de usuarios | Admin + JWT |
| PUT | /api/usuarios/:id | Actualizar usuario | Admin + JWT |
| DELETE | /api/usuarios/:id | Eliminar usuario | Admin + JWT |

### Reportes

| Método | Endpoint | Descripción | Protección |
|---------|----------|-------------|------------|
| GET | /api/reportes | Obtener reportes registrados | JWT |
| POST | /api/reportes | Crear un nuevo reporte | JWT |
| PUT | /api/reportes/:id | Actualizar estado de un reporte | JWT |
| DELETE | /api/reportes/:id | Eliminar un reporte | JWT |

### Cursos

| Método | Endpoint | Descripción | Protección |
|---------|----------|-------------|------------|
| GET | /api/cursos | Obtener cursos disponibles | JWT |

### Evaluaciones

| Método | Endpoint | Descripción | Protección |
|---------|----------|-------------|------------|
| GET | /api/evaluaciones | Obtener evaluaciones disponibles | JWT |

### Alertas

| Método | Endpoint | Descripción | Protección |
|---------|----------|-------------|------------|
| GET | /api/alertas | Obtener alertas de ciberseguridad | JWT |

### Rutas de Prueba

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | / | Verificar funcionamiento del servidor |
| GET | /test-db | Verificar conexión con PostgreSQL |