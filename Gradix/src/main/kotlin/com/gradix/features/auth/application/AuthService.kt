package com.gradix.features.auth.application

import org.mindrot.jbcrypt.BCrypt
import com.gradix.shared.infrastructure.database.dbQuery
import com.gradix.features.auth.domain.*
import org.jetbrains.exposed.sql.*

class AuthService {

    suspend fun register(request: DocenteRequest): Docente? = dbQuery {
        val hashedPassword = BCrypt.hashpw(request.password, BCrypt.gensalt(12))

        val id = Docentes.insert {
            it[nombre] = request.nombre
            it[correo] = request.correo
            it[passwordHash] = hashedPassword
            it[escuela] = request.escuela
        }[Docentes.id]

        Docente(
            id = id,
            nombre = request.nombre,
            correo = request.correo,
            escuela = request.escuela,
            fechaRegistro = null
        )
    }

    suspend fun login(correo: String, password: String): Docente? = dbQuery {
        val result = Docentes.select { Docentes.correo eq correo }
            .map { row ->
                val storedPassword = row[Docentes.passwordHash]
                val docente = mapToDocente(row)
                storedPassword to docente
            }
            .singleOrNull()

        if (result != null) {
            val (storedPassword, docente) = result
            if (BCrypt.checkpw(password, storedPassword)) {
                docente
            } else null
        } else null
    }

    suspend fun findByCorreo(correo: String): Docente? = dbQuery {
        Docentes.select { Docentes.correo eq correo }
            .map(::mapToDocente)
            .singleOrNull()
    }

    suspend fun findById(id: Int): Docente? = dbQuery {
        Docentes.select { Docentes.id eq id }
            .map(::mapToDocente)
            .singleOrNull()
    }

    private fun mapToDocente(row: ResultRow): Docente = Docente(
        id = row[Docentes.id],
        nombre = row[Docentes.nombre],
        correo = row[Docentes.correo],
        escuela = row[Docentes.escuela],
        fechaRegistro = row[Docentes.fechaRegistro]
    )
}

