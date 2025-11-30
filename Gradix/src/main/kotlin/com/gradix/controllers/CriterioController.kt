package com.gradix.controllers

import com.gradix.dbQuery
import com.gradix.models.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.math.BigDecimal

class CriterioController {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val materiaId = call.request.queryParameters["materiaId"]?.toIntOrNull()

            val criterios = dbQuery {
                if (materiaId != null) {
                    Criterios.select { Criterios.materiaId eq materiaId }
                        .map(::mapToCriterio)
                } else {
                    Criterios.selectAll().map(::mapToCriterio)
                }
            }

            call.respond(HttpStatusCode.OK, criterios)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener criterios")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val criterio = dbQuery {
                Criterios.select { Criterios.id eq id }
                    .map(::mapToCriterio)
                    .singleOrNull()
            }

            if (criterio != null) {
                call.respond(HttpStatusCode.OK, criterio)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Criterio no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener criterio")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<CriterioRequest>()

            val id = dbQuery {
                Criterios.insert {
                    it[nombre] = request.nombre
                    it[descripcion] = request.descripcion
                    it[porcentaje] = BigDecimal(request.porcentaje)
                    it[materiaId] = request.materiaId
                }[Criterios.id]
            }

            val criterio = Criterio(
                id = id,
                nombre = request.nombre,
                descripcion = request.descripcion,
                porcentaje = request.porcentaje,
                materiaId = request.materiaId
            )
            call.respond(HttpStatusCode.Created, criterio)
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

            val request = call.receive<CriterioRequest>()

            val updated = dbQuery {
                Criterios.update({ Criterios.id eq id }) {
                    it[nombre] = request.nombre
                    it[descripcion] = request.descripcion
                    it[porcentaje] = BigDecimal(request.porcentaje)
                    it[materiaId] = request.materiaId
                } > 0
            }

            if (updated) {
                val criterio = dbQuery {
                    Criterios.select { Criterios.id eq id }
                        .map(::mapToCriterio)
                        .singleOrNull()
                }
                if (criterio != null) {
                    call.respond(HttpStatusCode.OK, criterio)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Criterio no encontrado"))
                }
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Criterio no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar criterio")))
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
                Criterios.deleteWhere { Criterios.id eq id } > 0
            }

            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Criterio eliminado exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Criterio no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar criterio")))
        }
    }

    private fun mapToCriterio(row: ResultRow): Criterio = Criterio(
        id = row[Criterios.id],
        nombre = row[Criterios.nombre],
        descripcion = row[Criterios.descripcion],
        porcentaje = row[Criterios.porcentaje].toDouble(),
        materiaId = row[Criterios.materiaId]
    )
}
