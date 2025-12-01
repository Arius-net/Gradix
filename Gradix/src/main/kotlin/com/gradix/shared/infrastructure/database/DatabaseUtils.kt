package com.gradix.shared.infrastructure.database

// Función helper para ejecutar transacciones (reutilizable)
suspend fun <T> dbQuery(block: () -> T): T =
    org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction {
        block()
    }

