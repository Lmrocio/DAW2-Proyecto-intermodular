# Matriz de Códigos HTTP por Endpoint

## Introducción

Este documento especifica qué códigos HTTP devuelve cada endpoint de la API, incluyendo casos de éxito y error.

---

## Autenticación

### POST /api/auth/register

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **201** | Created | Usuario registrado exitosamente |
| **400** | Bad Request | Validación fallida (email inválido, contraseñas no coinciden, campos incompletos) |
| **409** | Conflict | Username o email ya existen |

---

### POST /api/auth/login

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Login exitoso, token generado |
| **400** | Bad Request | Username o password no proporcionados |
| **401** | Unauthorized | Credenciales inválidas (usuario no existe o contraseña incorrecta) |
| **401** | Unauthorized | Usuario inactivo (desactivado por admin) |

---

### GET /api/auth/me

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Usuario autenticado retornado |
| **401** | Unauthorized | Token no proporcionado |
| **401** | Unauthorized | Token inválido o expirado |
| **401** | Unauthorized | Token está en blacklist (logout previo) |

---

### POST /api/auth/logout

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Logout exitoso, token invalidado |
| **400** | Bad Request | Token no proporcionado en header |
| **401** | Unauthorized | Token inválido o expirado |

---

## Lecciones

### GET /api/lessons

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lecciones listadas exitosamente |
| **400** | Bad Request | Parámetro de paginación inválido (page/size negativo) |

---

### GET /api/lessons/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lección encontrada y retornada |
| **404** | Not Found | Lección no existe |

---

### GET /api/lessons/search

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Búsqueda completada (puede retornar 0 resultados) |
| **400** | Bad Request | Parámetro "text" no proporcionado |

---

### GET /api/lessons/category/{categoryId}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lecciones de la categoría listadas |
| **404** | Not Found | Categoría no existe |

---

### GET /api/lessons/trending

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lecciones trending listadas |

---

### GET /api/lessons/with-simulator

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lecciones con simulador listadas |

---

### POST /api/lessons

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **201** | Created | Lección creada exitosamente |
| **400** | Bad Request | Validación fallida (título/descripción incompletos, categoryId inválido) |
| **401** | Unauthorized | Token no proporcionado o inválido |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **404** | Not Found | Categoría no existe |
| **409** | Conflict | Título de lección ya existe |

---

### PUT /api/lessons/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lección actualizada exitosamente |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado o inválido |
| **403** | Forbidden | Usuario no es el autor de la lección |
| **404** | Not Found | Lección no existe |
| **409** | Conflict | Nuevo título duplica otra lección |

---

### POST /api/lessons/{id}/publish

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lección publicada exitosamente |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | Lección no existe |
| **422** | Unprocessable Entity | Lección sin pasos (validación de negocio) |

**Código de Error 422:**
```json
{
  "code": "NO_STEPS_IN_LESSON",
  "message": "No se puede publicar una lección sin pasos. La lección debe tener al menos 1 paso.",
  "httpStatus": 422,
  "failedValue": 5
}
```

---

### POST /api/lessons/{id}/unpublish

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lección despublicada exitosamente |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | Lección no existe |

---

### DELETE /api/lessons/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **204** | No Content | Lección eliminada exitosamente (sin cuerpo de respuesta) |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | Lección no existe |

---

## Pasos

### GET /api/lessons/{lessonId}/steps

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Pasos listados |
| **404** | Not Found | Lección no existe |

---

### POST /api/lessons/{lessonId}/steps

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **201** | Created | Paso creado exitosamente |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor de la lección |
| **404** | Not Found | Lección no existe |

---

### PUT /api/lessons/{lessonId}/steps/{stepId}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Paso actualizado exitosamente |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | Paso o lección no existen |

---

### DELETE /api/lessons/{lessonId}/steps/{stepId}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **204** | No Content | Paso eliminado exitosamente |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | Paso o lección no existen |

---

## Categorías

### GET /api/categories

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Categorías listadas |

---

### GET /api/categories/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Categoría encontrada |
| **404** | Not Found | Categoría no existe |

---

### POST /api/categories

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **201** | Created | Categoría creada exitosamente |
| **400** | Bad Request | Validación fallida (nombre incompleto) |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **409** | Conflict | Nombre de categoría ya existe |

---

### PUT /api/categories/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Categoría actualizada |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **404** | Not Found | Categoría no existe |
| **409** | Conflict | Nombre duplicado |

---

### DELETE /api/categories/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **204** | No Content | Categoría eliminada |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **404** | Not Found | Categoría no existe |
| **422** | Unprocessable Entity | Categoría tiene lecciones asociadas |

---

## Simuladores

### GET /api/simulators

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Simuladores listados |

---

### GET /api/simulators/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Simulador encontrado |
| **404** | Not Found | Simulador no existe |

