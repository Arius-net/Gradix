package com.gradix.routes

import com.gradix.controllers.AlumnoController
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.routing.*

fun Route.alumnoRoutes(alumnoController: AlumnoController) {
    route("/alumnos") {
        // Sin autenticación por ahora para facilitar pruebas
        get {
            alumnoController.getAll(call)
        }

        get("/{id}") {
            alumnoController.getById(call)
        }

        post {
            alumnoController.create(call)
        }

        put("/{id}") {
            alumnoController.update(call)
        }

        delete("/{id}") {
            alumnoController.delete(call)
        }
    }
}

