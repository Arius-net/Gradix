package com.gradix.features.auth.infrastructure

import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.authRoutes(authController: AuthController) {
    route("/auth") {
        post("/register") {
            authController.register(call)
        }

        post("/login") {
            authController.login(call)
        }

        get("/me") {
            authController.me(call)
        }
    }
}

