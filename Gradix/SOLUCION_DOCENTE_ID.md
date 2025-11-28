# Solución al Error: docente_id NOT NULL en tabla alumno

## Problema
Tu base de datos PostgreSQL tiene la columna `docente_id` como NOT NULL en la tabla `alumno`, pero tu código Kotlin no la está insertando, causando errores.

## Solución

### Opción 1: Eliminar la columna docente_id (RECOMENDADO según tu esquema)

**Ejecuta este SQL en PostgreSQL:**

```sql
-- Eliminar la restricción de foreign key primero
ALTER TABLE alumno DROP CONSTRAINT IF EXISTS alumno_docente_id_fkey;

-- Eliminar la columna docente_id
ALTER TABLE alumno DROP COLUMN IF EXISTS docente_id;
```

**Verificar que funcionó:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'alumno' 
ORDER BY ordinal_position;
```

Deberías ver solo: `id`, `nombre`, `apellidos`, `fecha_registro`

---

### Opción 2: Hacer docente_id nullable (si la necesitas temporalmente)

```sql
ALTER TABLE alumno ALTER COLUMN docente_id DROP NOT NULL;
```

---

## Pasos para ejecutar

1. Abre **pgAdmin** o tu cliente PostgreSQL
2. Conecta a tu base de datos
3. Ejecuta el script SQL de la **Opción 1**
4. Reinicia tu aplicación Kotlin
5. Prueba crear un alumno nuevamente

## Archivo SQL creado

He creado el archivo `remove_docente_id.sql` con el script completo.
Puedes ejecutarlo directamente en PostgreSQL.

---

## Esquema correcto según tu modelo

```sql
CREATE TABLE alumno (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,  -- Almacena "apellidoPaterno apellidoMaterno"
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

