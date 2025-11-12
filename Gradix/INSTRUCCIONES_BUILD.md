# Instrucciones para Construir y Ejecutar la API Gradix

## ✅ Estado del Proyecto
Todos los archivos han sido actualizados para coincidir con el esquema de base de datos PostgreSQL.

## 🔧 Requisitos Previos
1. **JDK 21** instalado y configurado
2. **PostgreSQL** con la base de datos creada según el script proporcionado
3. **Gradle** (incluido en el proyecto con gradlew)

## 📝 Configuración de la Base de Datos

Asegúrate de que el archivo `Database.kt` tenga las credenciales correctas:
```kotlin
jdbcURL = "jdbc:postgresql://localhost:5432/tu_base_de_datos"
user = "tu_usuario"
password = "tu_contraseña"
```

## 🚀 Comandos para Ejecutar

### 1. Limpiar y Construir el Proyecto
```cmd
gradlew.bat clean build
```

### 2. Ejecutar la Aplicación
```cmd
gradlew.bat run
```

### 3. Alternativa - Ejecutar con IntelliJ IDEA
1. Abre el proyecto en IntelliJ IDEA
2. Espera a que Gradle sincronice
3. Busca el archivo `Application.kt`
4. Haz clic derecho y selecciona "Run 'ApplicationKt'"

## 📍 Endpoints Disponibles

### Autenticación
- `POST /auth/register` - Registrar nuevo docente
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener información del docente actual

### Campos Formativos
- `GET /campos-formativos` - Listar todos
- `GET /campos-formativos/{id}` - Obtener por ID
- `POST /campos-formativos` - Crear nuevo
- `PUT /campos-formativos/{id}` - Actualizar
- `DELETE /campos-formativos/{id}` - Eliminar

### Materias
- `GET /materias?docenteId={id}&campoId={id}` - Listar con filtros opcionales
- `GET /materias/{id}` - Obtener por ID
- `POST /materias` - Crear nueva
- `PUT /materias/{id}` - Actualizar
- `DELETE /materias/{id}` - Eliminar

### Alumnos
- `GET /alumnos?docenteId={id}` - Listar con filtro opcional
- `GET /alumnos/{id}` - Obtener por ID
- `POST /alumnos` - Crear nuevo
- `PUT /alumnos/{id}` - Actualizar
- `DELETE /alumnos/{id}` - Eliminar

### Criterios
- `GET /criterios?materiaId={id}` - Listar con filtro opcional
- `GET /criterios/{id}` - Obtener por ID
- `POST /criterios` - Crear nuevo
- `PUT /criterios/{id}` - Actualizar
- `DELETE /criterios/{id}` - Eliminar

### Calificaciones
- `GET /calificaciones?alumnoId={id}&criterioId={id}` - Listar con filtros opcionales
- `GET /calificaciones/{id}` - Obtener por ID
- `POST /calificaciones` - Crear nueva
- `PUT /calificaciones/{id}` - Actualizar
- `DELETE /calificaciones/{id}` - Eliminar

## 🔍 Pruebas con Postman

### 1. Registrar un Docente
```json
POST http://localhost:8080/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@escuela.edu",
  "password": "password123",
  "escuela": "Escuela Primaria Benito Juárez"
}
```

### 2. Login
```json
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "correo": "juan@escuela.edu",
  "password": "password123"
}
```

**Respuesta:** Recibirás un `token` que debes usar en las siguientes peticiones.

### 3. Crear un Campo Formativo
```json
POST http://localhost:8080/campos-formativos
Content-Type: application/json
Authorization: Bearer {tu_token}

{
  "nombre": "Lenguaje y Comunicación"
}
```

### 4. Crear una Materia
```json
POST http://localhost:8080/materias
Content-Type: application/json
Authorization: Bearer {tu_token}

{
  "nombre": "Español",
  "campoId": 1,
  "docenteId": 1
}
```

### 5. Crear un Alumno
```json
POST http://localhost:8080/alumnos
Content-Type: application/json
Authorization: Bearer {tu_token}

{
  "nombre": "María",
  "apellidos": "García López",
  "docenteId": 1
}
```

### 6. Crear un Criterio
```json
POST http://localhost:8080/criterios
Content-Type: application/json
Authorization: Bearer {tu_token}

{
  "nombre": "Examen Final",
  "porcentaje": 40.0,
  "materiaId": 1
}
```

### 7. Crear una Calificación
```json
POST http://localhost:8080/calificaciones
Content-Type: application/json
Authorization: Bearer {tu_token}

{
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 8.5
}
```

## ⚠️ Notas Importantes

1. **Puerto:** La API corre en el puerto `8080` por defecto
2. **CORS:** Está configurado para permitir peticiones desde cualquier origen
3. **Autenticación:** La mayoría de endpoints requieren un token JWT válido
4. **Validación:** Los porcentajes deben estar entre 0 y 100
5. **Calificaciones:** Los valores deben estar entre 0 y 10

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `Database.kt`
- Asegúrate de que la base de datos existe

### Error al compilar
```cmd
gradlew.bat clean build --refresh-dependencies
```

### Puerto ocupado
Cambia el puerto en `application.yaml`:
```yaml
ktor:
  deployment:
    port: 8081
```

