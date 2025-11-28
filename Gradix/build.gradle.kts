val ktor_version: String by project
val kotlin_version: String by project

plugins {
    kotlin("jvm") version "1.9.20" // Actualizado para soportar Java 21
    id("io.ktor.plugin") version "2.3.4" // Verificar compatibilidad con Ktor
    kotlin("plugin.serialization") version "1.9.20" // Actualizado para soportar Java 21
}

group = "com.gradix"
version = "0.0.1"

application {
    mainClass.set("com.gradix.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    // Ktor Server
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-server-netty:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor_version")
    implementation("io.ktor:ktor-server-auth:$ktor_version")
    implementation("io.ktor:ktor-server-auth-jwt:$ktor_version")
    implementation("io.ktor:ktor-server-call-logging:$ktor_version")
    implementation("io.ktor:ktor-server-cors:$ktor_version")
    implementation("io.ktor:ktor-server-status-pages:$ktor_version")

    // Exposed ORM - CRÍTICO
    implementation("org.jetbrains.exposed:exposed-core:0.44.1")
    implementation("org.jetbrains.exposed:exposed-dao:0.44.1")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.44.1")
    implementation("org.jetbrains.exposed:exposed-java-time:0.44.1")

    // Base de datos
    implementation("org.postgresql:postgresql:42.6.1") // Actualizado para mitigar CVE-2024-1597
    implementation("com.zaxxer:HikariCP:5.0.1")

    // BCrypt
    implementation("org.mindrot:jbcrypt:0.4")

    // Logging
    implementation("ch.qos.logback:logback-classic:1.4.11") // Versión más segura para mitigar vulnerabilidades

    // Testing
    testImplementation("io.ktor:ktor-server-tests-jvm:2.3.4") // Ajustado para coincidir con la versión del plugin de Ktor
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")

    //CORS
    implementation("io.ktor:ktor-server-cors:${ktor_version}")
}

kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(21)) // Java 21 con Kotlin 1.9.20+
    }
}
