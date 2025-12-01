package com.gradix.features.calificacion.infrastructure

import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.calificacionRoutes(calificacionController: CalificacionController) {
    route("/calificaciones") {
        get {
            calificacionController.getAll(call)
        }

        get("/{id}") {
            calificacionController.getById(call)
        }

        get("/alumno/{alumnoId}/criterio/{criterioId}") {
            calificacionController.getByAlumnoAndCriterio(call)
        }

        post {
            calificacionController.create(call)
        }

        post("/upsert") {
            calificacionController.upsert(call)
        }

        put("/{id}") {
            calificacionController.update(call)
        }

        delete("/{id}") {
            calificacionController.delete(call)
        }
    }
}

