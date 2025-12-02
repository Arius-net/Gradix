package com.gradix

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import java.util.*

object Security {
    private val secret = System.getenv("JWT_SECRET") ?: "gradix-secret-key-2024"
    private val issuer = System.getenv("JWT_ISSUER") ?: "gradix"
    private val audience = System.getenv("JWT_AUDIENCE") ?: "gradix-users"
    private val algorithm = Algorithm.HMAC256(secret)

    val verifier = JWT
        .require(algorithm)
        .withAudience(audience)
        .withIssuer(issuer)
        .build()

    fun generateToken(userId: Int, email: String): String = JWT.create()
        .withAudience(audience)
        .withIssuer(issuer)
        .withClaim("userId", userId)
        .withClaim("email", email)
        .withExpiresAt(Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
        .sign(algorithm)
}

fun Application.configureSecurity() {
    authentication {
        jwt("jwt") {
            verifier(Security.verifier)
            validate { credential ->
                if (credential.payload.getClaim("userId").asInt() != null) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }
}

