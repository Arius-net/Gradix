package com.gradix.features.campoformativo.domain

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

object CampoFormativos : Table("campo_formativo") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class CampoFormativo(
    val id: Int,
    val nombre: String
)

@Serializable
data class CampoFormativoRequest(
    val nombre: String
)


