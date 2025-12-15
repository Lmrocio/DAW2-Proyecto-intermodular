# Colección de Postman - Plataforma Educativa API REST

## Descripción

Esta colección contiene todos los endpoints de la API REST de la Plataforma Educativa de Tecnología para Adultos Mayores. Permite probar y documentar todas las funcionalidades del backend sin necesidad de usar código.

---

## Instalación

### Opción 1: Importar desde archivo JSON

1. Abre Postman
2. Haz clic en **File** → **Import**
3. Selecciona el archivo `Postman_Coleccion.json`
4. La colección se importará automáticamente con todos los endpoints y variables

### Opción 2: Importar desde repositorio

1. Copia el enlace del archivo JSON en el repositorio
2. En Postman: **File** → **Import from Link**
3. Pega la URL y confirma

---

## Configuración de Variables

La colección utiliza dos variables principales que deben configurarse:

### 1. `jwt_token`

- **Descripción**: Token JWT para autenticación
- **Valor inicial**: `tu_token_jwt_aqui`
- **Cómo obtener**: 
  - Realiza un login exitoso en el endpoint `/api/auth/login`
  - Copia el token de la respuesta
  - Actualiza la variable en Postman (arriba a la derecha, "Variables")

### 2. `base_url`

- **Descripción**: URL base del servidor
- **Valor por defecto**: `http://localhost:8080`
- **Cambiar si es necesario**: Si tu servidor está en otro puerto o máquina

---

## Estructura de la Colección

La colección está organizada en 9 carpetas principales:

### 1. Autenticación (4 endpoints)

- **Registro de Usuario** (POST)
  - Crear cuenta nueva
  - Requiere: username, email, password, confirmPassword
  - Respuesta: token JWT + datos del usuario

- **Login** (POST)
  - Iniciar sesión
  - Requiere: username, password
  - Respuesta: token JWT + datos del usuario

- **Obtener Usuario Autenticado** (GET)
  - Obtener datos del usuario actual
  - Requiere: JWT token en header
  - Respuesta: datos del usuario sin contraseña

- **Logout** (POST)
  - Cerrar sesión
  - Requiere: JWT token en header
  - Efecto: invalida el token en blacklist

### 2. Lecciones (11 endpoints)

**Públicos (sin autenticación):**
- Obtener todas las lecciones (con paginación)
- Obtener lección por ID
- Buscar lecciones por texto
- Filtrar por categoría
- Obtener trending (más accedidas)
- Obtener lecciones con simulador

**Administrativos (requieren ADMIN):**
- Crear lección nueva
- Actualizar lección (solo autor)
- Publicar lección
- Despublicar lección
- Eliminar lección (con eliminación en cascada)

### 3. Pasos de Lecciones (4 endpoints)

**Públicos:**
- Obtener pasos de una lección

**Administrativos:**
- Crear paso nuevo
- Actualizar paso
- Eliminar paso

### 4. Categorías (5 endpoints)

**Públicos:**
- Obtener todas las categorías
- Obtener categoría por ID

**Administrativos:**
- Crear categoría
- Actualizar categoría
- Eliminar categoría

### 5. Simuladores (5 endpoints)

**Públicos:**
- Obtener todos los simuladores
- Obtener simulador por ID

**Administrativos:**
- Crear simulador
- Actualizar simulador
- Eliminar simulador

### 6. Progreso y Favoritos (6 endpoints - requieren autenticación)

- Obtener estadísticas de progreso
- Marcar lección como completada
- Guardar lección como favorita
- Eliminar de favoritos
- Progreso por categoría
- Historial de interacciones con simuladores

### 7. FAQ (5 endpoints)

**Públicos:**
- Obtener todas las FAQ
- Buscar en FAQ

**Administrativos:**
- Crear FAQ
- Actualizar FAQ
- Eliminar FAQ

### 8. Administración (4 endpoints - requieren ADMIN)

- Listar usuarios
- Obtener usuario específico
- Ver logs de auditoría
- Filtrar logs por tipo de entidad

---

## Guía de Uso

### Paso 1: Registrarse

1. Ve a **Autenticación** → **Registro de Usuario**
2. Completa los datos:
   ```json
   {
     "username": "mi_usuario",
     "email": "correo@example.com",
     "password": "micontraseña123",
     "confirmPassword": "micontraseña123"
   }
   ```
