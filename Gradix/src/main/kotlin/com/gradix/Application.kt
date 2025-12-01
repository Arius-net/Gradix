package com.gradix

import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.http.* // Importar para HttpMethod
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

fun Application.module() {
    // Inicializar base de datos
    DatabaseFactory.init()

    // ➡️ Configurar CORS AQUÍ
    install(CORS) {
        // 🚨 CAMBIA 4200 por el puerto real de tu app Angular si es diferente
        allowHost("localhost:4200", schemes = listOf("http"))

        // Métodos HTTP que Angular usará para interactuar con tu API
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)

        // Cabeceras comunes necesarias (ej. para JSON o JWT)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)

        // Permitir que las cookies o credenciales se envíen
        allowCredentials = true

        // Tiempo máximo en segundos para el pre-vuelo (preflight request)
        maxAgeInSeconds = 3600
    }
    // ⬅️ Fin de la configuración de CORS

    // Configurar plugins
    configureSerialization()
    configureSecurity()
    configureRouting()
}

fun main() {
    embeddedServer(Netty, port = 8081, host = "0.0.0.0", module = Application::module).start(wait = true)
}
