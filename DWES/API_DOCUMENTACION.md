# Documentación Completa de la API REST

## Introducción

Este documento proporciona documentación exhaustiva de todos los endpoints de la API REST de la Plataforma Educativa de Tecnología para Adultos Mayores. Incluye descripción, parámetros, respuestas, códigos HTTP y ejemplos de uso.

---

## Tabla de Contenidos

- [Autenticación](#autenticación)
- [Lecciones](#lecciones)
- [Pasos](#pasos)
- [Categorías](#categorías)
- [Simuladores](#simuladores)
- [Progreso y Favoritos](#progreso-y-favoritos)
- [FAQ](#faq)
- [Administración](#administración)
- [Códigos HTTP](#códigos-http)
- [Modelos de Respuesta](#modelos-de-respuesta)

---

## Autenticación

### Registro de Usuario

**Endpoint:** `POST /api/auth/register`

**Descripción:** Registrar un nuevo usuario en la plataforma.

**Autorización:** Público (sin token requerido)

**Request Body:**
```json
{
  "username": "string (único, requerido)",
  "email": "string (email válido, único, requerido)",
  "password": "string (mínimo 6 caracteres, requerido)",
  "confirmPassword": "string (debe coincidir con password, requerido)"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@example.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-12-15T10:30:00",
    "updatedAt": "2025-12-15T10:30:00"
  },
  "message": "Usuario registrado exitosamente"
}
```

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | Contraseñas no coinciden, campos inválidos |
| 409 | Username o email ya registrados |

---

### Login

**Endpoint:** `POST /api/auth/login`

**Descripción:** Iniciar sesión con credenciales y obtener token JWT.

**Autorización:** Público (sin token requerido)

**Request Body:**
```json
{
  "username": "string (requerido)",
  "password": "string (requerido)"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@example.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-12-15T10:30:00",
    "updatedAt": "2025-12-15T10:30:00"
  },
  "message": "Login exitoso"
}
```

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | Username o password faltantes |
| 401 | Credenciales inválidas |
| 401 | Usuario inactivo |

**Notas:** El token JWT expira en 24 horas (86400000 ms).

---

### Obtener Usuario Autenticado

**Endpoint:** `GET /api/auth/me`

**Descripción:** Obtener datos del usuario actualmente autenticado.

**Autorización:** Requerido (Bearer Token)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "username": "usuario",
  "email": "usuario@example.com",
  "role": "USER",
  "isActive": true,
  "createdAt": "2025-12-15T10:30:00",
  "updatedAt": "2025-12-15T10:30:00"
}
```

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 401 | Token no proporcionado o inválido |
| 401 | Usuario no encontrado |

---

### Logout

**Endpoint:** `POST /api/auth/logout`

**Descripción:** Cerrar sesión e invalidar el token actual.

**Autorización:** Requerido (Bearer Token)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Logout exitoso",
  "timestamp": "1671107200000"
}
```

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | Token no proporcionado en header |
| 401 | Token inválido o expirado |

---

## Lecciones

### Obtener Todas las Lecciones

**Endpoint:** `GET /api/lessons`

**Descripción:** Obtener todas las lecciones publicadas con paginación y ordenación.

**Autorización:** Público

**Query Parameters:**
```
page=0 (número de página, opcional, defecto: 0)
size=20 (cantidad de registros, opcional, defecto: 20)
sort=createdAt (campo para ordenar, opcional)
direction=desc (ASC o DESC, opcional, defecto: desc)
```

**Ejemplo:** `/api/lessons?page=0&size=20&sort=createdAt&direction=desc`

**Respuesta Exitosa (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Cómo enviar un mensaje de WhatsApp",
      "description": "Tutorial paso a paso",
      "categoryId": 1,
      "categoryName": "Mensajería",
      "isPublished": true,
      "createdAt": "2025-12-15T10:30:00",
      "updatedAt": "2025-12-15T10:30:00",
      "steps": [
        {
          "id": 1,
          "title": "Abre WhatsApp",
          "content": "Busca y toca el icono de WhatsApp",
          "stepOrder": 1,
          "imageUrl": "https://example.com/imagen.jpg",
          "videoUrl": null
        }
      ]
    }
  ],
  "totalElements": 45,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 20
}
```

---

### Obtener Lección por ID

**Endpoint:** `GET /api/lessons/{id}`

**Descripción:** Obtener una lección específica incluyendo todos sus pasos.

**Autorización:** Público

**Path Parameters:**
```
id: Long (id de la lección)
```

**Respuesta Exitosa (200 OK):** Mismo formato que lección individual anterior

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 404 | Lección no encontrada |

---

### Buscar Lecciones

**Endpoint:** `GET /api/lessons/search`

**Descripción:** Buscar lecciones por palabra clave en título o descripción.

**Autorización:** Público

**Query Parameters:**
```
text=string (palabra clave para buscar, requerido)
page=0 (opcional)
size=20 (opcional)
```

**Ejemplo:** `/api/lessons/search?text=whatsapp&page=0&size=20`

**Respuesta Exitosa (200 OK):** Mismo formato que listar lecciones

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | Parámetro text faltante |

---

### Lecciones por Categoría

**Endpoint:** `GET /api/lessons/category/{categoryId}`

**Descripción:** Obtener todas las lecciones de una categoría específica.

**Autorización:** Público

**Path Parameters:**
```
categoryId: Long (id de la categoría)
```

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):** Mismo formato que listar lecciones

---

### Lecciones Trending

**Endpoint:** `GET /api/lessons/trending`

**Descripción:** Obtener las lecciones más accedidas (trending).

**Autorización:** Público

**Query Parameters:**
```
page=0 (opcional)
size=10 (opcional)
```

**Respuesta Exitosa (200 OK):** Mismo formato que listar lecciones

---

### Lecciones con Simulador

**Endpoint:** `GET /api/lessons/with-simulator`

**Descripción:** Obtener lecciones que tienen simulador asociado.

**Autorización:** Público

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):** Mismo formato que listar lecciones

---

### Crear Lección

**Endpoint:** `POST /api/lessons`

**Descripción:** Crear una nueva lección (solo ADMIN).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Request Body:**
```json
{
  "title": "string (requerido)",
  "description": "string (requerido)",
  "categoryId": 1,
  "adminId": 1
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 5,
  "title": "Cómo enviar un mensaje de WhatsApp",
  "description": "Tutorial paso a paso",
  "categoryId": 1,
  "isPublished": false,
  "createdAt": "2025-12-15T10:30:00",
  "updatedAt": "2025-12-15T10:30:00",
  "steps": []
}
```

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | Validación fallida (campos faltantes) |
| 401 | Token no proporcionado o inválido |
| 403 | Usuario sin rol ADMIN |
| 409 | Título duplicado |

---

### Actualizar Lección

**Endpoint:** `PUT /api/lessons/{id}`

**Descripción:** Actualizar una lección (solo el ADMIN que la creó).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la lección)
```

**Request Body:**
```json
{
  "title": "string (requerido)",
  "description": "string (requerido)",
  "categoryId": 1,
  "adminId": 1
}
```

**Respuesta Exitosa (200 OK):** Lección actualizada

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | Validación fallida |
| 401 | Token inválido |
| 403 | No es el autor de la lección |
| 404 | Lección no encontrada |

---

### Publicar Lección

**Endpoint:** `POST /api/lessons/{id}/publish`

**Descripción:** Publicar una lección (requiere al menos 1 paso).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la lección)
```

**Query Parameters:**
```
adminId: Long (id del admin)
```

**Respuesta Exitosa (200 OK):** Lección publicada

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 403 | No es el autor |
| 404 | Lección no encontrada |
| 400 | Lección sin pasos |

---

### Despublicar Lección

**Endpoint:** `POST /api/lessons/{id}/unpublish`

**Descripción:** Despublicar una lección (ocultarla).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la lección)
```

**Query Parameters:**
```
adminId: Long (id del admin)
```

**Respuesta Exitosa (200 OK):** Lección despublicada

---

### Eliminar Lección

**Endpoint:** `DELETE /api/lessons/{id}`

**Descripción:** Eliminar una lección y todos sus pasos (solo autor).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la lección)
```

**Query Parameters:**
```
adminId: Long (id del admin)
```

**Respuesta Exitosa (204 No Content):** Sin cuerpo

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 403 | No es el autor |
| 404 | Lección no encontrada |

---

## Pasos

### Obtener Pasos de una Lección

**Endpoint:** `GET /api/lessons/{lessonId}/steps`

**Descripción:** Obtener todos los pasos de una lección en orden secuencial.

**Autorización:** Público

**Path Parameters:**
```
lessonId: Long (id de la lección)
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "lessonId": 1,
    "stepOrder": 1,
    "title": "Abre WhatsApp",
    "content": "Busca y toca el icono de WhatsApp",
    "imageUrl": "https://example.com/imagen.jpg",
    "videoUrl": null,
    "createdAt": "2025-12-15T10:30:00",
    "updatedAt": "2025-12-15T10:30:00"
  }
]
```

---

### Crear Paso

**Endpoint:** `POST /api/lessons/{lessonId}/steps`

**Descripción:** Crear un nuevo paso en una lección (solo autor de la lección).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
lessonId: Long (id de la lección)
```

**Request Body:**
```json
{
  "title": "string (requerido)",
  "content": "string (requerido)",
  "stepOrder": 1,
  "imageUrl": "string (opcional)",
  "videoUrl": "string (opcional)",
  "adminId": 1
}
```

**Respuesta Exitosa (201 Created):** Paso creado

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 403 | No es el autor de la lección |
| 404 | Lección no encontrada |

---

### Actualizar Paso

**Endpoint:** `PUT /api/lessons/{lessonId}/steps/{stepId}`

**Descripción:** Actualizar un paso.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
lessonId: Long (id de la lección)
stepId: Long (id del paso)
```

**Request Body:**
```json
{
  "title": "string (requerido)",
  "content": "string (requerido)",
  "stepOrder": 1,
  "imageUrl": "string (opcional)",
  "videoUrl": "string (opcional)",
  "adminId": 1
}
```

**Respuesta Exitosa (200 OK):** Paso actualizado

---

### Eliminar Paso

**Endpoint:** `DELETE /api/lessons/{lessonId}/steps/{stepId}`

**Descripción:** Eliminar un paso.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
lessonId: Long (id de la lección)
stepId: Long (id del paso)
```

**Query Parameters:**
```
adminId: Long (id del admin)
```

**Respuesta Exitosa (204 No Content):** Sin cuerpo

---

## Categorías

### Obtener Todas las Categorías

**Endpoint:** `GET /api/categories`

**Descripción:** Obtener todas las categorías.

**Autorización:** Público

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Redes Sociales",
      "description": "Aprende a usar redes sociales",
      "createdAt": "2025-12-15T10:30:00",
      "updatedAt": "2025-12-15T10:30:00"
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### Obtener Categoría por ID

**Endpoint:** `GET /api/categories/{id}`

**Descripción:** Obtener una categoría específica.

**Autorización:** Público

**Path Parameters:**
```
id: Long (id de la categoría)
```

**Respuesta Exitosa (200 OK):** Categoría individual

---

### Crear Categoría

**Endpoint:** `POST /api/categories`

**Descripción:** Crear una nueva categoría (solo ADMIN).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Request Body:**
```json
{
  "name": "string (único, requerido)",
  "description": "string (opcional)"
}
```

**Respuesta Exitosa (201 Created):** Categoría creada

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 409 | Nombre de categoría duplicado |

---

### Actualizar Categoría

**Endpoint:** `PUT /api/categories/{id}`

**Descripción:** Actualizar una categoría.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la categoría)
```

**Request Body:**
```json
{
  "name": "string (requerido)",
  "description": "string (opcional)"
}
```

**Respuesta Exitosa (200 OK):** Categoría actualizada

---

### Eliminar Categoría

**Endpoint:** `DELETE /api/categories/{id}`

**Descripción:** Eliminar una categoría (solo si no tiene lecciones).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la categoría)
```

**Respuesta Exitosa (204 No Content):** Sin cuerpo

---

## Simuladores

### Obtener Todos los Simuladores

**Endpoint:** `GET /api/simulators`

**Descripción:** Obtener todos los simuladores.

**Autorización:** Público

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Simulador de WhatsApp",
      "description": "Practica enviando mensajes",
      "feedback": "Excelente, lo hiciste bien",
      "isActive": true,
      "createdAt": "2025-12-15T10:30:00",
      "updatedAt": "2025-12-15T10:30:00"
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### Obtener Simulador por ID

**Endpoint:** `GET /api/simulators/{id}`

**Descripción:** Obtener un simulador específico.

**Autorización:** Público

**Path Parameters:**
```
id: Long (id del simulador)
```

**Respuesta Exitosa (200 OK):** Simulador individual

---

### Crear Simulador

**Endpoint:** `POST /api/simulators`

**Descripción:** Crear un nuevo simulador (solo ADMIN).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Request Body:**
```json
{
  "title": "string (requerido)",
  "description": "string (requerido)",
  "feedback": "string (requerido)",
  "isActive": true,
  "adminId": 1
}
```

**Respuesta Exitosa (201 Created):** Simulador creado

---

### Actualizar Simulador

**Endpoint:** `PUT /api/simulators/{id}`

**Descripción:** Actualizar un simulador (solo autor).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id del simulador)
```

**Request Body:**
```json
{
  "title": "string (requerido)",
  "description": "string (requerido)",
  "feedback": "string (requerido)",
  "isActive": true,
  "adminId": 1
}
```

**Respuesta Exitosa (200 OK):** Simulador actualizado

---

### Eliminar Simulador

**Endpoint:** `DELETE /api/simulators/{id}`

**Descripción:** Eliminar un simulador (solo autor).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id del simulador)
```

**Query Parameters:**
```
adminId: Long (id del admin)
```

**Respuesta Exitosa (204 No Content):** Sin cuerpo

---

## Progreso y Favoritos

Todos los endpoints en esta sección requieren autenticación (Bearer Token).

### Obtener Progreso

**Endpoint:** `GET /api/progress`

**Descripción:** Obtener estadísticas de progreso global del usuario.

**Autorización:** Requerido (Bearer Token)

**Respuesta Exitosa (200 OK):**
```json
{
  "userId": 1,
  "completedLessons": 5,
  "favoriteLessons": 2,
  "globalProgress": "25.00%",
  "totalPublishedLessons": 20
}
```

---

### Marcar Lección como Completada

**Endpoint:** `POST /api/progress/{lessonId}/mark-complete`

**Descripción:** Marcar una lección como completada.

**Autorización:** Requerido (Bearer Token)

**Path Parameters:**
```
lessonId: Long (id de la lección)
```

**Respuesta Exitosa (200 OK):** Progreso actualizado

**Respuestas de Error:**

| Código | Descripción |
|--------|-------------|
| 404 | Lección no encontrada |

---

### Guardar como Favorita

**Endpoint:** `POST /api/progress/{lessonId}/favorite`

**Descripción:** Guardar una lección como favorita.

**Autorización:** Requerido (Bearer Token)

**Path Parameters:**
```
lessonId: Long (id de la lección)
```

**Respuesta Exitosa (200 OK):** Lección añadida a favoritos

---

### Eliminar de Favoritos

**Endpoint:** `DELETE /api/progress/{lessonId}/favorite`

**Descripción:** Eliminar una lección de favoritos.

**Autorización:** Requerido (Bearer Token)

**Path Parameters:**
```
lessonId: Long (id de la lección)
```

**Respuesta Exitosa (204 No Content):** Sin cuerpo

---

### Progreso por Categoría

**Endpoint:** `GET /api/progress/category/{categoryId}`

**Descripción:** Obtener el progreso en una categoría específica.

**Autorización:** Requerido (Bearer Token)

**Path Parameters:**
```
categoryId: Long (id de la categoría)
```

**Respuesta Exitosa (200 OK):**
```json
{
  "categoryId": 1,
  "categoryName": "Redes Sociales",
  "completedLessons": 3,
  "totalLessons": 10,
  "progressPercentage": "30.00%"
}
```

---

### Historial de Interacciones con Simuladores

**Endpoint:** `GET /api/progress/simulator-interactions`

**Descripción:** Obtener el historial de interacciones del usuario con simuladores.

**Autorización:** Requerido (Bearer Token)

**Respuesta Exitosa (200 OK):**
```json
{
  "content": [
    {
      "simulatorId": 1,
      "simulatorTitle": "Simulador de WhatsApp",
      "accessCount": 5,
      "lastAccessedAt": "2025-12-15T14:30:00"
    }
  ],
  "totalElements": 3
}
```

---

## FAQ

### Obtener Todas las FAQ

**Endpoint:** `GET /api/faq`

**Descripción:** Obtener todas las preguntas frecuentes.

**Autorización:** Público

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "question": "¿Cómo cambio mi contraseña?",
      "answer": "Ve a tu perfil y selecciona Cambiar contraseña",
      "topic": "Seguridad",
      "isActive": true,
      "createdAt": "2025-12-15T10:30:00",
      "updatedAt": "2025-12-15T10:30:00"
    }
  ],
  "totalElements": 15,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### Buscar en FAQ

