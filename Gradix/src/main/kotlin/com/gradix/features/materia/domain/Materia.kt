package com.gradix.features.materia.domain

import com.gradix.features.campoformativo.domain.CampoFormativos
import com.gradix.features.auth.domain.Docentes
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

object Materias : Table("materia") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)
    val campoId = integer("campo_id").references(CampoFormativos.id)
    val docenteId = integer("docente_id").references(Docentes.id)
    val grado = integer("grado").nullable()
    val grupo = varchar("grupo", 1).nullable()

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class Materia(
    val id: Int,
    val nombre: String,
    val campoId: Int,
    val docenteId: Int,
    val grado: Int? = null,
    val grupo: String? = null
)

@Serializable
data class MateriaRequest(
    val nombre: String,
    val campoId: Int,
    val docenteId: Int,
    val grado: Int? = null,
    val grupo: String? = null
)


