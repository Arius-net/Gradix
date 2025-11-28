package com.gradix.controllers

import com.gradix.models.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.respond

class ValidationUtils {
    companion object {
        fun validateAlumno(alumno: Alumno): Boolean {
            return alumno.nombre.isNotBlank() &&
                   alumno.apellidoPaterno.isNotBlank() &&
                   alumno.apellidoMaterno.isNotBlank()
        }

        fun validateMateria(materia: Materia): Boolean {
            return materia.nombre.isNotBlank() &&
                   materia.campoId > 0 &&
                   materia.docenteId > 0
        }
    }
}

suspend fun ApplicationCall.respondWithValidationError(message: String) {
    this.respond(HttpStatusCode.BadRequest, mapOf("error" to message))
}
