# 🧠 PROMPT COMPLETO PARA GENERAR LA API GRADIX EN KTOR CON JWT (CONEXIÓN A BASE DE DATOS PENDIENTE)

**Contexto del Proyecto:**
Desarrolla una **API RESTful** en **Ktor (Kotlin)** para el sistema **Gradix**, cuyo propósito es automatizar la gestión de calificaciones para docentes de telesecundaria.  
Esta versión del proyecto debe **incluir toda la arquitectura lista**, pero **sin establecer aún la conexión real con la base de datos**.  
Debe dejar preparado el módulo `Database.kt` y las clases necesarias, con comentarios y placeholders donde el desarrollador agregará sus credenciales o configuración cuando esté listo.

---

### 🎯 Objetivo General
Implementar una API en **Ktor** que permita a los docentes:
- Registrarse e iniciar sesión de forma segura con **JWT**.  
- Gestionar alumnos, materias, campos formativos y criterios de evaluación.  
- Registrar calificaciones y obtener promedios automáticos.  
- Generar reportes en PDF.  

**Sin conexión activa a base de datos:**  
Solo dejar los modelos, servicios y controladores listos para recibir la integración real.

---

### 🧩 Requerimientos Técnicos

**Tecnología Base:**
- **Kotlin + Ktor**
- **JWT (JSON Web Token)** para autenticación.
- **kotlinx.serialization** para serialización de datos.
- **BCrypt** para hashing de contraseñas.
- **Estructura modular con controladores, rutas y servicios.**
- **Módulo `Database.kt` preparado**, pero con conexión deshabilitada (placeholders).

---

### 🧱 Configuración esperada (placeholders)

El archivo `Database.kt` debe contener algo como:

```kotlin
object DatabaseConfig {
    private const val DB_URL = "jdbc:postgresql://localhost:5432/gradix"
    private const val DB_USER = "usuario"
    private const val DB_PASSWORD = "contraseña"

    fun connect() {
        // TODO: Agregar la conexión real aquí cuando se configure la base de datos.
        // Ejemplo con Exposed:
        // Database.connect(DB_URL, driver = "org.postgresql.Driver", user = DB_USER, password = DB_PASSWORD)
        println("⚠️ Conexión a base de datos pendiente. Configurar en DatabaseConfig.kt")
    }
}
```

De esta forma el desarrollador podrá reemplazar los valores y habilitar la conexión más adelante.

---

### 🛠️ Módulos principales y endpoints sugeridos

#### 🔐 Autenticación y Usuarios
| Función | Método | Endpoint | Descripción |
|----------|---------|-----------|--------------|
| Registro | `POST` | `/api/register` | Crea un nuevo usuario docente. |
| Login | `POST` | `/api/login` | Verifica credenciales y devuelve JWT. |
| Perfil actual | `GET` | `/api/me` | Devuelve los datos del docente autenticado. |

**Detalles:**  
- Contraseñas hasheadas con BCrypt.  
- El JWT debe incluir `id`, `correo` y `nombre`.  
- Las rutas protegidas deben devolver `401 Unauthorized` sin token válido.  

---

#### 👨‍🏫 Gestión Académica
| Función | Método | Endpoint | Descripción |
|----------|---------|-----------|--------------|
| CRUD Alumnos | `GET/POST/PUT/DELETE` | `/api/alumnos` | Crear, listar, editar o eliminar alumnos del docente autenticado. |
| CRUD Materias | `GET/POST/PUT/DELETE` | `/api/materias` | Crear, listar, editar o eliminar materias. |
| CRUD Campos Formativos | `GET/POST/PUT/DELETE` | `/api/campos` | Gestionar campos formativos. |

**Importante:**  
Los métodos deben usar **repositorios simulados** (`FakeRepository`) o clases en memoria (`mutableListOf()`) para emular el comportamiento de la base de datos.

---

#### 📊 Criterios de Evaluación
| Función | Método | Endpoint | Descripción |
|----------|---------|-----------|--------------|
| CRUD Criterios | `GET/POST/PUT/DELETE` | `/api/materias/{id}/criterios` | Crear, ver, actualizar y eliminar criterios. |

**Validación:**  
Los porcentajes deben sumar **100%**.  

