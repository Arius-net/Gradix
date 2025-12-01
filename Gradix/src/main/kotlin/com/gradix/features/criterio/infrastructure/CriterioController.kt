package com.gradix.features.criterio.infrastructure

import com.gradix.features.criterio.domain.*
import com.gradix.features.criterio.application.CriterioService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond

class CriterioController(private val criterioService: CriterioService) {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val materiaId = call.request.queryParameters["materiaId"]?.toIntOrNull()
            val criterios = criterioService.getAll(materiaId)
            call.respond(HttpStatusCode.OK, criterios)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener criterios")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val criterio = criterioService.getById(id)
            if (criterio != null) {
                call.respond(HttpStatusCode.OK, criterio)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Criterio no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener criterio")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<CriterioRequest>()
            val criterio = criterioService.create(request)
            call.respond(HttpStatusCode.Created, criterio)
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

            val request = call.receive<CriterioRequest>()
            val criterio = criterioService.update(id, request)

            if (criterio != null) {
                call.respond(HttpStatusCode.OK, criterio)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Criterio no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar criterio")))
        }
    }

    suspend fun delete(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val deleted = criterioService.delete(id)
            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Criterio eliminado exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Criterio no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar criterio")))
        }
    }
}