**Endpoint:** `GET /api/faq/search`

**Descripción:** Buscar preguntas frecuentes por palabra clave.

**Autorización:** Público

**Query Parameters:**
```
text=string (palabra clave, requerido)
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):** Mismo formato que listar FAQ

---

### Crear FAQ

**Endpoint:** `POST /api/faq`

**Descripción:** Crear una nueva pregunta frecuente (solo ADMIN).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Request Body:**
```json
{
  "question": "string (requerido)",
  "answer": "string (requerido)",
  "topic": "string (requerido)",
  "adminId": 1
}
```

**Respuesta Exitosa (201 Created):** FAQ creada

---

### Actualizar FAQ

**Endpoint:** `PUT /api/faq/{id}`

**Descripción:** Actualizar una FAQ (solo autor).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la FAQ)
```

**Request Body:**
```json
{
  "question": "string (requerido)",
  "answer": "string (requerido)",
  "topic": "string (requerido)",
  "adminId": 1
}
```

**Respuesta Exitosa (200 OK):** FAQ actualizada

---

### Eliminar FAQ

**Endpoint:** `DELETE /api/faq/{id}`

**Descripción:** Eliminar una FAQ (solo autor).

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id de la FAQ)
```

**Query Parameters:**
```
adminId: Long (id del admin)
```

**Respuesta Exitosa (204 No Content):** Sin cuerpo

---

## Administración

Todos los endpoints en esta sección requieren rol ADMIN.

### Listar Usuarios

**Endpoint:** `GET /api/admin/users`

**Descripción:** Listar todos los usuarios registrados.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "username": "usuario1",
      "email": "usuario1@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2025-12-15T10:30:00",
      "updatedAt": "2025-12-15T10:30:00"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0
}
```

