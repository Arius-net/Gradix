package com.gradix.features.materia.infrastructure

import com.gradix.features.materia.domain.*
import com.gradix.features.materia.application.MateriaService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond

class MateriaController(private val materiaService: MateriaService) {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val docenteId = call.request.queryParameters["docenteId"]?.toIntOrNull()
            val campoId = call.request.queryParameters["campoId"]?.toIntOrNull()

            val materias = materiaService.getAll(docenteId, campoId)
            call.respond(HttpStatusCode.OK, materias)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener materias")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val materia = materiaService.getById(id)
            if (materia != null) {
                call.respond(HttpStatusCode.OK, materia)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Materia no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener materia")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<MateriaRequest>()

            // Validaciones
            val errores = mutableListOf<String>()
            if (request.nombre.isBlank()) {
                errores.add("El nombre de la materia es obligatorio")
            }

            if (errores.isNotEmpty()) {
                call.respond(HttpStatusCode.BadRequest, mapOf("errores" to errores))
                return
            }

            val materia = materiaService.create(request)
            call.respond(HttpStatusCode.Created, materia)
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

            val request = call.receive<MateriaRequest>()
            val materia = materiaService.update(id, request)

            if (materia != null) {
                call.respond(HttpStatusCode.OK, materia)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Materia no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar materia")))
        }
    }

    suspend fun delete(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val deleted = materiaService.delete(id)
            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Materia eliminada exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Materia no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar materia")))
        }
    }
}

