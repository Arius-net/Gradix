# Pruebas de Postman - Gradix API

Documentación completa de endpoints y pruebas para la API de Gradix.

**URL Base:** `http://localhost:8081`

---

## Tabla de Contenidos

1. [Autenticación (Auth)](#1-autenticación-auth)
2. [Alumnos](#2-alumnos)
3. [Materias](#3-materias)
4. [Campos Formativos](#4-campos-formativos)
5. [Criterios](#5-criterios)
6. [Calificaciones](#6-calificaciones)
7. [Variables de Entorno](#7-variables-de-entorno)
8. [Notas Importantes](#8-notas-importantes)

---

## 1. Autenticación (Auth)

### 1.1. Registrar Docente
**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@escuela.edu.mx",
  "password": "password123",
  "escuela": "Escuela Primaria Benito Juárez"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@escuela.edu.mx",
  "escuela": "Escuela Primaria Benito Juárez",
  "fechaRegistro": "2025-12-01T10:30:00Z"
}
```

---

### 1.2. Login (Iniciar Sesión)
**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "correo": "juan.perez@escuela.edu.mx",
  "password": "password123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "docente": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@escuela.edu.mx",
    "escuela": "Escuela Primaria Benito Juárez",
    "fechaRegistro": "2025-12-01T10:30:00Z"
  }
}
```

**Nota:** Guarda el `token` en una variable de entorno para usarlo en las siguientes peticiones.

---

### 1.3. Obtener Información del Usuario Actual
**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@escuela.edu.mx",
  "escuela": "Escuela Primaria Benito Juárez",
  "fechaRegistro": "2025-12-01T10:30:00Z"
}
```

---

## 2. Alumnos

**Nota:** Todos los endpoints de alumnos requieren autenticación JWT.

### 2.1. Crear Alumno
**Endpoint:** `POST /alumnos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body:**
```json
{
  "nombre": "María",
  "apellidoPaterno": "González",
  "apellidoMaterno": "López",
  "grado": 5,
  "grupo": "A"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 1,
  "nombre": "María",
  "apellidoPaterno": "González",
  "apellidoMaterno": "López",
  "grado": 5,
  "grupo": "A",
  "fechaRegistro": "2025-12-01T11:00:00Z"
}
```

---

### 2.2. Crear Alumno sin Grado y Grupo
**Endpoint:** `POST /alumnos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body:**
```json
{
  "nombre": "Carlos",
  "apellidoPaterno": "Martínez",
  "apellidoMaterno": "Ramírez"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 2,
  "nombre": "Carlos",
  "apellidoPaterno": "Martínez",
  "apellidoMaterno": "Ramírez",
  "grado": null,
  "grupo": null,
  "fechaRegistro": "2025-12-01T11:05:00Z"
}
```

---

### 2.3. Obtener Todos los Alumnos
**Endpoint:** `GET /alumnos`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "María",
    "apellidoPaterno": "González",
    "apellidoMaterno": "López",
    "grado": 5,
    "grupo": "A",
    "fechaRegistro": "2025-12-01T11:00:00Z"
  },
  {
    "id": 2,
    "nombre": "Carlos",
    "apellidoPaterno": "Martínez",
    "apellidoMaterno": "Ramírez",
    "grado": null,
    "grupo": null,
    "fechaRegistro": "2025-12-01T11:05:00Z"
  }
]
```

---

### 2.4. Obtener Alumno por ID
**Endpoint:** `GET /alumnos/1`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "María",
  "apellidoPaterno": "González",
  "apellidoMaterno": "López",
  "grado": 5,
  "grupo": "A",
  "fechaRegistro": "2025-12-01T11:00:00Z"
}
```

---

### 2.5. Actualizar Alumno
**Endpoint:** `PUT /alumnos/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body:**
```json
{
  "nombre": "María Fernanda",
  "apellidoPaterno": "González",
  "apellidoMaterno": "López",
  "grado": 6,
  "grupo": "B"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "María Fernanda",
  "apellidoPaterno": "González",
  "apellidoMaterno": "López",
  "grado": 6,
  "grupo": "B",
  "fechaRegistro": "2025-12-01T11:00:00Z"
}
```

---

### 2.6. Eliminar Alumno
**Endpoint:** `DELETE /alumnos/1`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Respuesta Exitosa (204):**
```
(Sin contenido)
```

---

## 3. Materias

### 3.1. Crear Materia
**Endpoint:** `POST /materias`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Matemáticas",
  "campoId": 1,
  "docenteId": 1,
  "grado": 5,
  "grupo": "A"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 1,
  "nombre": "Matemáticas",
  "campoId": 1,
  "docenteId": 1,
  "grado": 5,
  "grupo": "A"
}
```

---

### 3.2. Crear Materia sin Grado y Grupo
**Endpoint:** `POST /materias`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Educación Física",
  "campoId": 2,
  "docenteId": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 2,
  "nombre": "Educación Física",
  "campoId": 2,
  "docenteId": 1,
  "grado": null,
  "grupo": null
}
```

---

### 3.3. Obtener Todas las Materias
**Endpoint:** `GET /materias`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "Matemáticas",
    "campoId": 1,
    "docenteId": 1,
    "grado": 5,
    "grupo": "A"
  },
  {
    "id": 2,
    "nombre": "Educación Física",
    "campoId": 2,
    "docenteId": 1,
    "grado": null,
    "grupo": null
  }
]
```

---

### 3.4. Obtener Materia por ID
**Endpoint:** `GET /materias/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Matemáticas",
  "campoId": 1,
  "docenteId": 1,
  "grado": 5,
  "grupo": "A"
}
```

---

### 3.5. Actualizar Materia
**Endpoint:** `PUT /materias/1`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Matemáticas Avanzadas",
  "campoId": 1,
  "docenteId": 1,
  "grado": 6,
  "grupo": "B"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Matemáticas Avanzadas",
  "campoId": 1,
  "docenteId": 1,
  "grado": 6,
  "grupo": "B"
}
```

---

### 3.6. Eliminar Materia
**Endpoint:** `DELETE /materias/1`

**Respuesta Exitosa (204):**
```
(Sin contenido)
```

---

## 4. Campos Formativos

### 4.1. Crear Campo Formativo
**Endpoint:** `POST /campos-formativos`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Lenguajes"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 1,
  "nombre": "Lenguajes"
}
```

---

### 4.2. Obtener Todos los Campos Formativos
**Endpoint:** `GET /campos-formativos`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "Lenguajes"
  },
  {
    "id": 2,
    "nombre": "Saberes y Pensamiento Científico"
  },
  {
    "id": 3,
    "nombre": "Ética, Naturaleza y Sociedades"
  },
  {
    "id": 4,
    "nombre": "De lo Humano y lo Comunitario"
  }
]
```

