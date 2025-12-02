package com.gradix.features.calificacion.application

import com.gradix.shared.infrastructure.database.dbQuery
import com.gradix.features.calificacion.domain.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.math.BigDecimal

class CalificacionService {

    suspend fun getAll(alumnoId: Int? = null, criterioId: Int? = null): List<Calificacion> = dbQuery {
        var query = Calificaciones.selectAll()

        if (alumnoId != null) {
            query = query.adjustWhere { Calificaciones.alumnoId eq alumnoId }
        }
        if (criterioId != null) {
            query = query.adjustWhere { Calificaciones.criterioId eq criterioId }
        }

        query.map(::mapToCalificacion)
    }

    suspend fun getById(id: Int): Calificacion? = dbQuery {
        Calificaciones.select { Calificaciones.id eq id }
            .map(::mapToCalificacion)
            .singleOrNull()
    }

    suspend fun getByAlumnoAndCriterio(alumnoId: Int, criterioId: Int): Calificacion? = dbQuery {
        Calificaciones.select {
            (Calificaciones.alumnoId eq alumnoId) and (Calificaciones.criterioId eq criterioId)
        }
            .map(::mapToCalificacion)
            .singleOrNull()
    }

    suspend fun create(request: CalificacionRequest): Calificacion = dbQuery {
        val id = Calificaciones.insert {
            it[alumnoId] = request.alumnoId
            it[criterioId] = request.criterioId
            it[valor] = BigDecimal(request.valor)
        }[Calificaciones.id]

        Calificaciones.select { Calificaciones.id eq id }
            .map(::mapToCalificacion)
            .single()
    }

    suspend fun update(id: Int, request: CalificacionRequest): Calificacion? = dbQuery {
        val updated = Calificaciones.update({ Calificaciones.id eq id }) {
            it[alumnoId] = request.alumnoId
            it[criterioId] = request.criterioId
            it[valor] = BigDecimal(request.valor)
        } > 0

        if (updated) {
            Calificaciones.select { Calificaciones.id eq id }
                .map(::mapToCalificacion)
                .singleOrNull()
        } else null
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Calificaciones.deleteWhere { Calificaciones.id eq id } > 0
    }

    suspend fun upsert(request: CalificacionRequest): Calificacion = dbQuery {
        val existing = Calificaciones.select {
            (Calificaciones.alumnoId eq request.alumnoId) and (Calificaciones.criterioId eq request.criterioId)
        }.singleOrNull()

        if (existing != null) {
            val id = existing[Calificaciones.id]
            Calificaciones.update({ Calificaciones.id eq id }) {
                it[valor] = BigDecimal(request.valor)
            }
            Calificaciones.select { Calificaciones.id eq id }
                .map(::mapToCalificacion)
                .single()
        } else {
            val newId = Calificaciones.insert {
                it[alumnoId] = request.alumnoId
                it[criterioId] = request.criterioId
                it[valor] = BigDecimal(request.valor)
            }[Calificaciones.id]
            Calificaciones.select { Calificaciones.id eq newId }
                .map(::mapToCalificacion)
                .single()
        }
    }

    private fun mapToCalificacion(row: ResultRow): Calificacion = Calificacion(
        id = row[Calificaciones.id],
        alumnoId = row[Calificaciones.alumnoId],
        criterioId = row[Calificaciones.criterioId],
        valor = row[Calificaciones.valor].toDouble(),
        fechaRegistro = row[Calificaciones.fechaRegistro]
    )
}

