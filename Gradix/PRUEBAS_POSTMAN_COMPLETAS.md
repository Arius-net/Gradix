# Pruebas Completas de Postman - Gradix API

## 📌 Configuración Inicial

**URL Base:** `http://localhost:8081`

### Variables de Entorno en Postman
Crea las siguientes variables en Postman:
- `base_url`: `http://localhost:8081`
- `token`: (se llenará automáticamente después del login)
- `docente_id`: (se llenará automáticamente después del login)
- `campo_id`: (se llenará después de crear un campo formativo)
- `materia_id`: (se llenará después de crear una materia)
- `alumno_id`: (se llenará después de crear un alumno)
- `criterio_id`: (se llenará después de crear un criterio)
- `calificacion_id`: (se llenará después de crear una calificación)

---

## 🔐 1. AUTENTICACIÓN (Auth)

### 1.1. Registrar Docente
**Método:** `POST`  
**URL:** `{{base_url}}/auth/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "nombre": "Juan Pérez García",
  "correo": "juan.perez@escuela.edu.mx",
  "password": "password123",
  "escuela": "Escuela Primaria Miguel Hidalgo"
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Respuesta contiene token y docente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("token");
    pm.expect(jsonData).to.have.property("docente");
    
    // Guardar el token y docente_id
    pm.environment.set("token", jsonData.token);
    pm.environment.set("docente_id", jsonData.docente.id);
});
```

---

### 1.2. Login de Docente
**Método:** `POST`  
**URL:** `{{base_url}}/auth/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "correo": "juan.perez@escuela.edu.mx",
  "password": "password123"
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Login exitoso con token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("token");
    pm.expect(jsonData).to.have.property("docente");
    
    // Guardar el token y docente_id
    pm.environment.set("token", jsonData.token);
    pm.environment.set("docente_id", jsonData.docente.id);
});
```

---

### 1.3. Obtener Información del Docente Autenticado
**Método:** `GET`  
**URL:** `{{base_url}}/auth/me`  
**Headers:**
```
Authorization: Bearer {{token}}
userId: {{docente_id}}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Respuesta contiene información del docente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData).to.have.property("nombre");
    pm.expect(jsonData).to.have.property("correo");
});
```

---

## 📚 2. CAMPOS FORMATIVOS

### 2.1. Listar Todos los Campos Formativos
**Método:** `GET`  
**URL:** `{{base_url}}/campos-formativos`  
**Headers:**
```
Content-Type: application/json
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Respuesta es un array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array");
});
```

---

### 2.2. Crear Campo Formativo
**Método:** `POST`  
**URL:** `{{base_url}}/campos-formativos`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "nombre": "Lenguaje y Comunicación"
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Campo formativo creado exitosamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.nombre).to.eql("Lenguaje y Comunicación");
    
    // Guardar el ID del campo formativo
    pm.environment.set("campo_id", jsonData.id);
});
```

**Ejemplos de otros campos formativos:**
```json
{"nombre": "Saberes y Pensamiento Científico"}
{"nombre": "Ética, Naturaleza y Sociedad"}
{"nombre": "De lo Humano y lo Comunitario"}
```

---

### 2.3. Obtener Campo Formativo por ID
**Método:** `GET`  
**URL:** `{{base_url}}/campos-formativos/{{campo_id}}`  
**Headers:**
```
Content-Type: application/json
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Campo formativo encontrado", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData).to.have.property("nombre");
});
```

---

### 2.4. Actualizar Campo Formativo
**Método:** `PUT`  
**URL:** `{{base_url}}/campos-formativos/{{campo_id}}`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "nombre": "Lenguaje, Comunicación y Literatura"
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Campo formativo actualizado", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.nombre).to.eql("Lenguaje, Comunicación y Literatura");
});
```

---

### 2.5. Eliminar Campo Formativo
**Método:** `DELETE`  
**URL:** `{{base_url}}/campos-formativos/{{campo_id}}`  
**Headers:**
```
Content-Type: application/json
```

**Nota:** ⚠️ Solo prueba esto con un campo formativo que no tenga materias asociadas.

---

## 📖 3. MATERIAS

### 3.1. Listar Todas las Materias
**Método:** `GET`  
**URL:** `{{base_url}}/materias`  
**Headers:**
```
Content-Type: application/json
```

**Parámetros opcionales de consulta:**
- `docenteId`: Filtrar por docente
- `campoId`: Filtrar por campo formativo

