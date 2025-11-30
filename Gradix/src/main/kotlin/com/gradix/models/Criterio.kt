package com.gradix.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

// Tabla de base de datos
object Criterios : Table("criterio") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)
    val descripcion = varchar("descripcion", 255).nullable()
    val porcentaje = decimal("porcentaje", 5, 2) // NUMERIC(5,2)
    val materiaId = integer("materia_id").references(Materias.id)

    override val primaryKey = PrimaryKey(id)
}

// DTO para serialización
@Serializable
data class Criterio(
    val id: Int,
    val nombre: String,
    val descripcion: String? = null,
    val porcentaje: Double,
    val materiaId: Int
)

@Serializable
data class CriterioRequest(
    val nombre: String,
    val descripcion: String? = null,
    val porcentaje: Double,
    val materiaId: Int
)