3. Haz clic en **Send**
4. Copia el `token` de la respuesta

### Paso 2: Guardar el Token

1. En la pestaña **Variables** (arriba a la derecha)
2. Busca `jwt_token`
3. Reemplaza `tu_token_jwt_aqui` con el token copiado
4. Haz clic en **Save**

### Paso 3: Probar Endpoints Protegidos

- Ahora puedes acceder a endpoints que requieren autenticación
- El token se enviará automáticamente en el header `Authorization: Bearer {{jwt_token}}`

---

## Códigos HTTP Esperados

| Método | Código | Descripción |
|--------|--------|-------------|
| GET | 200 | OK - Operación exitosa |
| POST | 201 | Created - Recurso creado |
| PUT | 200 | OK - Recurso actualizado |
| DELETE | 204 | No Content - Eliminado correctamente |
| 400 | Bad Request - Validación fallida |
| 401 | Unauthorized - Token inválido o no proporcionado |
| 403 | Forbidden - No tiene permisos para esta acción |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Recurso duplicado |

---

## Ejemplos de Flujo Completo

### Crear y Publicar una Lección

1. **Registrarse** → Obtener token
2. **Crear Lección** (POST /api/lessons)
   - Proporcionar título, descripción, categoría
3. **Crear Pasos** (POST /api/lessons/{id}/steps)
   - Añadir al menos 1 paso
4. **Publicar** (POST /api/lessons/{id}/publish)
   - Ahora será visible para usuarios

### Seguimiento de Progreso

1. **Login** → Obtener token
2. **Obtener Progreso** (GET /api/progress)
   - Ver progreso global
3. **Marcar Completada** (POST /api/progress/{lessonId}/mark-complete)
   - Registrar lección completada
4. **Guardar como Favorita** (POST /api/progress/{lessonId}/favorite)
   - Marcar como favorita

### Administración

1. **Login como ADMIN** → Obtener token admin
2. **Listar Usuarios** (GET /api/admin/users)
   - Ver todos los registrados
3. **Ver Logs** (GET /api/admin/audit-logs)
   - Revisar historial de cambios
4. **Filtrar Logs** (GET /api/admin/audit-logs/entity/LESSON)
   - Ver solo cambios en lecciones

---

## Troubleshooting

### Error 401 Unauthorized

**Causa**: Token inválido o expirado
**Solución**: 
- Haz login nuevamente
- Copia el nuevo token
- Actualiza la variable `jwt_token`

### Error 403 Forbidden

**Causa**: No tienes permisos para esta acción
**Solución**: 
- Algunos endpoints requieren rol ADMIN
- Si eres USER, no puedes crear/editar contenido

### Error 404 Not Found

**Causa**: El recurso no existe
**Solución**: 
- Verifica que el ID sea correcto
- Usa primero un GET para obtener IDs válidos

### Error 400 Bad Request

**Causa**: Los datos enviados no son válidos
**Solución**: 
- Revisa los campos requeridos en el body
- Verifica los tipos de datos (string, number, boolean)

---

## Variables y Entornos

Para trabajar con múltiples entornos (desarrollo, testing, producción):

1. Crea un nuevo **Environment** en Postman
2. Define variables para cada entorno:
   - `base_url`: http://localhost:8080 (desarrollo)
   - `base_url`: http://testing.example.com (testing)
   - `base_url`: https://api.example.com (producción)
3. Selecciona el entorno antes de ejecutar requests

---

## Recursos Adicionales

- **Documentación API completa**: Ver README.md del DWES
- **Modelo de Datos**: MODELO_DATOS.md
- **Guía de Instalación**: README.md del backend
- **Análisis de Cumplimiento**: ANALISIS_CUMPLIMIENTO_DWES.md

---

## Notas Importantes

- Los IDs de ejemplo (1, 2, 3) deben reemplazarse con IDs reales de tu base de datos
- El token JWT expira en 24 horas
- Para logout, necesitas el token vigente
- La blacklist de tokens se limpia automáticamente cuando los tokens expiran
- CORS está configurado para localhost:4200 (Angular) y localhost:3000

---

**Última actualización**: Diciembre 2025

