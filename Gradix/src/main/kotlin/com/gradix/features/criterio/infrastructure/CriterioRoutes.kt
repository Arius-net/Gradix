package com.gradix.features.criterio.infrastructure

import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.criterioRoutes(criterioController: CriterioController) {
    route("/criterios") {
        get {
            criterioController.getAll(call)
        }

        get("/{id}") {
            criterioController.getById(call)
        }

        post {
            criterioController.create(call)
        }

        put("/{id}") {
            criterioController.update(call)
        }

        delete("/{id}") {
            criterioController.delete(call)
        }
    }
}

