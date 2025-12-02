package com.gradix

import com.gradix.features.auth.application.AuthService
import com.gradix.features.auth.infrastructure.AuthController
import com.gradix.features.auth.infrastructure.authRoutes
import com.gradix.features.alumno.application.AlumnoService
import com.gradix.features.alumno.infrastructure.AlumnoController
import com.gradix.features.alumno.infrastructure.alumnoRoutes
import com.gradix.features.materia.application.MateriaService
import com.gradix.features.materia.infrastructure.MateriaController
import com.gradix.features.materia.infrastructure.materiaRoutes
import com.gradix.features.campoformativo.application.CampoFormativoService
import com.gradix.features.campoformativo.infrastructure.CampoFormativoController
import com.gradix.features.campoformativo.infrastructure.campoFormativoRoutes
import com.gradix.features.criterio.application.CriterioService
import com.gradix.features.criterio.infrastructure.CriterioController
import com.gradix.features.criterio.infrastructure.criterioRoutes
import com.gradix.features.calificacion.application.CalificacionService
import com.gradix.features.calificacion.infrastructure.CalificacionController
import com.gradix.features.calificacion.infrastructure.calificacionRoutes
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*

fun Application.configureRouting() {
    
    val authService = AuthService()
    val authController = AuthController(authService)

    val alumnoService = AlumnoService()
    val alumnoController = AlumnoController(alumnoService)

    val materiaService = MateriaService()
    val materiaController = MateriaController(materiaService)

    val campoFormativoService = CampoFormativoService()
    val campoFormativoController = CampoFormativoController(campoFormativoService)

    val criterioService = CriterioService()
    val criterioController = CriterioController(criterioService)

    val calificacionService = CalificacionService()
    val calificacionController = CalificacionController(calificacionService)

    
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respond(
                HttpStatusCode.InternalServerError,
                mapOf("error" to (cause.message ?: "Error interno del servidor"))
            )
        }
    }

    routing {

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

        authRoutes(authController)
        alumnoRoutes(alumnoController)
        materiaRoutes(materiaController)
        campoFormativoRoutes(campoFormativoController)
        criterioRoutes(criterioController)
        calificacionRoutes(calificacionController)
    }
}