**Ejemplo con filtros:**
```
{{base_url}}/materias?docenteId={{docente_id}}
{{base_url}}/materias?campoId={{campo_id}}
```

---

### 3.2. Crear Materia
**Método:** `POST`  
**URL:** `{{base_url}}/materias`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "nombre": "Español",
  "campoId": {{campo_id}},
  "docenteId": {{docente_id}},
  "grado": 3,
  "grupo": "A"
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Materia creada exitosamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.nombre).to.eql("Español");
    
    // Guardar el ID de la materia
    pm.environment.set("materia_id", jsonData.id);
});
```

**Ejemplos de otras materias:**
```json
{
  "nombre": "Matemáticas",
  "campoId": 2,
  "docenteId": 1,
  "grado": 3,
  "grupo": "A"
}
```

---

### 3.3. Obtener Materia por ID
**Método:** `GET`  
**URL:** `{{base_url}}/materias/{{materia_id}}`  
**Headers:**
```
Content-Type: application/json
```

---

### 3.4. Actualizar Materia
**Método:** `PUT`  
**URL:** `{{base_url}}/materias/{{materia_id}}`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "nombre": "Lengua Materna (Español)",
  "campoId": {{campo_id}},
  "docenteId": {{docente_id}},
  "grado": 3,
  "grupo": "A"
}
```

---

### 3.5. Eliminar Materia
**Método:** `DELETE`  
**URL:** `{{base_url}}/materias/{{materia_id}}`  
**Headers:**
```
Content-Type: application/json
```

---

## 👨‍🎓 4. ALUMNOS

**Nota importante:** Todos los endpoints de alumnos requieren autenticación JWT.

### 4.1. Listar Todos los Alumnos
**Método:** `GET`  
**URL:** `{{base_url}}/alumnos`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Respuesta es un array de alumnos", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array");
});
```

---

### 4.2. Crear Alumno
**Método:** `POST`  
**URL:** `{{base_url}}/alumnos`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body (raw JSON):**
```json
{
  "nombre": "María",
  "apellidoPaterno": "González",
  "apellidoMaterno": "Rodríguez",
  "grado": 3,
  "grupo": "A"
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Alumno creado exitosamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.nombre).to.eql("María");
    
    // Guardar el ID del alumno
    pm.environment.set("alumno_id", jsonData.id);
});
```

**Ejemplos de otros alumnos:**
```json
{
  "nombre": "Carlos",
  "apellidoPaterno": "López",
  "apellidoMaterno": "Martínez",
  "grado": 3,
  "grupo": "A"
}
```
```json
{
  "nombre": "Ana",
  "apellidoPaterno": "Hernández",
  "apellidoMaterno": "García",
  "grado": 3,
  "grupo": "B"
}
```

---

### 4.3. Obtener Alumno por ID
**Método:** `GET`  
**URL:** `{{base_url}}/alumnos/{{alumno_id}}`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Alumno encontrado", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData).to.have.property("nombre");
    pm.expect(jsonData).to.have.property("apellidoPaterno");
});
```

---

### 4.4. Actualizar Alumno
**Método:** `PUT`  
**URL:** `{{base_url}}/alumnos/{{alumno_id}}`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body (raw JSON):**
```json
{
  "nombre": "María Fernanda",
  "apellidoPaterno": "González",
  "apellidoMaterno": "Rodríguez",
  "grado": 4,
  "grupo": "B"
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Alumno actualizado", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.nombre).to.eql("María Fernanda");
    pm.expect(jsonData.grado).to.eql(4);
});
```

---

### 4.5. Eliminar Alumno
**Método:** `DELETE`  
**URL:** `{{base_url}}/alumnos/{{alumno_id}}`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Alumno eliminado", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
});
```

---

## 📊 5. CRITERIOS DE EVALUACIÓN

### 5.1. Listar Todos los Criterios
**Método:** `GET`  
**URL:** `{{base_url}}/criterios`  
**Headers:**
```
Content-Type: application/json
```

**Parámetros opcionales de consulta:**
- `materiaId`: Filtrar por materia

**Ejemplo con filtro:**
```
{{base_url}}/criterios?materiaId={{materia_id}}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Respuesta es un array de criterios", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array");
});
```

---

### 5.2. Crear Criterio
**Método:** `POST`  
**URL:** `{{base_url}}/criterios`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "nombre": "Exámenes",
  "descripcion": "Evaluaciones escritas parciales y finales",
  "porcentaje": 40.0,
  "materiaId": {{materia_id}}
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Criterio creado exitosamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.nombre).to.eql("Exámenes");
    pm.expect(jsonData.porcentaje).to.eql(40.0);
    
    // Guardar el ID del criterio
    pm.environment.set("criterio_id", jsonData.id);
});
```

