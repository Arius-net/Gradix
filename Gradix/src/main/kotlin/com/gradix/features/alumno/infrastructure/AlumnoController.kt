package com.gradix.features.alumno.infrastructure

import com.gradix.features.alumno.domain.*
import com.gradix.features.alumno.application.AlumnoService
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond

class AlumnoController(private val alumnoService: AlumnoService) {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val alumnos = alumnoService.getAll()
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

            val alumno = alumnoService.getById(id)
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

            val principal = call.principal<JWTPrincipal>()
            val docenteId = principal?.payload?.getClaim("userId")?.asInt()

            if (docenteId == null) {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "No autorizado - token inválido"))
                return
            }

            val alumno = alumnoService.create(request, docenteId)
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
            val alumno = alumnoService.update(id, request)

            if (alumno != null) {
                call.respond(HttpStatusCode.OK, alumno)
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

            val deleted = alumnoService.delete(id)
            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Alumno eliminado exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Alumno no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar alumno")))
        }
    }
}

