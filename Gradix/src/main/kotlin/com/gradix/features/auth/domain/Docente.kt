package com.gradix.features.auth.domain

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

// Tabla de base de datos
object Docentes : Table("docente") {
    val id = integer("id").autoIncrement()
    val nombre = varchar("nombre", 100)
    val correo = varchar("correo", 100).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val escuela = varchar("escuela", 120)
    val fechaRegistro = timestamp("fecha_registro").defaultExpression(CurrentTimestamp())

    override val primaryKey = PrimaryKey(id)
}

// DTO para serialización
@Serializable
data class Docente(
    val id: Int,
    val nombre: String,
    val correo: String,
    val escuela: String,
    @Contextual
    val fechaRegistro: Instant? = null
)

@Serializable
data class DocenteRequest(
    @kotlinx.serialization.SerialName("username")
    val nombre: String,
    @kotlinx.serialization.SerialName("email")
    val correo: String,
    val password: String,
    val escuela: String = "No especificado"
)

@Serializable
data class LoginRequest(
    val correo: String,
    val password: String
)

@Serializable
data class LoginResponse(
    val token: String,
    val docente: Docente
)