---

### POST /api/simulators

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **201** | Created | Simulador creado exitosamente |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **409** | Conflict | Título duplicado |

---

### PUT /api/simulators/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Simulador actualizado |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | Simulador no existe |
| **409** | Conflict | Título duplicado |

---

### DELETE /api/simulators/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **204** | No Content | Simulador eliminado |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | Simulador no existe |

---

## Progreso y Favoritos

### GET /api/progress

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Progreso retornado |
| **401** | Unauthorized | Token no proporcionado |

---

### POST /api/progress/{lessonId}/mark-complete

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lección marcada como completada |
| **401** | Unauthorized | Token no proporcionado |
| **404** | Not Found | Lección no existe |
| **422** | Unprocessable Entity | Lección no está publicada |

---

### POST /api/progress/{lessonId}/favorite

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Lección añadida a favoritos |
| **401** | Unauthorized | Token no proporcionado |
| **404** | Not Found | Lección no existe |

---

### DELETE /api/progress/{lessonId}/favorite

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **204** | No Content | Lección eliminada de favoritos |
| **401** | Unauthorized | Token no proporcionado |
| **404** | Not Found | Lección no existe |

---

### GET /api/progress/category/{categoryId}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Progreso por categoría retornado |
| **401** | Unauthorized | Token no proporcionado |
| **404** | Not Found | Categoría no existe |

---

### GET /api/progress/simulator-interactions

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Historial de interacciones retornado |
| **401** | Unauthorized | Token no proporcionado |

---

## FAQ

### GET /api/faq

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | FAQs listadas |

---

### GET /api/faq/search

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Búsqueda completada |
| **400** | Bad Request | Parámetro "text" no proporcionado |

---

### POST /api/faq

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **201** | Created | FAQ creada |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |

---

### PUT /api/faq/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | FAQ actualizada |
| **400** | Bad Request | Validación fallida |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | FAQ no existe |

---

### DELETE /api/faq/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **204** | No Content | FAQ eliminada |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no es el autor |
| **404** | Not Found | FAQ no existe |

---

## Administración

### GET /api/admin/users

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Usuarios listados |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |

---

### GET /api/admin/users/{id}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Usuario encontrado |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **404** | Not Found | Usuario no existe |

---

### GET /api/admin/audit-logs

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Logs listados |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |

---

### GET /api/admin/audit-logs/entity/{entityType}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Logs filtrados |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **400** | Bad Request | entityType inválido |

---

### GET /api/admin/audit-logs/user/{userId}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Logs del usuario listados |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **404** | Not Found | Usuario no existe |

---

### GET /api/admin/audit-logs/action/{action}

| Código | Descripción | Condición |
|--------|-------------|-----------|
| **200** | OK | Logs filtrados por acción |
| **401** | Unauthorized | Token no proporcionado |
| **403** | Forbidden | Usuario no tiene rol ADMIN |
| **400** | Bad Request | action inválida |

---

## Resumen de Códigos HTTP

| Código | Descripción | Significado |
|--------|-------------|-------------|
| **200** | OK | Operación exitosa, retorna datos |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Operación exitosa, sin cuerpo de respuesta (típicamente DELETE) |
| **400** | Bad Request | Validación fallida o parámetro inválido |
| **401** | Unauthorized | Token no válido, expirado o no autenticado |
| **403** | Forbidden | Autenticado pero sin permisos para la acción |
| **404** | Not Found | Recurso no existe |
| **409** | Conflict | Recurso duplicado (violación de unicidad) |
| **422** | Unprocessable Entity | Validación de negocio fallida (datos válidos pero inconsistentes) |
| **500** | Internal Server Error | Error no manejado en el servidor |

---

## Diferencia entre 403 y 422

- **403 Forbidden**: Usuario autenticado pero sin permisos/autorización
  - Ejemplo: USER intenta editar lección de otro ADMIN
  - Ejemplo: USER intenta acceder a endpoint solo ADMIN

- **422 Unprocessable Entity**: Validación de negocio fallida
  - Ejemplo: Intentar publicar lección sin pasos
  - Ejemplo: Intentar eliminar categoría que tiene lecciones
  - Los datos son válidos pero violan reglas de negocio

---

## Diferencia entre 400 y 422

- **400 Bad Request**: Validación de entrada fallida
  - Ejemplo: Email inválido
  - Ejemplo: Campo obligatorio faltante
  - Ejemplo: Tipo de dato incorrecto

- **422 Unprocessable Entity**: Validación de negocio fallida
  - Ejemplo: Lección sin pasos (sintácticamente válido pero lógicamente inválido)
  - Ejemplo: Título duplicado
  - Ejemplo: Valores inconsistentes

---

**Última actualización**: Diciembre 2025

