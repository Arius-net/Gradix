package com.gradix.features.auth.infrastructure

import com.gradix.Security
import com.gradix.features.auth.domain.*
import com.gradix.features.auth.application.AuthService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.request.receiveText
import io.ktor.server.response.respond

class AuthController(private val authService: AuthService) {

    suspend fun register(call: ApplicationCall) {
        try {
            // Log para ver el body raw que llega
            val bodyText = call.receiveText()
            call.application.environment.log.info("Body recibido en /register: $bodyText")

            // Intentar parsear manualmente para debug
            try {
                val request = kotlinx.serialization.json.Json.decodeFromString<DocenteRequest>(bodyText)
                call.application.environment.log.info("Request parseado correctamente: $request")

                // Verificar si el correo ya existe
                val existingDocente = authService.findByCorreo(request.correo)
                if (existingDocente != null) {
                    call.respond(HttpStatusCode.Conflict, mapOf("error" to "El correo ya está registrado"))
                    return
                }

                val docente = authService.register(request)
                if (docente != null) {
                    val token = Security.generateToken(docente.id, docente.correo)
                    call.respond(HttpStatusCode.Created, LoginResponse(token, docente))
                } else {
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error al registrar docente"))
                }
            } catch (e: Exception) {
                call.application.environment.log.error("Error al parsear request: ${e.message}", e)
                call.respond(HttpStatusCode.BadRequest, mapOf(
                    "error" to "Error al parsear la solicitud: ${e.message}",
                    "details" to e.toString()
                ))
            }
        } catch (e: Exception) {
            call.application.environment.log.error("Error al recibir body: ${e.message}", e)
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error en la solicitud")))
        }
    }

    suspend fun login(call: ApplicationCall) {
        try {
            val request = call.receive<LoginRequest>()
            val docente = authService.login(request.correo, request.password)

            if (docente != null) {
                val token = Security.generateToken(docente.id, docente.correo)
                call.respond(HttpStatusCode.OK, LoginResponse(token, docente))
            } else {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Credenciales inválidas"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error en la solicitud")))
        }
    }

    suspend fun me(call: ApplicationCall) {
        try {
            val userId = call.request.headers["userId"]?.toIntOrNull()
            if (userId != null) {
                val docente = authService.findById(userId)
                if (docente != null) {
                    call.respond(HttpStatusCode.OK, docente)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Docente no encontrado"))
                }
            } else {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "No autorizado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error interno")))
        }
    }
}

