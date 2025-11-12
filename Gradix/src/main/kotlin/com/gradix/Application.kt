package com.gradix

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.http.*

fun main() {
    embeddedServer(Netty, port = 8081, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    // Inicializar base de datos
    DatabaseFactory.init()

    // Configurar plugins
    configureSerialization()
    configureSecurity()
    configureRouting()
}
