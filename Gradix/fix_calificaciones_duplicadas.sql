-- Script para eliminar calificaciones duplicadas y agregar constraint única
-- Este script mantiene solo el registro más reciente para cada combinación de alumno_id y criterio_id

-- 1. Eliminar duplicados manteniendo solo el más reciente
DELETE FROM calificacion
WHERE id NOT IN (
    SELECT MAX(id)
    FROM calificacion
    GROUP BY alumno_id, criterio_id
);

-- 2. Agregar constraint única para evitar duplicados en el futuro
ALTER TABLE calificacion
ADD CONSTRAINT uk_calificacion_alumno_criterio UNIQUE (alumno_id, criterio_id);

-- Verificar que no haya duplicados
SELECT alumno_id, criterio_id, COUNT(*) as cantidad
FROM calificacion
GROUP BY alumno_id, criterio_id
HAVING COUNT(*) > 1;

