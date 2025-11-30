package com.gradix.controllers

import com.gradix.dbQuery
import com.gradix.models.*
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class AlumnoController {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val alumnos: List<Alumno> = dbQuery {
                Alumnos.selectAll().map { mapToAlumno(it) }
            }

            call.respond(HttpStatusCode.OK, alumnos)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener alumnos")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val alumno: Alumno? = dbQuery {
                Alumnos.select { Alumnos.id eq id }
                    .map { mapToAlumno(it) }
                    .singleOrNull()
            }

            if (alumno != null) {
                call.respond(HttpStatusCode.OK, alumno)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Alumno no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener alumno")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<AlumnoRequest>()

            // Obtener el docente_id del JWT token
            val principal = call.principal<JWTPrincipal>()
            val docenteId = principal?.payload?.getClaim("userId")?.asInt()

            if (docenteId == null) {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "No autorizado - token inválido"))
                return
            }

            // Combinar apellidos en una sola columna para la BD
            val apellidosCombinados = "${request.apellidoPaterno} ${request.apellidoMaterno}".trim()

            val id = dbQuery {
                Alumnos.insert {
                    it[nombre] = request.nombre
                    it[apellidos] = apellidosCombinados
                    it[Alumnos.docenteId] = docenteId
                    it[grado] = request.grado
                    it[grupo] = request.grupo
                } get Alumnos.id
            }

            val alumno = Alumno(
                id = id,
                nombre = request.nombre,
                apellidoPaterno = request.apellidoPaterno,
                apellidoMaterno = request.apellidoMaterno,
                grado = request.grado,
                grupo = request.grupo,
                fechaRegistro = null
            )
            call.respond(HttpStatusCode.Created, alumno)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error en la solicitud")))
        }
    }

    suspend fun update(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val request = call.receive<AlumnoRequest>()

            // Combinar apellidos en una sola columna para la BD
            val apellidosCombinados = "${request.apellidoPaterno} ${request.apellidoMaterno}".trim()

            val updated = dbQuery {
                Alumnos.update({ Alumnos.id eq id }) {
                    it[nombre] = request.nombre
                    it[apellidos] = apellidosCombinados
                    it[grado] = request.grado
                    it[grupo] = request.grupo
                } > 0
            }

            if (updated) {
                val alumno: Alumno? = dbQuery {
                    Alumnos.select { Alumnos.id eq id }
                        .map { mapToAlumno(it) }
                        .singleOrNull()
                }
                if (alumno != null) {
                    call.respond(HttpStatusCode.OK, alumno)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Alumno no encontrado"))
                }
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Alumno no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar alumno")))
        }
    }

    suspend fun delete(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val deleted = dbQuery {
                Alumnos.deleteWhere { Alumnos.id eq id } > 0
            }

            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Alumno eliminado exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Alumno no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar alumno")))
        }
    }

    private fun mapToAlumno(row: ResultRow): Alumno {
        // Separar apellidos de la BD en apellidoPaterno y apellidoMaterno
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