---

#### 🧾 Calificaciones
| Función | Método | Endpoint | Descripción |
|----------|---------|-----------|--------------|
| Registrar calificación | `POST` | `/api/calificaciones` | Guarda calificación (temporal en memoria). |
| Ver calificaciones | `GET` | `/api/materias/{id}/calificaciones` | Devuelve las calificaciones simuladas. |

**Regla:**  
Los promedios deben calcularse automáticamente con la lógica implementada en `CalificacionService.kt` sin persistencia aún.

---

#### 📈 Reportes
| Función | Método | Endpoint | Descripción |
|----------|---------|-----------|--------------|
| PDF grupal | `GET` | `/api/reportes/grupo/{id}` | Genera PDF con calificaciones simuladas. |
| PDF individual | `GET` | `/api/reportes/alumno/{id}` | Genera boleta individual. |

**Nota:**  
El módulo de reportes puede usar datos estáticos hasta integrar la base de datos.

---

### 🗃️ Modelos (Kotlin Data Classes)

Crea modelos con `@Serializable` listos para usarse con Exposed o cualquier ORM después.

```kotlin
@Serializable
data class Docente(val id: Int? = null, val nombre: String, val correo: String, val escuela: String)

@Serializable
data class Alumno(val id: Int? = null, val nombre: String, val apellidos: String, val docenteId: Int)

@Serializable
data class Materia(val id: Int? = null, val nombre: String, val campoId: Int, val docenteId: Int)

@Serializable
data class CampoFormativo(val id: Int? = null, val nombre: String)

@Serializable
data class Criterio(val id: Int? = null, val nombre: String, val porcentaje: Double, val materiaId: Int)

@Serializable
data class Calificacion(val id: Int? = null, val alumnoId: Int, val criterioId: Int, val valor: Double)
```

---

### ⚙️ Estructura recomendada del proyecto

```
/src
 ├── Application.kt
 ├── plugins/
 │    ├── Authentication.kt
 │    ├── Routing.kt
 │    ├── Serialization.kt
 │    └── Database.kt  ← incluye placeholders, sin conexión activa
 ├── controllers/
 │    ├── AuthController.kt
 │    ├── AlumnoController.kt
 │    ├── MateriaController.kt
 │    ├── CriterioController.kt
 │    ├── CalificacionController.kt
 │    └── ReporteController.kt
 ├── models/
 │    ├── Docente.kt
 │    ├── Alumno.kt
 │    ├── Materia.kt
 │    ├── CampoFormativo.kt
 │    ├── Criterio.kt
 │    └── Calificacion.kt
 ├── routes/
 │    ├── AuthRoutes.kt
 │    ├── AlumnoRoutes.kt
 │    ├── MateriaRoutes.kt
 │    ├── CriterioRoutes.kt
 │    ├── CalificacionRoutes.kt
 │    └── ReporteRoutes.kt
 └── services/
      ├── AuthService.kt
      ├── AlumnoService.kt
      ├── MateriaService.kt
      ├── CriterioService.kt
      ├── CalificacionService.kt
      └── ReporteService.kt
```

---

### 🔒 Seguridad
- Solo `/api/register` y `/api/login` son públicas.  
- Todas las demás rutas deben requerir JWT.  
- Middleware debe verificar token y devolver `401` si no es válido.  
- El token debe incluir `docenteId`.  

---

### 🧠 Entregable esperado
Genera el **código completo** de la API en **Ktor con JWT**, lista para futura conexión real.  
Debe incluir:
- Configuración del servidor.
- Configuración JWT.
- Controladores, servicios y modelos.
- `Database.kt` con placeholders para la conexión.  
- Ejemplo de repositorios simulados en memoria.

---

### 💬 Estilo de respuesta esperado
> Devuelve el código bien organizado y explicado.  
> No hagas la conexión real, solo deja todo preparado con comentarios `// TODO:` donde se debe configurar la conexión más adelante.

---

### 🧾 Ejemplo de instrucción al modelo
> “Usa este contexto y genera la estructura base de la API Gradix en Ktor con JWT.  
> No conectes la base de datos, pero deja preparado el archivo `Database.kt` con placeholders y comentarios para configurar después.”
