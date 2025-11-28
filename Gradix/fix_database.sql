-- Script para verificar y corregir el esquema de la tabla alumno

-- 1. Ver el esquema actual de la tabla alumno
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'alumno'
ORDER BY ordinal_position;

-- 2. Si la columna docente_id existe y NO la necesitas, ejecuta:
-- ALTER TABLE alumno DROP COLUMN IF EXISTS docente_id;

-- 3. Si la columna docente_id existe y la necesitas, hazla nullable:
-- ALTER TABLE alumno ALTER COLUMN docente_id DROP NOT NULL;