**⚠️ IMPORTANTE:** La suma de los porcentajes de todos los criterios de una materia NO puede superar el 100%.

**Ejemplos de otros criterios:**
```json
{
  "nombre": "Tareas",
  "descripcion": "Tareas y actividades diarias",
  "porcentaje": 30.0,
  "materiaId": 1
}
```
```json
{
  "nombre": "Participación",
  "descripcion": "Participación en clase y actividades grupales",
  "porcentaje": 20.0,
  "materiaId": 1
}
```
```json
{
  "nombre": "Proyecto Final",
  "descripcion": "Proyecto integrador del periodo",
  "porcentaje": 10.0,
  "materiaId": 1
}
```

---

### 5.3. Obtener Criterio por ID
**Método:** `GET`  
**URL:** `{{base_url}}/criterios/{{criterio_id}}`  
**Headers:**
```
Content-Type: application/json
```

---

### 5.4. Actualizar Criterio
**Método:** `PUT`  
**URL:** `{{base_url}}/criterios/{{criterio_id}}`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "nombre": "Exámenes Parciales",
  "descripcion": "Evaluaciones escritas parciales y finales del periodo",
  "porcentaje": 35.0,
  "materiaId": {{materia_id}}
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Criterio actualizado", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.porcentaje).to.eql(35.0);
});
```

---

### 5.5. Eliminar Criterio
**Método:** `DELETE`  
**URL:** `{{base_url}}/criterios/{{criterio_id}}`  
**Headers:**
```
Content-Type: application/json
```

---

## 📝 6. CALIFICACIONES

### 6.1. Listar Todas las Calificaciones
**Método:** `GET`  
**URL:** `{{base_url}}/calificaciones`  
**Headers:**
```
Content-Type: application/json
```

**Parámetros opcionales de consulta:**
- `alumnoId`: Filtrar por alumno
- `criterioId`: Filtrar por criterio

**Ejemplos con filtros:**
```
{{base_url}}/calificaciones?alumnoId={{alumno_id}}
{{base_url}}/calificaciones?criterioId={{criterio_id}}
{{base_url}}/calificaciones?alumnoId={{alumno_id}}&criterioId={{criterio_id}}
```

---

### 6.2. Crear Calificación
**Método:** `POST`  
**URL:** `{{base_url}}/calificaciones`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "alumnoId": {{alumno_id}},
  "criterioId": {{criterio_id}},
  "valor": 9.5
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Calificación creada exitosamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.valor).to.eql(9.5);
    
    // Guardar el ID de la calificación
    pm.environment.set("calificacion_id", jsonData.id);
});
```

**⚠️ IMPORTANTE:** 
- El valor debe estar entre 0 y 10
- No se pueden crear dos calificaciones para el mismo alumno en el mismo criterio (usar upsert para actualizar)

---

### 6.3. Crear o Actualizar Calificación (Upsert)
**Método:** `POST`  
**URL:** `{{base_url}}/calificaciones/upsert`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "alumnoId": {{alumno_id}},
  "criterioId": {{criterio_id}},
  "valor": 8.7
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Calificación creada o actualizada", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.valor).to.eql(8.7);
});
```

**Nota:** Este endpoint es útil cuando no estás seguro si ya existe una calificación. Si existe, la actualiza; si no, la crea.

---

### 6.4. Obtener Calificación por ID
**Método:** `GET`  
**URL:** `{{base_url}}/calificaciones/{{calificacion_id}}`  
**Headers:**
```
Content-Type: application/json
```

---

### 6.5. Obtener Calificación por Alumno y Criterio
**Método:** `GET`  
**URL:** `{{base_url}}/calificaciones/alumno/{{alumno_id}}/criterio/{{criterio_id}}`  
**Headers:**
```
Content-Type: application/json
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Calificación encontrada", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("alumnoId");
    pm.expect(jsonData).to.have.property("criterioId");
    pm.expect(jsonData).to.have.property("valor");
});
```

---

### 6.6. Actualizar Calificación
**Método:** `PUT`  
**URL:** `{{base_url}}/calificaciones/{{calificacion_id}}`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "alumnoId": {{alumno_id}},
  "criterioId": {{criterio_id}},
  "valor": 9.0
}
```