---

### 4.3. Obtener Campo Formativo por ID
**Endpoint:** `GET /campos-formativos/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Lenguajes"
}
```

---

### 4.4. Actualizar Campo Formativo
**Endpoint:** `PUT /campos-formativos/1`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Lenguajes y Comunicación"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Lenguajes y Comunicación"
}
```

---

### 4.5. Eliminar Campo Formativo
**Endpoint:** `DELETE /campos-formativos/1`

**Respuesta Exitosa (204):**
```
(Sin contenido)
```

---

## 5. Criterios

### 5.1. Crear Criterio
**Endpoint:** `POST /criterios`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Examen Parcial",
  "descripcion": "Evaluación escrita del primer parcial",
  "porcentaje": 30.00,
  "materiaId": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 1,
  "nombre": "Examen Parcial",
  "descripcion": "Evaluación escrita del primer parcial",
  "porcentaje": 30.00,
  "materiaId": 1
}
```

---

### 5.2. Crear Criterio sin Descripción
**Endpoint:** `POST /criterios`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Tareas",
  "porcentaje": 20.00,
  "materiaId": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 2,
  "nombre": "Tareas",
  "descripcion": null,
  "porcentaje": 20.00,
  "materiaId": 1
}
```

---

### 5.3. Obtener Todos los Criterios
**Endpoint:** `GET /criterios`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "Examen Parcial",
    "descripcion": "Evaluación escrita del primer parcial",
    "porcentaje": 30.00,
    "materiaId": 1
  },
  {
    "id": 2,
    "nombre": "Tareas",
    "descripcion": null,
    "porcentaje": 20.00,
    "materiaId": 1
  }
]
```

