package com.gradix.routes

import com.gradix.controllers.*
import io.ktor.server.application.*
import io.ktor.server.routing.*
import kotlin.collections.get
import kotlin.text.get


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

fun Route.calificacionRoutes(calificacionController: CalificacionController) {
    route("/calificaciones") {
        get {
            calificacionController.getAll(call)
        }

        get("/{id}") {
            calificacionController.getById(call)
        }

        post {
            calificacionController.create(call)
        }

        put("/{id}") {
            calificacionController.update(call)
        }

        delete("/{id}") {
            calificacionController.delete(call)
        }
    }
}

