package com.gradix.features.criterio.application

import com.gradix.shared.infrastructure.database.dbQuery
import com.gradix.features.criterio.domain.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.math.BigDecimal

class CriterioService {

    suspend fun getAll(materiaId: Int? = null): List<Criterio> = dbQuery {
        if (materiaId != null) {
            Criterios.select { Criterios.materiaId eq materiaId }
                .map(::mapToCriterio)
        } else {
            Criterios.selectAll().map(::mapToCriterio)
        }
    }

    suspend fun getById(id: Int): Criterio? = dbQuery {
        Criterios.select { Criterios.id eq id }
            .map(::mapToCriterio)
            .singleOrNull()
    }

    suspend fun create(request: CriterioRequest): Criterio = dbQuery {
        val id = Criterios.insert {
            it[nombre] = request.nombre
            it[descripcion] = request.descripcion
            it[porcentaje] = BigDecimal(request.porcentaje)
            it[materiaId] = request.materiaId
        }[Criterios.id]

        Criterio(
            id = id,
            nombre = request.nombre,
            descripcion = request.descripcion,
            porcentaje = request.porcentaje,
            materiaId = request.materiaId
        )
    }

    suspend fun update(id: Int, request: CriterioRequest): Criterio? = dbQuery {
        val updated = Criterios.update({ Criterios.id eq id }) {
            it[nombre] = request.nombre
            it[descripcion] = request.descripcion
            it[porcentaje] = BigDecimal(request.porcentaje)
            it[materiaId] = request.materiaId
        } > 0

        if (updated) {
            Criterios.select { Criterios.id eq id }
                .map(::mapToCriterio)
                .singleOrNull()
        } else null
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Criterios.deleteWhere { Criterios.id eq id } > 0
    }

    private fun mapToCriterio(row: ResultRow): Criterio = Criterio(
        id = row[Criterios.id],
        nombre = row[Criterios.nombre],
        descripcion = row[Criterios.descripcion],
        porcentaje = row[Criterios.porcentaje].toDouble(),
        materiaId = row[Criterios.materiaId]
    )
}

