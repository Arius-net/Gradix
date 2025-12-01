package com.gradix.features.alumno.application

import com.gradix.shared.infrastructure.database.dbQuery
import com.gradix.features.alumno.domain.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class AlumnoService {

    suspend fun getAll(): List<Alumno> = dbQuery {
        Alumnos.selectAll().map { mapToAlumno(it) }
    }

    suspend fun getById(id: Int): Alumno? = dbQuery {
        Alumnos.select { Alumnos.id eq id }
            .map { mapToAlumno(it) }
            .singleOrNull()
    }

    suspend fun create(request: AlumnoRequest, docenteId: Int): Alumno = dbQuery {
        val apellidosCombinados = "${request.apellidoPaterno} ${request.apellidoMaterno}".trim()

        val id = Alumnos.insert {
            it[nombre] = request.nombre
            it[apellidos] = apellidosCombinados
            it[Alumnos.docenteId] = docenteId
            it[grado] = request.grado
            it[grupo] = request.grupo
        } get Alumnos.id

        Alumno(
            id = id,
            nombre = request.nombre,
            apellidoPaterno = request.apellidoPaterno,
            apellidoMaterno = request.apellidoMaterno,
            grado = request.grado,
            grupo = request.grupo,
            fechaRegistro = null
        )
    }

    suspend fun update(id: Int, request: AlumnoRequest): Alumno? = dbQuery {
        val apellidosCombinados = "${request.apellidoPaterno} ${request.apellidoMaterno}".trim()

        val updated = Alumnos.update({ Alumnos.id eq id }) {
            it[nombre] = request.nombre
            it[apellidos] = apellidosCombinados
            it[grado] = request.grado
            it[grupo] = request.grupo
        } > 0

        if (updated) {
            Alumnos.select { Alumnos.id eq id }
                .map { mapToAlumno(it) }
                .singleOrNull()
        } else null
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Alumnos.deleteWhere { Alumnos.id eq id } > 0
    }

    private fun mapToAlumno(row: ResultRow): Alumno {
        val apellidosCompletos = row[Alumnos.apellidos]
        val apellidosParts = apellidosCompletos.split(" ", limit = 2)
        val apellidoPaterno = apellidosParts.getOrElse(0) { "" }
        val apellidoMaterno = apellidosParts.getOrElse(1) { "" }

        return Alumno(
            id = row[Alumnos.id],
            nombre = row[Alumnos.nombre],
            apellidoPaterno = apellidoPaterno,
            apellidoMaterno = apellidoMaterno,
            grado = row[Alumnos.grado],
            grupo = row[Alumnos.grupo],
            fechaRegistro = row[Alumnos.fechaRegistro]
        )
    }
}

