package com.gradix.features.campoformativo.infrastructure

import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.campoFormativoRoutes(campoFormativoController: CampoFormativoController) {
    route("/campos-formativos") {
        get {
            campoFormativoController.getAll(call)
        }

        get("/{id}") {
            campoFormativoController.getById(call)
        }

        post {
            campoFormativoController.create(call)
        }

        put("/{id}") {
            campoFormativoController.update(call)
        }

        delete("/{id}") {
            campoFormativoController.delete(call)
        }
    }
}

