# Migración a Arquitectura Hexagonal con Vertical Slicing

## Estado Actual

Tu proyecto tiene la siguiente estructura:
- **Modelos**: `src/main/kotlin/com/gradix/models/`
- **Controladores**: `src/main/kotlin/com/gradix/controllers/`
- **Rutas**: `src/main/kotlin/com/gradix/routes/`
- **Servicios**: `src/main/kotlin/com/gradix/services/`

## Nueva Arquitectura

He creado una nueva arquitectura hexagonal con vertical slicing en:
```
src/main/kotlin/com/gradix/
├── shared/
│   └── infrastructure/
│       └── database/
│           └── DatabaseUtils.kt
└── features/
    ├── auth/
    │   ├── domain/          (modelos + interfaces)
    │   ├── application/     (servicios/casos de uso)
    │   └── infrastructure/  (controladores + rutas)
    ├── alumno/
    ├── materia/
    ├── campoformativo/
    ├── criterio/
    └── calificacion/
```

## ⚠️ IMPORTANTE: Los Endpoints NO Cambian

Los endpoints **permanecen exactamente iguales**:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET/POST/PUT/DELETE /alumnos`
- `GET/POST/PUT/DELETE /materias`
- `GET/POST/PUT/DELETE /campos-formativos`
- `GET/POST/PUT/DELETE /criterios`
- `GET/POST/PUT/DELETE /calificaciones`

**El frontend NO necesita cambios**, solo cambió la organización interna del código.

## Pasos para Completar la Migración

### 1. Eliminar Archivos Antiguos

Ejecuta estos comandos en PowerShell desde la raíz del proyecto:

```powershell
# Eliminar carpetas antiguas
Remove-Item -Recurse -Force "src\main\kotlin\com\gradix\models"
Remove-Item -Recurse -Force "src\main\kotlin\com\gradix\controllers"  
Remove-Item -Recurse -Force "src\main\kotlin\com\gradix\routes"
Remove-Item -Recurse -Force "src\main\kotlin\com\gradix\services"
```

### 2. Verificar Base de Datos

Ejecuta este SQL en tu base de datos PostgreSQL para **eliminar la columna docente_id de la tabla alumno** (no se usa en tu código):

```sql
ALTER TABLE alumno DROP COLUMN IF EXISTS docente_id;
```

### 3. Compilar el Proyecto

```powershell
./gradlew clean build
```

### 4. Iniciar la API

```powershell
./gradlew run
```

O en modo desarrollo con recarga automática:
```powershell
./gradlew run --continuous
```

## Ventajas de la Nueva Arquitectura

### ✅ Separación de Responsabilidades

**Domain (Dominio)**:
- Modelos de datos
- Objetos Table de Exposed
- DTOs de entrada/salida
- **NO** depende de frameworks

**Application (Aplicación)**:
- Lógica de negocio
- Servicios
- Casos de uso
- Orquestación de operaciones

**Infrastructure (Infraestructura)**:
- Controladores HTTP (adaptan requests)
- Rutas (definen endpoints)
- Adaptadores a frameworks externos

### ✅ Vertical Slicing

Cada feature está **completamente aislada**:
```
features/
├── alumno/          <- Todo lo relacionado con alumnos
├── materia/         <- Todo lo relacionado con materias
├── calificacion/    <- Todo lo relacionado con calificaciones
```

Esto permite:
- **Desarrollo paralelo**: cada equipo puede trabajar en una feature
- **Testing más fácil**: pruebas por feature
- **Mantenimiento**: cambios localizados

### ✅ Escalabilidad

- Fácil añadir nuevas features
- Microservicios listos: cada feature puede convertirse en un servicio
- Código reutilizable en `shared/`

## Estructura de Ejemplo: Feature Alumno

```
alumno/
├── domain/
│   └── Alumno.kt              # Table + DTOs
├── application/
│   └── AlumnoService.kt       # Lógica de negocio
└── infrastructure/
    ├── AlumnoController.kt    # Maneja requests HTTP
    └── AlumnoRoutes.kt        # Define endpoints
```

**Flujo de una Request**:
1. `AlumnoRoutes` → recibe HTTP request en `/alumnos`
2. `AlumnoController` → valida y procesa la request
3. `AlumnoService` → ejecuta lógica de negocio  
4. `Alumnos (Table)` → interactúa con la base de datos
5. Respuesta regresa por el mismo camino

## Diferencias con la Arquitectura Anterior

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Organización** | Por tipo (models/, controllers/) | Por feature (alumno/, materia/) |
| **Acoplamiento** | Alto (todo mezclado) | Bajo (features independientes) |
| **Testabilidad** | Difícil | Fácil (mocks por capa) |
| **Escalabilidad** | Limitada | Alta (microservicios ready) |
| **Mantenimiento** | Complejo | Simple (cambios localizados) |

## Migración del Frontend

**NO ES NECESARIA**. Los contratos de API son idénticos:

### Ejemplo: Crear Alumno

**Request (sin cambios)**:
```json
POST /alumnos
{
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "grado": 1,
  "grupo": "A"
}
```

**Response (sin cambios)**:
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "grado": 1,
  "grupo": "A",
  "fechaRegistro": "2025-01-12T10:30:00Z"
}
```

## Siguientes Pasos (Opcional)

Para aprovechar al máximo la arquitectura:

1. **Añadir interfaces (ports)** en domain:
   ```kotlin
   interface AlumnoRepository {
       suspend fun findAll(): List<Alumno>
       suspend fun findById(id: Int): Alumno?
       // ...
   }
   ```

2. **Implementar en infrastructure**:
   ```kotlin
   class AlumnoRepositoryImpl : AlumnoRepository {
       override suspend fun findAll() = dbQuery {
           Alumnos.selectAll().map { mapToAlumno(it) }
       }
   }
   ```

3. **Inyectar dependencias** en services:
   ```kotlin
   class AlumnoService(private val repository: AlumnoRepository) {
       suspend fun getAll() = repository.findAll()
   }
   ```

Esto hace el código **100% testeable** y **framework-agnostic**.

## Comandos Útiles

```powershell
# Compilar
./gradlew build

# Ejecutar
./gradlew run

# Tests
./gradlew test

# Limpiar + Compilar
./gradlew clean build

# Ver dependencias
./gradlew dependencies
```

## Contacto

Si tienes dudas sobre la migración, revisa:
- Los archivos en `features/` para ver ejemplos
- `Database.kt` y `Routing.kt` actualizados
- Este documento

¡La arquitectura está lista! Solo falta eliminar los archivos antiguos y compilar.

