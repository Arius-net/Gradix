package com.gradix.controllers

import com.gradix.dbQuery
import com.gradix.models.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class CampoFormativoController {

    suspend fun getAll(call: ApplicationCall) {
        try {
            val campos = dbQuery {
                CampoFormativos.selectAll().map(::mapToCampoFormativo)
            }
            call.respond(HttpStatusCode.OK, campos)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener campos formativos")))
        }
    }

    suspend fun getById(call: ApplicationCall) {
        try {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID inválido"))
                return
            }

            val campo = dbQuery {
                CampoFormativos.select { CampoFormativos.id eq id }
                    .map(::mapToCampoFormativo)
                    .singleOrNull()
            }

            if (campo != null) {
                call.respond(HttpStatusCode.OK, campo)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Campo formativo no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al obtener campo formativo")))
        }
    }

    suspend fun create(call: ApplicationCall) {
        try {
            val request = call.receive<CampoFormativoRequest>()

            val id = dbQuery {
                CampoFormativos.insert {
                    it[nombre] = request.nombre
                }[CampoFormativos.id]
            }

            val campo = CampoFormativo(id = id, nombre = request.nombre)
            call.respond(HttpStatusCode.Created, campo)
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

            val request = call.receive<CampoFormativoRequest>()

            val updated = dbQuery {
                CampoFormativos.update({ CampoFormativos.id eq id }) {
                    it[nombre] = request.nombre
                } > 0
            }

            if (updated) {
                val campo = dbQuery {
                    CampoFormativos.select { CampoFormativos.id eq id }
                        .map(::mapToCampoFormativo)
                        .singleOrNull()
                }
                if (campo != null) {
                    call.respond(HttpStatusCode.OK, campo)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Campo formativo no encontrado"))
                }
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Campo formativo no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Error al actualizar campo formativo")))
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
                CampoFormativos.deleteWhere { CampoFormativos.id eq id } > 0
            }

            if (deleted) {
                call.respond(HttpStatusCode.OK, mapOf("message" to "Campo formativo eliminado exitosamente"))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Campo formativo no encontrado"))
            }
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Error al eliminar campo formativo")))
        }
    }

    private fun mapToCampoFormativo(row: ResultRow): CampoFormativo = CampoFormativo(
        id = row[CampoFormativos.id],
        nombre = row[CampoFormativos.nombre]
    )
}
