package com.gradix

import com.gradix.features.auth.domain.Docentes
import com.gradix.features.alumno.domain.Alumnos
import com.gradix.features.campoformativo.domain.CampoFormativos
import com.gradix.features.materia.domain.Materias
import com.gradix.features.criterio.domain.Criterios
import com.gradix.features.calificacion.domain.Calificaciones
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {

    private fun hikari(): HikariDataSource {
        val config = HikariConfig().apply {
            driverClassName = System.getenv("DB_DRIVER") ?: "org.postgresql.Driver"
            jdbcUrl = System.getenv("DB_URL") ?: "jdbc:postgresql://localhost:5432/Gradix"
            username = System.getenv("DB_USER") ?: "postgres"
            password = System.getenv("DB_PASSWORD") ?: "0620"
            maximumPoolSize = 3
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"

            // Validación de configuración
            validate()
        }
        return HikariDataSource(config)
    }

    fun init() {
        Database.connect(hikari())
        transaction {
            SchemaUtils.createMissingTablesAndColumns(
                Docentes,
                CampoFormativos,
                Materias,
                Alumnos,
                Criterios,
                Calificaciones
            )
        }
    }
}