---

### 5.4. Obtener Criterio por ID
**Endpoint:** `GET /criterios/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Examen Parcial",
  "descripcion": "Evaluación escrita del primer parcial",
  "porcentaje": 30.00,
  "materiaId": 1
}
```

---

### 5.5. Actualizar Criterio
**Endpoint:** `PUT /criterios/1`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Examen Final",
  "descripcion": "Evaluación escrita del examen final",
  "porcentaje": 40.00,
  "materiaId": 1
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Examen Final",
  "descripcion": "Evaluación escrita del examen final",
  "porcentaje": 40.00,
  "materiaId": 1
}
```

---

### 5.6. Eliminar Criterio
**Endpoint:** `DELETE /criterios/1`

**Respuesta Exitosa (204):**
```
(Sin contenido)
```

---

## 6. Calificaciones

### 6.1. Crear Calificación
**Endpoint:** `POST /calificaciones`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 9.5
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 1,
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 9.5,
  "fechaRegistro": "2025-12-01T12:00:00Z"
}
```

---

### 6.2. Crear o Actualizar Calificación (Upsert)
**Endpoint:** `POST /calificaciones/upsert`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 10.0
}
```

**Descripción:** Si ya existe una calificación para el alumno y criterio especificados, la actualiza. Si no existe, la crea.

**Respuesta Exitosa (200 o 201):**
```json
{
  "id": 1,
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 10.0,
  "fechaRegistro": "2025-12-01T12:00:00Z"
}
```

---

### 6.3. Obtener Todas las Calificaciones
**Endpoint:** `GET /calificaciones`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "alumnoId": 1,
    "criterioId": 1,
    "valor": 10.0,
    "fechaRegistro": "2025-12-01T12:00:00Z"
  },
  {
    "id": 2,
    "alumnoId": 1,
    "criterioId": 2,
    "valor": 8.5,
    "fechaRegistro": "2025-12-01T12:05:00Z"
  }
]
```

---

### 6.4. Obtener Calificación por ID
**Endpoint:** `GET /calificaciones/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 10.0,
  "fechaRegistro": "2025-12-01T12:00:00Z"
}
```

---

### 6.5. Obtener Calificación por Alumno y Criterio
**Endpoint:** `GET /calificaciones/alumno/1/criterio/1`

**Descripción:** Obtiene la calificación específica de un alumno en un criterio determinado.

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 10.0,
  "fechaRegistro": "2025-12-01T12:00:00Z"
}
```

**Respuesta si no existe (404):**
```json
{
  "error": "Calificación no encontrada"
}
```

---

### 6.6. Actualizar Calificación
**Endpoint:** `PUT /calificaciones/1`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 9.8
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "alumnoId": 1,
  "criterioId": 1,
  "valor": 9.8,
  "fechaRegistro": "2025-12-01T12:00:00Z"
}
```

---

### 6.7. Eliminar Calificación
**Endpoint:** `DELETE /calificaciones/1`

**Respuesta Exitosa (204):**
```
(Sin contenido)
```

---

## 7. Variables de Entorno

Para facilitar las pruebas en Postman, configura las siguientes variables de entorno:

```json
{
  "baseUrl": "http://localhost:8080",
  "token": "",
  "docenteId": "",
  "alumnoId": "",
  "materiaId": "",
  "campoId": "",
  "criterioId": "",
  "calificacionId": ""
}
```

### Configurar Variables Automáticamente

