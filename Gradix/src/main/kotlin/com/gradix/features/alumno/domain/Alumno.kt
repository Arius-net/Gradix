package com.gradix.features.alumno.domain

import com.gradix.features.auth.domain.Docentes
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

object Alumnos : Table("alumno") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)
    val apellidos = varchar("apellidos", 100)
    val docenteId = integer("docente_id").references(Docentes.id)
    val grado = integer("grado").nullable()
    val grupo = varchar("grupo", 1).nullable()
    val fechaRegistro = timestamp("fecha_registro").defaultExpression(CurrentTimestamp())

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class Alumno(
    val id: Int,
    val nombre: String,
    val apellidoPaterno: String,
    val apellidoMaterno: String,
    val grado: Int? = null,
    val grupo: String? = null,
    @Contextual
    val fechaRegistro: Instant? = null
)

@Serializable
data class AlumnoRequest(
    val nombre: String,
    val apellidoPaterno: String,
    val apellidoMaterno: String,
    val grado: Int? = null,
    val grupo: String? = null
)


