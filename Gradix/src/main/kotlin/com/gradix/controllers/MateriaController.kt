package com.gradix.controllers

import com.gradix.dbQuery
import com.gradix.models.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class MateriaController {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val docenteId = call.request.queryParameters["docenteId"]?.toIntOrNull()
            val campoId = call.request.queryParameters["campoId"]?.toIntOrNull()

            val materias = dbQuery {
                var query = Materias.selectAll()

                if (docenteId != null) {
                    query = query.adjustWhere { Materias.docenteId eq docenteId }
                }
                if (campoId != null) {
                    query = query.adjustWhere { Materias.campoId eq campoId }
                }

                query.map(::mapToMateria)
            }

            call.respond(HttpStatusCode.OK, materias)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener materias")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val materia = dbQuery {
                Materias.select { Materias.id eq id }
                    .map(::mapToMateria)
                    .singleOrNull()
            }

            if (materia != null) {
                call.respond(HttpStatusCode.OK, materia)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Materia no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener materia")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<MateriaRequest>()

            // Validaciones
            val errores = mutableListOf<String>()

            if (request.nombre.isBlank()) {
                errores.add("El nombre de la materia es obligatorio")
            }

            if (errores.isNotEmpty()) {
                call.respond(HttpStatusCode.BadRequest, mapOf("errores" to errores))
                return
            }

            val id = dbQuery {
                Materias.insert {
                    it[nombre] = request.nombre
                    it[campoId] = request.campoId
                    it[docenteId] = request.docenteId
                    it[grado] = request.grado
                    it[grupo] = request.grupo
                }[Materias.id]
            }

            val materia = Materia(
                id = id,
                nombre = request.nombre,
                campoId = request.campoId,
                docenteId = request.docenteId,
                grado = request.grado,
                grupo = request.grupo
            )
            call.respond(HttpStatusCode.Created, materia)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error en la solicitud")))
        }
    }

    suspend fun update(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val request = call.receive<MateriaRequest>()

            val updated = dbQuery {
                Materias.update({ Materias.id eq id }) {
                    it[nombre] = request.nombre
                    it[campoId] = request.campoId
                    it[docenteId] = request.docenteId
                    it[grado] = request.grado
                    it[grupo] = request.grupo
                } > 0
            }

            if (updated) {
                val materia = dbQuery {
                    Materias.select { Materias.id eq id }
                        .map(::mapToMateria)
                        .singleOrNull()
                }
                if (materia != null) {
                    call.respond(HttpStatusCode.OK, materia)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Materia no encontrada"))
                }
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Materia no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar materia")))
        }
    }

    suspend fun delete(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val deleted = dbQuery {
                Materias.deleteWhere { Materias.id eq id } > 0
            }

            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Materia eliminada exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Materia no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar materia")))
        }
    }

    private fun mapToMateria(row: ResultRow): Materia = Materia(
        id = row[Materias.id],
        nombre = row[Materias.nombre],
        campoId = row[Materias.campoId],
        docenteId = row[Materias.docenteId],
        grado = row[Materias.grado],
        grupo = row[Materias.grupo]
    )
}