---

### Obtener Usuario

**Endpoint:** `GET /api/admin/users/{id}`

**Descripción:** Obtener detalles de un usuario específico.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
id: Long (id del usuario)
```

**Respuesta Exitosa (200 OK):** Usuario individual

---

### Ver Logs de Auditoría

**Endpoint:** `GET /api/admin/audit-logs`

**Descripción:** Obtener logs de auditoría de cambios en la plataforma.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "userId": 1,
      "action": "CREATE",
      "entityType": "LESSON",
      "entityId": 5,
      "previousValue": null,
      "newValue": "{\"title\": \"Nueva lección\"}",
      "timestamp": "2025-12-15T10:30:00",
      "ipAddress": "192.168.1.1"
    }
  ],
  "totalElements": 500,
  "totalPages": 25,
  "currentPage": 0
}
```

---

### Filtrar Logs por Tipo de Entidad

**Endpoint:** `GET /api/admin/audit-logs/entity/{entityType}`

**Descripción:** Filtrar logs de auditoría por tipo de entidad.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
entityType: String (LESSON, SIMULATOR, FAQ, USER, CATEGORY, STEP)
```

**Query Parameters:**
```
page=0 (opcional)
size=20 (opcional)
```

**Respuesta Exitosa (200 OK):** Logs filtrados

---

### Filtrar Logs por Usuario

**Endpoint:** `GET /api/admin/audit-logs/user/{userId}`

**Descripción:** Obtener logs de un usuario específico.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
userId: Long (id del usuario)
```

