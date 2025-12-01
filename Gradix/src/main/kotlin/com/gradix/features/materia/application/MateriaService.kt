package com.gradix.features.materia.application

import com.gradix.shared.infrastructure.database.dbQuery
import com.gradix.features.materia.domain.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class MateriaService {

    suspend fun getAll(docenteId: Int? = null, campoId: Int? = null): List<Materia> = dbQuery {
        var query = Materias.selectAll()

        if (docenteId != null) {
            query = query.adjustWhere { Materias.docenteId eq docenteId }
        }
        if (campoId != null) {
            query = query.adjustWhere { Materias.campoId eq campoId }
        }

        query.map(::mapToMateria)
    }

    suspend fun getById(id: Int): Materia? = dbQuery {
        Materias.select { Materias.id eq id }
            .map(::mapToMateria)
            .singleOrNull()
    }

    suspend fun create(request: MateriaRequest): Materia = dbQuery {
        val id = Materias.insert {
            it[nombre] = request.nombre
            it[campoId] = request.campoId
            it[docenteId] = request.docenteId
            it[grado] = request.grado
            it[grupo] = request.grupo
        }[Materias.id]

        Materia(
            id = id,
            nombre = request.nombre,
            campoId = request.campoId,
            docenteId = request.docenteId,
            grado = request.grado,
            grupo = request.grupo
        )
    }

    suspend fun update(id: Int, request: MateriaRequest): Materia? = dbQuery {
        val updated = Materias.update({ Materias.id eq id }) {
            it[nombre] = request.nombre
            it[campoId] = request.campoId
            it[docenteId] = request.docenteId
            it[grado] = request.grado
            it[grupo] = request.grupo
        } > 0

        if (updated) {
            Materias.select { Materias.id eq id }
                .map(::mapToMateria)
                .singleOrNull()
        } else null
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Materias.deleteWhere { Materias.id eq id } > 0
    }

    private fun mapToMateria(row: ResultRow): Materia = Materia(
        id = row[Materias.id],
        nombre = row[Materias.nombre],
        campoId = row[Materias.campoId],
        docenteId = row[Materias.docenteId],
        grado = row[Materias.grado],
        grupo = row[Materias.grupo]
    )
}