#### Después de Login (POST /auth/login)
Agrega este script en la pestaña **Tests**:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
pm.environment.set("docenteId", jsonData.docente.id);
```

#### Después de Crear Alumno (POST /alumnos)
```javascript
var jsonData = pm.response.json();
pm.environment.set("alumnoId", jsonData.id);
```

#### Después de Crear Materia (POST /materias)
```javascript
var jsonData = pm.response.json();
pm.environment.set("materiaId", jsonData.id);
```

#### Después de Crear Campo Formativo (POST /campos-formativos)
```javascript
var jsonData = pm.response.json();
pm.environment.set("campoId", jsonData.id);
```

#### Después de Crear Criterio (POST /criterios)
```javascript
var jsonData = pm.response.json();
pm.environment.set("criterioId", jsonData.id);
```

#### Después de Crear Calificación (POST /calificaciones)
```javascript
var jsonData = pm.response.json();
pm.environment.set("calificacionId", jsonData.id);
```

---

## 8. Notas Importantes

### Autenticación
- Los endpoints de **Alumnos** requieren autenticación JWT (token en header `Authorization: Bearer {{token}}`)
- Los demás endpoints están abiertos (sin autenticación)

### Orden Recomendado para Pruebas

1. **Autenticación:**
   - Registrar Docente
   - Login

2. **Datos Base:**
   - Crear Campos Formativos
   - Crear Materias (requieren campoId y docenteId)

3. **Alumnos:**
   - Crear Alumnos (requiere autenticación)

4. **Criterios:**
   - Crear Criterios (requieren materiaId)

5. **Calificaciones:**
   - Crear Calificaciones (requieren alumnoId y criterioId)

### Validaciones

- **Grado:** Debe ser un número entero positivo (ejemplo: 1, 2, 3, 4, 5, 6)
- **Grupo:** Debe ser un solo carácter (ejemplo: "A", "B", "C")
- **Porcentaje:** Número decimal con máximo 2 decimales (0.00 - 100.00)
- **Valor (Calificación):** Número decimal con máximo 2 decimales (0.00 - 10.00)
- **Correo:** Debe ser único en el sistema

### Códigos de Respuesta HTTP

- **200 OK:** Operación exitosa (GET, PUT)
- **201 Created:** Recurso creado exitosamente (POST)
- **204 No Content:** Recurso eliminado exitosamente (DELETE)
- **400 Bad Request:** Datos inválidos
- **401 Unauthorized:** Token inválido o no proporcionado
- **404 Not Found:** Recurso no encontrado
- **500 Internal Server Error:** Error del servidor

### Ejemplos de Errores Comunes

#### Error de Validación (400)
```json
{
  "error": "El campo 'nombre' es requerido"
}
```

#### Error de Autenticación (401)
```json
{
  "error": "Token inválido o expirado"
}
```

#### Recurso No Encontrado (404)
```json
{
  "error": "Alumno no encontrado"
}
```

#### Error de FK (400/500)
```json
{
  "error": "El campo formativo especificado no existe"
}
```

---

## Flujo de Prueba Completo

### Ejemplo: Registro completo de un alumno con calificación

1. **Registrar Docente**
```
POST /auth/register
{ "nombre": "Juan Pérez", "correo": "juan@escuela.mx", "password": "123456", "escuela": "Primaria X" }
```

2. **Login**
```
POST /auth/login
{ "correo": "juan@escuela.mx", "password": "123456" }
→ Guardar token
```

3. **Crear Campo Formativo**
```
POST /campos-formativos
{ "nombre": "Lenguajes" }
→ Guardar campoId
```

4. **Crear Materia**
```
POST /materias
{ "nombre": "Español", "campoId": 1, "docenteId": 1, "grado": 5, "grupo": "A" }
→ Guardar materiaId
```

5. **Crear Alumno** (con token)
```
POST /alumnos
Authorization: Bearer {token}
{ "nombre": "María", "apellidoPaterno": "López", "apellidoMaterno": "García", "grado": 5, "grupo": "A" }
→ Guardar alumnoId
```

6. **Crear Criterio**
```
POST /criterios
{ "nombre": "Examen", "descripcion": "Primer parcial", "porcentaje": 40.00, "materiaId": 1 }
→ Guardar criterioId
```

7. **Crear Calificación**
```
POST /calificaciones
{ "alumnoId": 1, "criterioId": 1, "valor": 9.5 }
```

8. **Consultar Calificación**
```
GET /calificaciones/alumno/1/criterio/1
```

---

**Fecha de actualización:** Diciembre 2025  
**Versión de API:** 1.0.0  
**Puerto por defecto:** 8080