**Respuesta Exitosa (200 OK):** Logs del usuario

---

### Filtrar Logs por Acción

**Endpoint:** `GET /api/admin/audit-logs/action/{action}`

**Descripción:** Filtrar logs por acción realizada.

**Autorización:** Requerido (Bearer Token, rol ADMIN)

**Path Parameters:**
```
action: String (CREATE, UPDATE, DELETE, DISABLE_ACCOUNT)
```

**Respuesta Exitosa (200 OK):** Logs filtrados

---

## Códigos HTTP

### Respuestas Exitosas

| Código | Descripción | Uso |
|--------|-------------|-----|
| 200 | OK | GET, PUT, POST (operaciones que retornan datos) |
| 201 | Created | POST (creación de nuevo recurso) |
| 204 | No Content | DELETE (eliminación exitosa) |

### Respuestas de Error

| Código | Descripción | Solución |
|--------|-------------|----------|
| 400 | Bad Request | Revisa los parámetros enviados, campos obligatorios |
| 401 | Unauthorized | Token no proporcionado, inválido o expirado |
| 403 | Forbidden | No tienes permisos para esta acción |
| 404 | Not Found | El recurso solicitado no existe |
| 409 | Conflict | El recurso ya existe (duplicado) |
| 422 | Unprocessable Entity | La validación de negocio falló |
| 500 | Internal Server Error | Error del servidor (contactar soporte) |

