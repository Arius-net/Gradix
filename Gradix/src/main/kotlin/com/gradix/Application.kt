package com.gradix

import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.http.* // Importar para HttpMethod
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

fun Application.module() {
    
    DatabaseFactory.init()

    install(CORS) {

        allowHost("http://frontgradix.s3-website-us-east-1.amazonaws.com", schemes = listOf("http"))

        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)

        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)

        allowCredentials = true

        maxAgeInSeconds = 3600
    }
    
    configureSerialization()
    configureSecurity()
    configureRouting()
}

fun main() {
    embeddedServer(Netty, port = 8081, host = "0.0.0.0", module = Application::module).start(wait = true)
}