**Script de Prueba (Tests):**
```javascript
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Calificación actualizada", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.valor).to.eql(9.0);
});
```

---

### 6.7. Eliminar Calificación
**Método:** `DELETE`  
**URL:** `{{base_url}}/calificaciones/{{calificacion_id}}`  
**Headers:**
```
Content-Type: application/json
```

---

## 🧪 7. FLUJO COMPLETO DE PRUEBAS

### Secuencia recomendada para probar todo el sistema:

1. **Registrar Docente** → Guarda el `token` y `docente_id`
2. **Crear Campo Formativo** → Guarda el `campo_id`
3. **Crear Materia** → Guarda el `materia_id`
4. **Crear Alumnos** (3-5 alumnos) → Guarda los IDs
5. **Crear Criterios** (4 criterios que sumen 100%) → Guarda los IDs
6. **Crear Calificaciones** para cada alumno en cada criterio
7. **Consultar calificaciones** por alumno
8. **Actualizar una calificación** usando upsert
9. **Eliminar una calificación**

---

## 📋 8. EJEMPLO DE CONJUNTO DE DATOS COMPLETO

### Paso 1: Registrar Docente
```json
POST /auth/register
{
  "nombre": "Ana María Sánchez",
  "correo": "ana.sanchez@escuela.edu.mx",
  "password": "segura123",
  "escuela": "Escuela Primaria Benito Juárez"
}
```

### Paso 2: Crear Campos Formativos
```json
POST /campos-formativos
{"nombre": "Lenguaje y Comunicación"}
{"nombre": "Saberes y Pensamiento Científico"}
{"nombre": "Ética, Naturaleza y Sociedad"}
{"nombre": "De lo Humano y lo Comunitario"}
```

### Paso 3: Crear Materias
```json
POST /materias
{
  "nombre": "Español",
  "campoId": 1,
  "docenteId": 1,
  "grado": 3,
  "grupo": "A"
}

{
  "nombre": "Matemáticas",
  "campoId": 2,
  "docenteId": 1,
  "grado": 3,
  "grupo": "A"
}
```

### Paso 4: Crear Alumnos
```json
POST /alumnos
{"nombre": "María", "apellidoPaterno": "González", "apellidoMaterno": "Rodríguez", "grado": 3, "grupo": "A"}
{"nombre": "Carlos", "apellidoPaterno": "López", "apellidoMaterno": "Martínez", "grado": 3, "grupo": "A"}
{"nombre": "Ana", "apellidoPaterno": "Hernández", "apellidoMaterno": "García", "grado": 3, "grupo": "A"}
{"nombre": "Luis", "apellidoPaterno": "Ramírez", "apellidoMaterno": "Torres", "grado": 3, "grupo": "A"}
```

### Paso 5: Crear Criterios para Español (materiaId: 1)
```json
POST /criterios
{"nombre": "Exámenes", "descripcion": "Evaluaciones escritas", "porcentaje": 40.0, "materiaId": 1}
{"nombre": "Tareas", "descripcion": "Tareas diarias", "porcentaje": 30.0, "materiaId": 1}
{"nombre": "Participación", "descripcion": "Participación en clase", "porcentaje": 20.0, "materiaId": 1}
{"nombre": "Proyecto Final", "descripcion": "Proyecto del periodo", "porcentaje": 10.0, "materiaId": 1}
```

### Paso 6: Crear Calificaciones
```json
POST /calificaciones/upsert
// María - Exámenes
{"alumnoId": 1, "criterioId": 1, "valor": 9.5}
// María - Tareas
{"alumnoId": 1, "criterioId": 2, "valor": 10.0}
// María - Participación
{"alumnoId": 1, "criterioId": 3, "valor": 9.0}
// María - Proyecto Final
{"alumnoId": 1, "criterioId": 4, "valor": 9.5}

// Carlos - Exámenes
{"alumnoId": 2, "criterioId": 1, "valor": 8.0}
// Carlos - Tareas
{"alumnoId": 2, "criterioId": 2, "valor": 8.5}
// Carlos - Participación
{"alumnoId": 2, "criterioId": 3, "valor": 7.5}
// Carlos - Proyecto Final
{"alumnoId": 2, "criterioId": 4, "valor": 8.0}
```

---

## 🔍 9. VALIDACIONES Y RESTRICCIONES

### Restricciones de la Base de Datos:

1. **Docente:**
   - Correo debe ser único
   - Contraseña se hashea automáticamente

