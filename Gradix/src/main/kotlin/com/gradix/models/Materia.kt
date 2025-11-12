package com.gradix.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

// Tabla de base de datos
object Materias : Table("materia") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)
    val campoId = integer("campo_id").references(CampoFormativos.id)
    val docenteId = integer("docente_id").references(Docentes.id)

    override val primaryKey = PrimaryKey(id)
}

// DTO para serialización
@Serializable
data class Materia(
    val id: Int,
    val nombre: String,
    val campoId: Int,
    val docenteId: Int
)

@Serializable
data class MateriaRequest(
    val nombre: String,
    val campoId: Int,
    val docenteId: Int
)

