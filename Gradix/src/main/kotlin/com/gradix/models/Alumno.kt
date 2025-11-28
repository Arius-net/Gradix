package com.gradix.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

// Tabla de base de datos - coincide con el esquema PostgreSQL
object Alumnos : Table("alumno") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)
    val apellidos = varchar("apellidos", 100) // Columna única que almacena "apellidoPaterno apellidoMaterno"
    val docenteId = integer("docente_id").references(Docentes.id)
    val fechaRegistro = timestamp("fecha_registro").defaultExpression(CurrentTimestamp())

    override val primaryKey = PrimaryKey(id)
}

// DTO para serialización - separamos apellidos para la API
@Serializable
data class Alumno(
    val id: Int,
    val nombre: String,
    val apellidoPaterno: String,
    val apellidoMaterno: String,
    @Contextual
    val fechaRegistro: Instant? = null
)

@Serializable
data class AlumnoRequest(
    val nombre: String,
    val apellidoPaterno: String,
    val apellidoMaterno: String
)