2. **Alumno:**
   - Debe estar asociado a un docente existente
   - Los apellidos se almacenan juntos en la BD pero se separan en la API

3. **Materia:**
   - Debe tener un campo formativo válido
   - Debe tener un docente válido

4. **Criterio:**
   - El porcentaje debe estar entre 0 y 100
   - La suma de porcentajes de todos los criterios de una materia NO puede superar 100%
   - Si se intenta superar el 100%, la BD rechazará la operación

5. **Calificación:**
   - El valor debe estar entre 0 y 10
   - No puede haber calificaciones duplicadas (mismo alumno + mismo criterio)
   - Usar `/calificaciones/upsert` para evitar errores de duplicados

---

## 🚨 10. CÓDIGOS DE RESPUESTA HTTP

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos inválidos en la solicitud |
| 401 | Unauthorized | Token JWT inválido o faltante |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Recurso duplicado (ej: correo ya registrado) |
| 500 | Internal Server Error | Error del servidor |

---

## 💡 11. CONSEJOS PARA PRUEBAS

1. **Orden de Pruebas:** Sigue siempre el orden: Docente → Campos → Materias → Alumnos → Criterios → Calificaciones

2. **Variables de Entorno:** Usa scripts de prueba en Postman para guardar automáticamente los IDs

3. **Validación de Porcentajes:** Al crear múltiples criterios, asegúrate de que la suma no exceda 100%

4. **Calificaciones Duplicadas:** Usa `/calificaciones/upsert` en lugar de POST si no estás seguro de si ya existe

5. **Autenticación:** Los endpoints de alumnos requieren el header `Authorization: Bearer {{token}}`

6. **Logs:** Revisa la consola del servidor para ver logs detallados de errores

---

## 📦 12. COLECCIÓN DE POSTMAN

Para importar todas estas pruebas en Postman, puedes:

1. Crear una nueva colección llamada "Gradix API"
2. Crear carpetas para cada módulo (Auth, Campos, Materias, etc.)
3. Agregar las solicitudes según este documento
4. Configurar las variables de entorno

O puedes exportar una colección desde Postman y compartirla con tu equipo.

---

## 🎯 13. RESUMEN DE ENDPOINTS

| Módulo | Método | Endpoint | Autenticación |
|--------|--------|----------|---------------|
| Auth | POST | /auth/register | No |
| Auth | POST | /auth/login | No |
| Auth | GET | /auth/me | Sí |
| Campos | GET | /campos-formativos | No |
| Campos | POST | /campos-formativos | No |
| Campos | GET | /campos-formativos/:id | No |
| Campos | PUT | /campos-formativos/:id | No |
| Campos | DELETE | /campos-formativos/:id | No |
| Materias | GET | /materias | No |
| Materias | POST | /materias | No |
| Materias | GET | /materias/:id | No |
| Materias | PUT | /materias/:id | No |
| Materias | DELETE | /materias/:id | No |
| Alumnos | GET | /alumnos | Sí (JWT) |
| Alumnos | POST | /alumnos | Sí (JWT) |
| Alumnos | GET | /alumnos/:id | Sí (JWT) |
| Alumnos | PUT | /alumnos/:id | Sí (JWT) |
| Alumnos | DELETE | /alumnos/:id | Sí (JWT) |
| Criterios | GET | /criterios | No |
| Criterios | POST | /criterios | No |
| Criterios | GET | /criterios/:id | No |
| Criterios | PUT | /criterios/:id | No |
| Criterios | DELETE | /criterios/:id | No |
| Calificaciones | GET | /calificaciones | No |
| Calificaciones | POST | /calificaciones | No |
| Calificaciones | POST | /calificaciones/upsert | No |
| Calificaciones | GET | /calificaciones/:id | No |
| Calificaciones | GET | /calificaciones/alumno/:alumnoId/criterio/:criterioId | No |
| Calificaciones | PUT | /calificaciones/:id | No |
| Calificaciones | DELETE | /calificaciones/:id | No |

---

## ✅ ¡LISTO PARA PROBAR!

Ahora tienes todas las pruebas necesarias para validar tu API Gradix. Recuerda:
1. Iniciar el servidor: El proyecto debe estar corriendo en el puerto 8081
2. Configurar las variables de entorno en Postman
3. Seguir el flujo de pruebas en orden
4. Revisar los logs del servidor si hay errores

**¡Buena suerte con tus pruebas! 🚀**

