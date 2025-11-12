package com.gradix

import com.gradix.controllers.*
import com.gradix.routes.*
import com.gradix.services.AuthService
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*

fun Application.configureRouting() {
    // Inicializar servicios y controladores
    val authService = AuthService()
    val authController = AuthController(authService)
    val alumnoController = AlumnoController()
    val materiaController = MateriaController()
    val campoFormativoController = CampoFormativoController()
    val criterioController = CriterioController()
    val calificacionController = CalificacionController()

    // Configurar manejo de errores
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respond(
                HttpStatusCode.InternalServerError,
                mapOf("error" to (cause.message ?: "Error interno del servidor"))
            )
        }
    }

    routing {
        // Ruta de bienvenida
        get("/") {
            call.respond(HttpStatusCode.OK, mapOf(
                "message" to "Bienvenido a Gradix API",
                "version" to "1.0.0",
                "endpoints" to listOf(
                    "/auth/register",
                    "/auth/login",
                    "/alumnos",
                    "/materias",
                    "/campos-formativos",
                    "/criterios",
                    "/calificaciones"
                )
            ))
        }

        // Rutas de la API
        authRoutes(authController)
        alumnoRoutes(alumnoController)
        materiaRoutes(materiaController)
        campoFormativoRoutes(campoFormativoController)
        criterioRoutes(criterioController)
        calificacionRoutes(calificacionController)
    }
}

