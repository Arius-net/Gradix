package com.gradix.features.campoformativo.domain

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

// Tabla de base de datos
object CampoFormativos : Table("campo_formativo") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)

    override val primaryKey = PrimaryKey(id)
}

// DTO para serialización
@Serializable
data class CampoFormativo(
    val id: Int,
    val nombre: String
)

@Serializable
data class CampoFormativoRequest(
    val nombre: String
)