---

## Modelos de Respuesta

### ErrorResponse

```json
{
  "code": "string (código de error único)",
  "message": "string (descripción del error)",
  "timestamp": "string (timestamp del error)",
  "path": "string (endpoint que causó el error)"
}
```

### PaginatedResponse

```json
{
  "content": "array (lista de elementos)",
  "totalElements": "number (total de elementos)",
  "totalPages": "number (total de páginas)",
  "currentPage": "number (página actual)",
  "pageSize": "number (tamaño de la página)"
}
```

### AuthResponse

```json
{
  "token": "string (JWT token)",
  "tokenType": "Bearer",
  "user": "UserResponse (datos del usuario)",
  "message": "string (mensaje descriptivo)"
}
```

---

## Autenticación y Headers

### Header de Autorización

Todos los endpoints protegidos requieren el siguiente header:

```
Authorization: Bearer <jwt_token>
```

Donde `<jwt_token>` es el token obtenido en el login.

### Headers Comunes

| Header | Valor | Requerido |
|--------|-------|-----------|
| Authorization | Bearer <token> | En endpoints protegidos |
| Content-Type | application/json | En POST/PUT |
| Accept | application/json | Recomendado |

---

## Tasas de Límite

Actualmente no hay implementado rate limiting, pero se recomienda:
- Máximo 100 requests por minuto por usuario
- Máximo 1000 requests por minuto por IP

---

## CORS

La API está configurada para aceptar requests desde:
- http://localhost:4200 (Angular local)
- http://localhost:3000 (Alternativa)

Para configurar CORS adicionales, edita `src/main/java/config/SecurityConfig.java`

---

## Ejemplos de Flujo Completo

### Flujo de Registro y Login

```
1. POST /api/auth/register
   → Registrar usuario
   ← Token JWT + datos de usuario

2. POST /api/auth/login
   → Iniciar sesión con credenciales
   ← Token JWT + datos de usuario

3. GET /api/auth/me
   → Con header Authorization: Bearer <token>
   ← Datos del usuario autenticado
```

### Flujo de Crear y Publicar Lección (ADMIN)

```
1. POST /api/auth/login
   → Login como ADMIN
   ← Token JWT

2. POST /api/lessons
   → Crear lección
   ← ID de lección creada

3. POST /api/lessons/{lessonId}/steps
   → Crear paso 1
   ← Paso creado

4. POST /api/lessons/{lessonId}/steps
   → Crear paso 2
   ← Paso creado

5. POST /api/lessons/{lessonId}/publish
   → Publicar lección (requiere ≥1 paso)
   ← Lección publicada
```

---

**Última actualización**: Diciembre 2025

