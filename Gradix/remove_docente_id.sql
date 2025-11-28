-- CORRECCIÓN: Eliminar columna docente_id de la tabla alumno
-- según el esquema proporcionado

-- Eliminar la restricción de foreign key primero si existe
ALTER TABLE alumno DROP CONSTRAINT IF EXISTS alumno_docente_id_fkey;

-- Eliminar la columna docente_id
ALTER TABLE alumno DROP COLUMN IF EXISTS docente_id;

-- Verificar el resultado
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'alumno'
ORDER BY ordinal_position;

