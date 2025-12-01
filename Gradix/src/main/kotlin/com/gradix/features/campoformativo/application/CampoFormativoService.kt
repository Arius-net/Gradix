package com.gradix.features.campoformativo.application

import com.gradix.shared.infrastructure.database.dbQuery
import com.gradix.features.campoformativo.domain.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class CampoFormativoService {

    suspend fun getAll(): List<CampoFormativo> = dbQuery {
        CampoFormativos.selectAll().map(::mapToCampoFormativo)
    }

    suspend fun getById(id: Int): CampoFormativo? = dbQuery {
        CampoFormativos.select { CampoFormativos.id eq id }
            .map(::mapToCampoFormativo)
            .singleOrNull()
    }

    suspend fun create(request: CampoFormativoRequest): CampoFormativo = dbQuery {
        val id = CampoFormativos.insert {
            it[nombre] = request.nombre
        }[CampoFormativos.id]

        CampoFormativo(id = id, nombre = request.nombre)
    }

    suspend fun update(id: Int, request: CampoFormativoRequest): CampoFormativo? = dbQuery {
        val updated = CampoFormativos.update({ CampoFormativos.id eq id }) {
            it[nombre] = request.nombre
        } > 0

        if (updated) {
            CampoFormativos.select { CampoFormativos.id eq id }
                .map(::mapToCampoFormativo)
                .singleOrNull()
        } else null
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        CampoFormativos.deleteWhere { CampoFormativos.id eq id } > 0
    }

    private fun mapToCampoFormativo(row: ResultRow): CampoFormativo = CampoFormativo(
        id = row[CampoFormativos.id],
        nombre = row[CampoFormativos.nombre]
    )
}

