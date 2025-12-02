package com.gradix.features.criterio.domain

import com.gradix.features.materia.domain.Materias
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

object Criterios : Table("criterio") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)
    val descripcion = text("descripcion").nullable()
    val porcentaje = decimal("porcentaje", 5, 2) // NUMERIC(5,2)
    val materiaId = integer("materia_id").references(Materias.id)

    override val primaryKey = PrimaryKey(id)
}

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


