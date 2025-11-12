# Gradix API

API REST para el sistema de gestión de calificaciones Gradix, desarrollada con Kotlin, Ktor y Exposed ORM.

## Tecnologías

- **Kotlin 1.9.20**
- **Ktor 2.3.6** - Framework web
- **Exposed** - ORM para base de datos
- **PostgreSQL** - Base de datos principal
- **JWT** - Autenticación
- **BCrypt** - Encriptación de contraseñas

## Requisitos

- JDK 11 o superior
- PostgreSQL 12 o superior
- Gradle 7.x o superior

## Configuración

### Base de datos

1. Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE gradix;
```

2. Configurar las credenciales en `src/main/resources/application.yaml` o mediante variables de entorno:
   - `DB_DRIVER`: Driver de la base de datos (default: org.postgresql.Driver)
   - `DB_URL`: URL de conexión (default: jdbc:postgresql://localhost:5432/gradix)
   - `DB_USER`: Usuario de la base de datos (default: postgres)
   - `DB_PASSWORD`: Contraseña de la base de datos (default: postgres)

### JWT

Configurar las siguientes variables de entorno (opcional):
- `JWT_SECRET`: Clave secreta para JWT
- `JWT_ISSUER`: Emisor del token
- `JWT_AUDIENCE`: Audiencia del token

## Instalación

1. Clonar el repositorio
2. Configurar la base de datos
3. Ejecutar el proyecto:

```bash
gradlew run
```

El servidor iniciará en `http://localhost:8080`

## Endpoints de la API

### Autenticación

#### Registro de docente
```
POST /auth/register
Content-Type: application/json

{
  "curp": "ABCD123456HDFRLL00",
  "nombres": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "email": "juan.perez@escuela.edu.mx",
  "password": "password123"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "juan.perez@escuela.edu.mx",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "docente": { ... }
}
```

#### Obtener información del usuario actual
```
GET /auth/me
```

### Alumnos

#### Listar alumnos
```
GET /alumnos?grado=1&grupo=A&activo=true
```

#### Obtener alumno por ID
```
GET /alumnos/{id}
```

#### Crear alumno
```
POST /alumnos
Content-Type: application/json

{
  "curp": "ABCD123456HDFRLL01",
  "nombres": "María",
  "apellidoPaterno": "López",
  "apellidoMaterno": "Martínez",
  "fechaNacimiento": "2015-03-15",
  "grado": 3,
  "grupo": "A"
}
```

#### Actualizar alumno
```
PUT /alumnos/{id}
Content-Type: application/json

{
  "curp": "ABCD123456HDFRLL01",
  "nombres": "María",
  "apellidoPaterno": "López",
  "apellidoMaterno": "Martínez",
  "fechaNacimiento": "2015-03-15",
  "grado": 4,
  "grupo": "B"
}
```

#### Desactivar alumno (soft delete)
```
DELETE /alumnos/{id}
```

### Materias

#### Listar materias
```
GET /materias?grado=1
```

#### Obtener materia por ID
```
GET /materias/{id}
```

#### Crear materia
```
POST /materias
Content-Type: application/json

{
  "nombre": "Matemáticas",
  "descripcion": "Matemáticas básicas para primer grado",
  "grado": 1
}
```

#### Actualizar materia
```
PUT /materias/{id}
```

#### Desactivar materia
```
DELETE /materias/{id}
```

### Campos Formativos

#### Listar campos formativos
```
GET /campos-formativos?materiaId=1
```

#### Obtener campo formativo por ID
```
GET /campos-formativos/{id}
```

#### Crear campo formativo
```
POST /campos-formativos
Content-Type: application/json

{
  "nombre": "Números y operaciones",
  "descripcion": "Suma y resta básica",
  "materiaId": 1
}
```

#### Actualizar campo formativo
```
PUT /campos-formativos/{id}
```

#### Desactivar campo formativo
```
DELETE /campos-formativos/{id}
```

### Criterios

#### Listar criterios
```
GET /criterios?campoFormativoId=1
```

#### Obtener criterio por ID
```
GET /criterios/{id}
```

#### Crear criterio
```
POST /criterios
Content-Type: application/json

{
  "nombre": "Resolución de problemas",
  "descripcion": "Capacidad para resolver problemas matemáticos",
  "campoFormativoId": 1,
  "ponderacion": 40
}
```

#### Actualizar criterio
```
PUT /criterios/{id}
```

#### Desactivar criterio
```
DELETE /criterios/{id}
```

### Calificaciones

#### Listar calificaciones
```
GET /calificaciones?alumnoId=1&periodo=2024-1
```

#### Obtener calificación por ID
```
GET /calificaciones/{id}
```

#### Crear calificación
```
POST /calificaciones
Content-Type: application/json
Headers:
  userId: 1

{
  "alumnoId": 1,
  "criterioId": 1,
  "calificacion": "9.5",
  "periodo": "2024-1",
  "observaciones": "Excelente desempeño"
}
```

#### Actualizar calificación
```
PUT /calificaciones/{id}
```

#### Eliminar calificación
```
DELETE /calificaciones/{id}
```

## Estructura de la base de datos

### Tablas

- **docentes**: Profesores del sistema
- **alumnos**: Estudiantes
- **materias**: Asignaturas por grado
- **campos_formativos**: Áreas de evaluación dentro de una materia
- **criterios**: Criterios específicos de evaluación
- **calificaciones**: Calificaciones asignadas por los docentes

### Relaciones

- Una materia tiene muchos campos formativos
- Un campo formativo tiene muchos criterios
- Un criterio puede tener muchas calificaciones
- Un alumno puede tener muchas calificaciones
- Un docente puede asignar muchas calificaciones

## Desarrollo

### Compilar el proyecto
```bash
gradlew build
```

### Ejecutar tests
```bash
gradlew test
```

### Ejecutar en modo desarrollo
```bash
gradlew run
```

## Notas de seguridad

- En producción, cambiar las credenciales de base de datos
- Configurar CORS para permitir solo dominios específicos
- Cambiar el secreto JWT por uno seguro
- Implementar rate limiting
- Agregar validaciones adicionales en los endpoints

## Próximas mejoras

- [ ] Implementar paginación en los listados
- [ ] Agregar filtros avanzados
- [ ] Implementar búsqueda por texto
- [ ] Agregar roles y permisos más granulares
- [ ] Implementar reportes en PDF
- [ ] Agregar estadísticas y gráficas
- [ ] Implementar notificaciones
- [ ] Agregar auditoría de cambios

## Licencia

Proyecto educativo - Gradix 2024

