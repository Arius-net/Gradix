package com.gradix.features.calificacion.infrastructure

import com.gradix.features.calificacion.domain.*
import com.gradix.features.calificacion.application.CalificacionService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*

class CalificacionController(private val calificacionService: CalificacionService) {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val alumnoId = call.request.queryParameters["alumnoId"]?.toIntOrNull()
            val criterioId = call.request.queryParameters["criterioId"]?.toIntOrNull()

            val calificaciones = calificacionService.getAll(alumnoId, criterioId)
            call.respond(HttpStatusCode.OK, calificaciones)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener calificaciones")))
        }
    }

    suspend fun getByAlumnoAndCriterio(call: ApplicationCall) {
        try {
            val alumnoId = call.parameters["alumnoId"]?.toIntOrNull()
            val criterioId = call.parameters["criterioId"]?.toIntOrNull()

            if (alumnoId == null || criterioId == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "alumnoId y criterioId son requeridos"))
                return
            }

            val calificacion = calificacionService.getByAlumnoAndCriterio(alumnoId, criterioId)
            if (calificacion != null) {
                call.respond(HttpStatusCode.OK, calificacion)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener calificación")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val calificacion = calificacionService.getById(id)
            if (calificacion != null) {
                call.respond(HttpStatusCode.OK, calificacion)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener calificación")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<CalificacionRequest>()
            val calificacion = calificacionService.create(request)
            call.respond(HttpStatusCode.Created, calificacion)
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

            val request = call.receive<CalificacionRequest>()
            val calificacion = calificacionService.update(id, request)

            if (calificacion != null) {
                call.respond(HttpStatusCode.OK, calificacion)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar calificación")))
        }
    }

    suspend fun delete(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val deleted = calificacionService.delete(id)
            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Calificación eliminada exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar calificación")))
        }
    }

    suspend fun upsert(call: ApplicationCall) {
        try {
            val request = call.receive<CalificacionRequest>()
            val calificacion = calificacionService.upsert(request)
            call.respond(HttpStatusCode.OK, calificacion)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error en la solicitud")))
        }
    }
}

