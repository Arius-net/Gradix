package com.gradix.features.campoformativo.infrastructure

import com.gradix.features.campoformativo.domain.*
import com.gradix.features.campoformativo.application.CampoFormativoService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond

class CampoFormativoController(private val campoFormativoService: CampoFormativoService) {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val campos = campoFormativoService.getAll()
            call.respond(HttpStatusCode.OK, campos)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener campos formativos")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val campo = campoFormativoService.getById(id)
            if (campo != null) {
                call.respond(HttpStatusCode.OK, campo)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Campo formativo no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener campo formativo")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<CampoFormativoRequest>()
            val campo = campoFormativoService.create(request)
            call.respond(HttpStatusCode.Created, campo)
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

            val request = call.receive<CampoFormativoRequest>()
            val campo = campoFormativoService.update(id, request)

            if (campo != null) {
                call.respond(HttpStatusCode.OK, campo)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Campo formativo no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar campo formativo")))
        }
    }

    suspend fun delete(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val deleted = campoFormativoService.delete(id)
            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Campo formativo eliminado exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Campo formativo no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar campo formativo")))
        }
    }
}

