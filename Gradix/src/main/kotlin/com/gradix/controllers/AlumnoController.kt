package com.gradix.controllers

import com.gradix.dbQuery
import com.gradix.models.*
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class AlumnoController {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val docenteId = call.request.queryParameters["docenteId"]?.toIntOrNull()

            val alumnos: List<Alumno> = dbQuery {
                if (docenteId != null) {
                    Alumnos.select { Alumnos.docenteId eq docenteId }
                        .map { mapToAlumno(it) }
                } else {
                    Alumnos.selectAll().map { mapToAlumno(it) }
                }
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

            val id = dbQuery {
                Alumnos.insert {
                    it[nombre] = request.nombre
                    it[apellidos] = request.apellidos
                    it[docenteId] = request.docenteId
                }[Alumnos.id]
            }

            val alumno = Alumno(
                id = id,
                nombre = request.nombre,
                apellidos = request.apellidos,
                docenteId = request.docenteId,
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

            val updated = dbQuery {
                Alumnos.update({ Alumnos.id eq id }) {
                    it[nombre] = request.nombre
                    it[apellidos] = request.apellidos
                    it[docenteId] = request.docenteId
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

    private fun mapToAlumno(row: ResultRow): Alumno = Alumno(
        id = row[Alumnos.id],
        nombre = row[Alumnos.nombre],
        apellidos = row[Alumnos.apellidos],
        docenteId = row[Alumnos.docenteId],
        fechaRegistro = row[Alumnos.fechaRegistro]
    )
}
