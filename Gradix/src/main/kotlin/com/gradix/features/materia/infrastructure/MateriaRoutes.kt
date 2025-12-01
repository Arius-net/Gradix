package com.gradix.features.materia.infrastructure

import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.materiaRoutes(materiaController: MateriaController) {
    route("/materias") {
        get {
            materiaController.getAll(call)
        }

        get("/{id}") {
            materiaController.getById(call)
        }

        post {
            materiaController.create(call)
        }

        put("/{id}") {
            materiaController.update(call)
        }

        delete("/{id}") {
            materiaController.delete(call)
        }
    }
}

