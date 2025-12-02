package com.gradix.shared.infrastructure.database

suspend fun <T> dbQuery(block: () -> T): T =
    org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction {
        block()
    }

