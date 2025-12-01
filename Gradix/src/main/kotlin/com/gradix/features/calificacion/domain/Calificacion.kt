package com.gradix.features.calificacion.domain

import com.gradix.features.alumno.domain.Alumnos
import com.gradix.features.criterio.domain.Criterios
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

// Tabla de base de datos
object Calificaciones : Table("calificacion") {
    val id = integer("id").autoIncrement()
    val alumnoId = integer("alumno_id").references(Alumnos.id)
    val criterioId = integer("criterio_id").references(Criterios.id)
    val valor = decimal("valor", 5, 2) // NUMERIC(5,2)
    val fechaRegistro = timestamp("fecha_registro").defaultExpression(CurrentTimestamp())

    override val primaryKey = PrimaryKey(id)
}

// DTO para serialización
@Serializable
data class Calificacion(
    val id: Int,
    val alumnoId: Int,
    val criterioId: Int,
    val valor: Double,
    @Contextual
    val fechaRegistro: Instant? = null
)

@Serializable
data class CalificacionRequest(
    val alumnoId: Int,
    val criterioId: Int,
    val valor: Double
)


