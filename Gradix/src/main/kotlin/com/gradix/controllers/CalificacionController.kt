package com.gradix.controllers

import com.gradix.dbQuery
import com.gradix.models.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.math.BigDecimal

class CalificacionController {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val alumnoId = call.request.queryParameters["alumnoId"]?.toIntOrNull()
            val criterioId = call.request.queryParameters["criterioId"]?.toIntOrNull()

            val calificaciones = dbQuery {
                var query = Calificaciones.selectAll()

                if (alumnoId != null) {
                    query = query.adjustWhere { Calificaciones.alumnoId eq alumnoId }
                }
                if (criterioId != null) {
                    query = query.adjustWhere { Calificaciones.criterioId eq criterioId }
                }

                query.map(::mapToCalificacion)
            }

            call.respond(HttpStatusCode.OK, calificaciones)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener calificaciones")))
        }
    }

    // Nuevo método para buscar por alumnoId y criterioId
    suspend fun getByAlumnoAndCriterio(call: ApplicationCall) {
        try {
            val alumnoId = call.parameters["alumnoId"]?.toIntOrNull()
            val criterioId = call.parameters["criterioId"]?.toIntOrNull()

            if (alumnoId == null || criterioId == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "alumnoId y criterioId son requeridos"))
                return
            }

            val calificacion = dbQuery {
                Calificaciones.select {
                    (Calificaciones.alumnoId eq alumnoId) and (Calificaciones.criterioId eq criterioId)
                }
                    .map(::mapToCalificacion)
                    .singleOrNull()
            }

            if (calificacion != null) {
                call.respond(HttpStatusCode.OK, calificacion)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener calificación")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val calificacion = dbQuery {
                Calificaciones.select { Calificaciones.id eq id }
                    .map(::mapToCalificacion)
                    .singleOrNull()
            }

            if (calificacion != null) {
                call.respond(HttpStatusCode.OK, calificacion)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener calificación")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<CalificacionRequest>()

            val id = dbQuery {
                Calificaciones.insert {
                    it[alumnoId] = request.alumnoId
                    it[criterioId] = request.criterioId
                    it[valor] = BigDecimal(request.valor)
                }[Calificaciones.id]
            }

            // Recuperar la calificación desde la BD para obtener el valor redondeado
            val calificacion = dbQuery {
                Calificaciones.select { Calificaciones.id eq id }
                    .map(::mapToCalificacion)
                    .singleOrNull()
            }

            if (calificacion != null) {
                call.respond(HttpStatusCode.Created, calificacion)
            } else {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error al crear la calificación"))
            }
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

            val request = call.receive<CalificacionRequest>()

            val updated = dbQuery {
                Calificaciones.update({ Calificaciones.id eq id }) {
                    it[alumnoId] = request.alumnoId
                    it[criterioId] = request.criterioId
                    it[valor] = BigDecimal(request.valor)
                } > 0
            }

            if (updated) {
                val calificacion = dbQuery {
                    Calificaciones.select { Calificaciones.id eq id }
                        .map(::mapToCalificacion)
                        .singleOrNull()
                }
                if (calificacion != null) {
                    call.respond(HttpStatusCode.OK, calificacion)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
                }
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar calificación")))
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
                Calificaciones.deleteWhere { Calificaciones.id eq id } > 0
            }

            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Calificación eliminada exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Calificación no encontrada"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar calificación")))
        }
    }

    // Método upsert: crea o actualiza según exista
    suspend fun upsert(call: ApplicationCall) {
        try {
            val request = call.receive<CalificacionRequest>()

            val calificacion = dbQuery {
                // Buscar si ya existe una calificación para este alumno y criterio
                val existing = Calificaciones.select {
                    (Calificaciones.alumnoId eq request.alumnoId) and (Calificaciones.criterioId eq request.criterioId)
                }.singleOrNull()

                if (existing != null) {
                    // Actualizar existente
                    val id = existing[Calificaciones.id]
                    Calificaciones.update({ Calificaciones.id eq id }) {
                        it[valor] = BigDecimal(request.valor)
                    }
                    // Recuperar el registro actualizado
                    Calificaciones.select { Calificaciones.id eq id }
                        .map(::mapToCalificacion)
                        .single()
                } else {
                    // Crear nuevo
                    val newId = Calificaciones.insert {
                        it[alumnoId] = request.alumnoId
                        it[criterioId] = request.criterioId
                        it[valor] = BigDecimal(request.valor)
                    }[Calificaciones.id]
                    // Recuperar el registro creado
                    Calificaciones.select { Calificaciones.id eq newId }
                        .map(::mapToCalificacion)
                        .single()
                }
            }

            call.respond(HttpStatusCode.OK, calificacion)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error en la solicitud")))
        }
    }

    private fun mapToCalificacion(row: ResultRow): Calificacion = Calificacion(
        id = row[Calificaciones.id],
        alumnoId = row[Calificaciones.alumnoId],
        criterioId = row[Calificaciones.criterioId],
        valor = row[Calificaciones.valor].toDouble(),
        fechaRegistro = row[Calificaciones.fechaRegistro]
    )
}
