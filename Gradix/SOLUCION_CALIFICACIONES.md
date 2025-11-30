# Solución a Problemas de Calificaciones

## Problemas Identificados

### 1. Calificaciones Duplicadas
**Problema:** Se creaban múltiples registros para el mismo alumno y criterio en lugar de actualizar el existente.

**Causa:** El frontend no tenía forma de saber si una calificación ya existía antes de decidir entre CREATE o UPDATE.

### 2. Decimales Inconsistentes
**Problema:** Los valores de calificaciones mostraban decimales incorrectos al crearlas.

**Causa:** El método `create` devolvía el valor enviado por el cliente sin pasar por el redondeo de la base de datos.

## Soluciones Implementadas

### En la API (Backend)

#### 1. Nuevo Endpoint: `GET /calificaciones/alumno/{alumnoId}/criterio/{criterioId}`
Este endpoint permite buscar una calificación específica por alumno y criterio.

**Uso:**
```http
GET /calificaciones/alumno/10/criterio/3
```

**Respuesta si existe:**
```json
{
  "id": 19,
  "alumnoId": 10,
  "criterioId": 3,
  "valor": 10.0,
  "fechaRegistro": "2025-11-29T18:40:33.638843Z"
}
```

**Respuesta si no existe:**
```json
{
  "error": "Calificación no encontrada"
}
```
HTTP Status: 404

#### 2. Nuevo Endpoint: `POST /calificaciones/upsert`
Este endpoint crea o actualiza automáticamente según exista la calificación.

**Ventaja:** El frontend no necesita verificar si existe, simplemente envía los datos y la API decide.

**Uso:**
```http
POST /calificaciones/upsert
Content-Type: application/json

{
  "alumnoId": 10,
  "criterioId": 3,
  "valor": 9.5
}
```

**Comportamiento:**
- Si existe una calificación para ese alumno y criterio → **ACTUALIZA** el valor
- Si no existe → **CREA** un nuevo registro

**Ventaja adicional:** Siempre devuelve el valor redondeado a 2 decimales como está en la BD.

#### 3. Método `create` Mejorado
Ahora el método `create` consulta la base de datos después de insertar para devolver el valor realmente almacenado (redondeado a 2 decimales).

## Cambios en Base de Datos

### Script SQL para Limpiar Duplicados
El archivo `fix_calificaciones_duplicadas.sql` contiene:

1. **Elimina duplicados** manteniendo solo el registro más reciente
2. **Agrega constraint única** `(alumno_id, criterio_id)` para prevenir duplicados futuros

**Ejecutar:**
```sql
psql -U postgres -d gradix -f fix_calificaciones_duplicadas.sql
```

## Recomendaciones para el Frontend

### Opción 1: Usar el Endpoint Upsert (RECOMENDADO)
```javascript
// Simplemente envía los datos, la API decide si crea o actualiza
const response = await fetch('/calificaciones/upsert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    alumnoId: 10,
    criterioId: 3,
    valor: 9.5
  })
});
```

### Opción 2: Verificar Existencia Primero
```javascript
// 1. Verificar si existe
const response = await fetch(`/calificaciones/alumno/${alumnoId}/criterio/${criterioId}`);

if (response.status === 404) {
  // No existe, crear
  await fetch('/calificaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alumnoId, criterioId, valor })
  });
} else if (response.ok) {
  // Existe, actualizar
  const calificacion = await response.json();
  await fetch(`/calificaciones/${calificacion.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alumnoId, criterioId, valor })
  });
}
```

## Endpoints Disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/calificaciones` | Obtener todas (con filtros opcionales) |
| GET | `/calificaciones/{id}` | Obtener por ID |
| GET | `/calificaciones/alumno/{alumnoId}/criterio/{criterioId}` | Buscar por alumno y criterio |
| POST | `/calificaciones` | Crear nueva |
| POST | `/calificaciones/upsert` | Crear o actualizar automáticamente |
| PUT | `/calificaciones/{id}` | Actualizar existente |
| DELETE | `/calificaciones/{id}` | Eliminar |

## Resultados Esperados

✅ **No más duplicados:** La constraint única previene registros duplicados
✅ **Decimales correctos:** Todos los endpoints devuelven valores redondeados a 2 decimales
✅ **Frontend simplificado:** Usar `/upsert` elimina la lógica de verificación
✅ **Cálculos precisos:** Los promedios ahora serán consistentes y correctos

