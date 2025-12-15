# Plataforma Educativa de Tecnología para Adultos Mayores - Backend

## Descripción del Proyecto

Esta aplicación es una plataforma interactiva y educativa diseñada específicamente para adultos mayores (entre 65 y 80 años) que deseen aprender a manejar las tecnologías más comunes en su vida cotidiana. El proyecto aborda la brecha digital mediante una propuesta pedagógica centrada en el usuario, con especial enfoque en dispositivos móviles y aplicaciones de uso frecuente.

El backend proporciona una API REST robusta que soporta todas las funcionalidades necesarias para gestionar lecciones, simuladores interactivos, perfiles de usuario e historial de aprendizaje, garantizando una experiencia segura, intuitiva y accesible.

---

## Alcance del Proyecto

La plataforma cubre las siguientes áreas funcionales:

- **Gestión de Lecciones**: Tutoriales estructurados en pasos que representan una curva de aprendizaje progresiva.
- **Simuladores Interactivos**: Entornos seguros para practicar situaciones comunes del día a día con feedback inmediato.
- **Autenticación y Perfiles**: Sistema de login para guardar favoritos, historial y preferencias de accesibilidad.
- **Historial y Favoritos**: Seguimiento del progreso del usuario autenticado con capacidad de guardar y revisar lecciones.
- **Modo Guiado**: Tutorial integrado para facilitar la navegación de primeros usuarios.
- **Sistema de Ayuda**: Preguntas frecuentes y documentación de la plataforma.
- **Gestión de Contenido**: Panel administrativo para crear, editar y eliminar lecciones y simuladores.

### Funcionalidades Excluidas del MVP

- Talleres online con voluntarios externos
- Chatbot de soporte avanzado
- Expansiones temáticas futuras
- Sistema de versiones de lecciones
- Reportes de errores en lecciones

---

## Conceptos Clave

Antes de profundizar en los requisitos, es importante entender la estructura conceptual de la plataforma:

### Lección

Una **lección** es un tutorial completo y estructurado sobre un tema específico, diseñado para enseñar cómo usar una tecnología.

- Está dividida en **pasos secuenciales** que presentan el contenido de forma gradual
- Cada paso contiene texto, imágenes o videos
- Representa una **curva de aprendizaje progresiva**
- Está asociada a una **categoría** para facilitar búsqueda y organización
- Opcionalmente puede vincularse con un **simulador** para práctica
- Ejemplos: "Cómo enviar un mensaje de WhatsApp", "Cómo hacer una videollamada", "Cómo buscar en Google"

### Paso

Un **paso** es una unidad de contenido individual dentro de una lección.

- Forma parte de una lección específica con un orden secuencial
- Contiene un único concepto o acción a aprender
- Incluye contenido (texto + imagen/video opcional)
- Es mostrado uno a uno al usuario de forma progresiva
- Ejemplo dentro de "Cómo enviar un mensaje de WhatsApp": Paso 1: "Abre WhatsApp", Paso 2: "Busca el contacto", Paso 3: "Escribe tu mensaje", etc.

### Categoría

Una **categoría** es una agrupación temática de lecciones que ayuda a organizar y filtrar el contenido.

- Agrupa lecciones por temática relacionada
- Permite que usuarios naveguen por áreas de interés
- Facilita la medición del progreso por área temática
- Ejemplos: "Redes Sociales", "Mensajería", "Búsqueda en Internet", "Compras Online", "Videollamadas", "Seguridad Digital"

### Simulador

Un **simulador** es un entorno interactivo y seguro donde el usuario practica situaciones reales sin riesgo.

- Es una demostración interactiva de situaciones comunes del día a día
- Proporciona feedback inmediato después de cada acción
- Permite practicar sin consecuencias reales
- Puede estar vinculado opcionalmente a una lección (usuario aprende primero, luego practica)
- Puede usarse de forma independiente
- Ejemplos: simulador de envío de mensajes, simulador de búsqueda en Google, simulador de videollamada

---

## Sistema de Roles y Permisos

La plataforma implementa un sistema de control de acceso basado en dos roles: Usuario y Administrador.

### Usuario (No Autenticado)

**Acceso de Lectura:**
- Ver todas las lecciones disponibles
- Acceder al contenido completo de las lecciones (texto, imágenes, videos)
- Usar simuladores interactivos
- Buscar lecciones por palabra clave o tema
- Consultar preguntas frecuentes (FAQ)

**Limitaciones:**
- No puede guardar lecciones como favoritas
- No puede crear historial de lecciones completadas
- No puede acceder a funcionalidades de perfil
- No puede crear, editar ni eliminar contenido

### Usuario (Autenticado)

**Todo lo permitido para usuarios no autenticados, más:**

**Funcionalidades de Perfil:**
- Guardar lecciones como favoritas
- Marcar lecciones como completadas en su historial personal
- Acceder al historial de lecciones vistas
- Actualizar información personal (nombre, email, contraseña)
- Configurar preferencias de accesibilidad (tamaño de texto, contraste)
- Ver estadísticas de progreso personal

**Limitaciones:**
- No puede crear, editar ni eliminar lecciones
- No puede crear, editar ni eliminar simuladores
- No puede gestionar FAQ
- No puede ver información de otros usuarios
- No puede acceder al panel de administración

### Administrador

**Todo lo permitido para usuarios autenticados, más:**

**Gestión de Lecciones:**
- Crear nuevas lecciones
- Editar únicamente lecciones que él mismo ha creado
- Eliminar sus propias lecciones
- Asociar simuladores a sus lecciones
- Cargar y gestionar archivos multimedia

**Gestión de Simuladores:**
- Crear nuevos simuladores interactivos
- Editar únicamente simuladores que él mismo ha creado
- Eliminar sus propios simuladores
- Vincular simuladores con lecciones
- Modificar feedback de simuladores

**Gestión de FAQ:**
- Crear nuevas preguntas frecuentes
- Editar preguntas y respuestas que ha creado
- Eliminar sus propias FAQ
- Organizar FAQ por categorías

**Gestión de Usuarios:**
- Ver lista de usuarios registrados
- Ver perfiles de usuarios
- Ver estadísticas de actividad de usuarios (lecciones completadas, favoritos)
- Desactivar cuentas de usuario si es necesario

**Auditoría:**
- Acceso a logs de cambios (quién creó/editó qué contenido y cuándo)

**Limitaciones:**
- No puede editar contenido creado por otros administradores
- No puede cambiar el rol de otros usuarios
- No puede eliminar cuentas de usuario permanentemente

### Comportamiento en Caso de Eliminación de Contenido

**Si un administrador elimina una lección:**
- Se elimina la lección del catálogo disponible para todos los usuarios
- Los favoritos que hace referencia a esa lección se eliminan automáticamente
- El historial personal de usuarios que completaron esa lección se mantiene intacto (para preservar su progreso histórico)

**Si un administrador elimina un simulador:**
- El simulador desaparece de la plataforma
- Se rompe la asociación con las lecciones que lo referenciaban

---

## Requisitos Funcionales

### Autenticación y Autorización

- Sistema de registro e inicio de sesión
- Gestión de roles de usuario (Usuario, Administrador)
- Protección de endpoints sensibles mediante tokens JWT
- Control de acceso basado en roles para funcionalidades de perfil y administración
- Validación de propiedad de contenido (solo admins pueden editar su propio contenido)

### Gestión de Lecciones

**Usuarios (no autenticados):**
- Leer todas las lecciones disponibles
- Buscar y filtrar lecciones por categoría o palabra clave
- Acceder a contenido de pasos (texto, imágenes, videos)
- Ver pasos de forma secuencial

**Usuarios (autenticados):**
- Todas las funcionalidades anteriores, más:
- Guardar lecciones como favoritas
- Marcar lecciones como completadas ("Lección aprendida")
- Acceder a su historial personal de lecciones completadas
- Ver progreso por categoría

**Administradores:**
- Todas las funcionalidades anteriores, más:
- Crear nuevas lecciones con pasos
- Editar únicamente sus propias lecciones y sus pasos
- Eliminar sus propias lecciones (se eliminan también los pasos asociados)
- Crear pasos dentro de lecciones
- Editar pasos de sus propias lecciones
- Eliminar pasos de sus propias lecciones
- Asociar simuladores con sus lecciones
- Asignar categorías a sus lecciones

### Gestión de Simuladores

**Usuarios (no autenticados):**
- Usar simuladores interactivos
- Recibir feedback inmediato

**Usuarios (autenticados):**
- Todas las funcionalidades anteriores

**Administradores:**
- Todas las funcionalidades anteriores, más:
- Crear nuevos simuladores
- Editar únicamente sus propios simuladores
- Eliminar sus propios simuladores
- Vincular con lecciones

### Perfiles de Usuario (Solo para Autenticados)

- Actualizar información personal (nombre, email, contraseña)
- Guardar lecciones como favoritas
- Acceder a historial de lecciones completadas
- Configurar preferencias de accesibilidad
- Ver estadísticas de progreso personal
- Ver lista de favoritos

### Historial y Seguimiento (Solo para Autenticados)

- Registrar lecciones marcadas como completadas
- Consultar historial personal
- Filtrar historial por fecha o tema
- Eliminar registros del historial personal
- Restaurar lecciones eliminadas del catálogo desde el historial personal

### Sistema de Ayuda

**Usuarios:**
- Consultar preguntas frecuentes (FAQ)
- Buscar en FAQ por palabra clave

**Administradores:**
- Todas las funcionalidades anteriores, más:
- Crear nuevas FAQ
- Editar únicamente sus propias FAQ
- Eliminar sus propias FAQ
- Organizar FAQ por categorías o temas

### Gestión de Usuarios (Solo Administradores)

- Ver lista completa de usuarios registrados
- Ver perfil y estadísticas de otros usuarios
- Desactivar cuentas de usuario (sin eliminar datos)
- Acceder a logs de auditoría
- Ver historial de cambios realizados en la plataforma

---

## Medición del Progreso

El sistema de progreso está diseñado para rastrear el aprendizaje individual del usuario sin exponer estadísticas colectivas, respetando su privacidad.

### Principios de Diseño

- **Privacidad**: No se exponen comparativas ni estadísticas colectivas que puedan avergonzar al usuario
- **Respeto al ritmo**: Solo se cuenta como completada cuando el usuario marca explícitamente "Lección aprendida"
- **Simplicidad**: La unidad mínima de progreso es la lección (no se rastrea paso a paso)
- **Complementariedad**: Los simuladores son prácctica complementaria, no afectan el progreso general

### Unidades de Medición

**Lección Completada**
- Una lección se marca como completada cuando el usuario presiona el botón "Lección aprendida"
- Esto requiere autenticación (usuarios no autenticados no pueden marcar)
- Se registra la fecha y hora de completación
- Se cuenta el número de accesos a la lección

**Progreso por Categoría**
- Calcula el porcentaje de lecciones completadas en esa categoría
- Fórmula: `(Lecciones completadas en categoría / Total lecciones en categoría) × 100`
- Permite al usuario ver en qué áreas temáticas ha avanzado más
- Base para futuras mejoras de gamificación (v1.1+)

**Progreso Global**
- Calcula el porcentaje de lecciones completadas en toda la plataforma
- Fórmula: `(Total lecciones completadas / Total lecciones plataforma) × 100`
- Visión general del aprendizaje del usuario

**Acceso a Simuladores**
- Se registra cada vez que el usuario accede a un simulador
- Se cuenta el número de intentos/accesos
- No afecta el cálculo de progreso general
- Datos complementarios para futuras mejoras (v1.2+) como sistema de recomendaciones

---

## Requisitos No Funcionales

- **Rendimiento**: API debe responder en menos de 500ms
- **Escalabilidad**: Diseño preparado para múltiples usuarios concurrentes
- **Seguridad**: Validación de entrada, protección contra inyección SQL y CSRF
- **Documentación**: API completamente documentada con Swagger/OpenAPI
- **Testing**: Cobertura mínima del 70% en pruebas unitarias
- **Accesibilidad**: Respuestas claras y estructuradas para facilitar integración con frontend accesible

---

## Stack Tecnológico

El backend está implementado con **Spring Boot**, un framework Java moderno que proporciona:

- Inyección de dependencias mediante Spring IoC
- Gestión automática de transacciones
- ORM mediante JPA/Hibernate para la capa de persistencia
- Security para autenticación y autorización
- Data REST para generar APIs automáticamente
- Testing con JUnit 5 y Mockito

### Dependencias Principales

- **Spring Boot Web**: Para construcción de API REST
- **Spring Data JPA**: Para acceso a base de datos
- **Spring Security**: Para autenticación y autorización
- **H2/MySQL**: Base de datos
- **Lombok**: Reducción de código boilerplate
- **Swagger/Springdoc**: Documentación automática de API
- **JUnit 5 & Mockito**: Testing

---

## Estructura del Proyecto

```
backend/
├── .mvn/                           # Maven Wrapper
├── mvnw                            # Maven Wrapper (Linux/Mac)
├── mvnw.cmd                        # Maven Wrapper (Windows)
├── pom.xml                         # Configuración de dependencias Maven
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── AplicacionSaludo.java    # Clase principal (@SpringBootApplication)
│   │   │   │
│   │   │   ├── model/              # ✅ Entidades JPA (9 implementadas)
│   │   │   │   ├── User.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Lesson.java
│   │   │   │   ├── Step.java
│   │   │   │   ├── Simulator.java
│   │   │   │   ├── UserLessonProgress.java
│   │   │   │   ├── UserSimulatorInteraction.java
│   │   │   │   ├── FAQ.java
│   │   │   │   └── AuditLog.java
│   │   │   │
│   │   │   ├── config/             # ✅ Configuración
│   │   │   │   └── JpaConfig.java
│   │   │   │
│   │   │   ├── repository/         # 📋 Interfaces JpaRepository (pendiente)
│   │   │   │   └── package-info.java
│   │   │   │
│   │   │   ├── service/            # 📋 Lógica de negocio (pendiente)
│   │   │   │   └── package-info.java
│   │   │   │
│   │   │   ├── controller/         # 📋 Controladores REST (pendiente)
│   │   │   │   └── package-info.java
│   │   │   │
│   │   │   ├── dto/                # 📋 Data Transfer Objects (pendiente)
│   │   │   │   └── package-info.java
│   │   │   │
│   │   │   ├── exception/          # 📋 Excepciones personalizadas (pendiente)
│   │   │   │   └── package-info.java
│   │   │   │
│   │   │   └── security/           # 📋 Configuración de seguridad (pendiente)
│   │   │       └── package-info.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-test.properties
│   │
│   └── test/
│       └── java/
│           ├── model/
│           ├── repository/
│           ├── service/
│           └── controller/
│
├── ENTIDADES_JPA.md                # Documentación de entidades implementadas
├── README.md                       # Descripción del proyecto
├── .gitignore                      # Archivos ignorados por Git
└── target/                         # Archivos compilados (generados por Maven)
```

### Descripción de Paquetes

| Paquete | Descripción | Archivos | Status |
|---------|-------------|----------|--------|
| **model** | Entidades JPA mapeadas con relaciones | 9 clases | ✅ Completo |
| **config** | Configuración de Spring (JPA, transacciones) | 1 clase | ✅ Completo |
| **repository** | Interfaces JpaRepository para acceso a datos | 9 pendientes | 📋 Pendiente |
| **service** | Lógica de negocio y operaciones CRUD | 9 pendientes | 📋 Pendiente |
| **controller** | Controladores REST y endpoints de API | 9+ pendientes | 📋 Pendiente |
| **dto** | Data Transfer Objects (request/response) | n pendientes | 📋 Pendiente |
| **exception** | Excepciones personalizadas y manejadores | n pendientes | 📋 Pendiente |
| **security** | Spring Security y JWT | n pendientes | 📋 Pendiente |

---

## Instalación y Configuración

### Requisitos Previos

- Java 11 o superior
- Maven 3.6.0 o superior
- MySQL 8.0 (u otra base de datos compatible)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. **Configurar base de datos**
   
   Editar `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/nombre_base_datos
   spring.datasource.username=usuario
   spring.datasource.password=contraseña
   spring.jpa.hibernate.ddl-auto=create-drop
   ```

3. **Construir el proyecto**
   ```bash
   ./mvnw clean install
   ```

4. **Ejecutar la aplicación**
   ```bash
   ./mvnw spring-boot:run
   ```

5. **Acceder a la API**
   
   La API estará disponible en `http://localhost:8080`
   
   Documentación Swagger: `http://localhost:8080/swagger-ui.html`

---

## Uso de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario (Público)
- `POST /api/auth/login` - Iniciar sesión (Público)
- `POST /api/auth/logout` - Cerrar sesión (Autenticado)
- `POST /api/auth/refresh` - Renovar token JWT (Autenticado)

### Lecciones

**Lectura (Todos):**
- `GET /api/lessons` - Obtener todas las lecciones
- `GET /api/lessons/{id}` - Obtener lección por ID (incluye pasos)
- `GET /api/lessons/search?query=` - Buscar lecciones
- `GET /api/lessons/category/{categoryId}` - Obtener lecciones por categoría

**Modificación (Solo Admin sobre contenido propio):**
- `POST /api/lessons` - Crear nueva lección
- `PUT /api/lessons/{id}` - Actualizar lección (solo si es autor)
- `DELETE /api/lessons/{id}` - Eliminar lección (solo si es autor)

### Pasos de Lecciones

**Lectura (Todos):**
- `GET /api/lessons/{lessonId}/steps` - Obtener todos los pasos de una lección
- `GET /api/lessons/{lessonId}/steps/{stepId}` - Obtener un paso específico

**Modificación (Solo Admin sobre contenido propio):**
- `POST /api/lessons/{lessonId}/steps` - Crear nuevo paso (solo si es autor de la lección)
- `PUT /api/lessons/{lessonId}/steps/{stepId}` - Actualizar paso (solo si es autor)
- `DELETE /api/lessons/{lessonId}/steps/{stepId}` - Eliminar paso (solo si es autor)

### Categorías

**Lectura (Todos):**
- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/{id}` - Obtener categoría por ID
- `GET /api/categories/{id}/lessons` - Obtener lecciones de una categoría

**Modificación (Solo Admin):**
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Eliminar categoría (solo si no tiene lecciones)

### Simuladores

**Lectura y Uso (Todos):**
- `GET /api/simulators` - Obtener todos los simuladores
- `GET /api/simulators/{id}` - Obtener simulador por ID
- `POST /api/simulators/{id}/interact` - Interactuar con simulador

**Modificación (Solo Admin sobre contenido propio):**
- `POST /api/simulators` - Crear nuevo simulador
- `PUT /api/simulators/{id}` - Actualizar simulador (solo si es autor)
- `DELETE /api/simulators/{id}` - Eliminar simulador (solo si es autor)

### Perfil de Usuario (Autenticado)

- `GET /api/users/{id}/profile` - Obtener perfil del usuario (solo del mismo usuario)
- `PUT /api/users/{id}/profile` - Actualizar perfil (solo del mismo usuario)
- `GET /api/users/{id}/favorites` - Obtener lecciones favoritas
- `POST /api/users/{id}/favorites/{lessonId}` - Guardar lección como favorita
- `DELETE /api/users/{id}/favorites/{lessonId}` - Eliminar de favoritos
- `GET /api/users/{id}/accessibility-settings` - Obtener preferencias de accesibilidad
- `PUT /api/users/{id}/accessibility-settings` - Actualizar preferencias

### Historial de Aprendizaje (Autenticado)

- `GET /api/users/{id}/history` - Obtener historial de lecciones completadas
- `POST /api/users/{id}/history/{lessonId}` - Marcar lección como completada
- `DELETE /api/users/{id}/history/{lessonId}` - Eliminar del historial
- `GET /api/users/{id}/progress` - Obtener progreso global (porcentaje)
- `GET /api/users/{id}/progress/categories` - Obtener progreso por categoría
- `GET /api/users/{id}/simulator-interactions` - Obtener historial de simuladores usados

### Preguntas Frecuentes

**Lectura (Todos):**
- `GET /api/faq` - Obtener todas las FAQ
- `GET /api/faq/search?query=` - Buscar en FAQ
- `GET /api/faq/topic/{topic}` - Obtener FAQ por categoría

**Modificación (Solo Admin sobre contenido propio):**
- `POST /api/faq` - Crear nueva FAQ
- `PUT /api/faq/{id}` - Actualizar FAQ (solo si es autor)
- `DELETE /api/faq/{id}` - Eliminar FAQ (solo si es autor)

### Gestión de Usuarios (Solo Admin)

- `GET /api/admin/users` - Listar todos los usuarios
- `GET /api/admin/users/{id}` - Obtener detalles de usuario
- `GET /api/admin/users/{id}/statistics` - Ver estadísticas del usuario
- `PUT /api/admin/users/{id}/status` - Activar/Desactivar cuenta
- `GET /api/admin/audit-logs` - Ver logs de auditoría
- `GET /api/admin/audit-logs/search?filter=` - Filtrar logs

---

## Pruebas

Ejecutar todas las pruebas:
```bash
./mvnw test
```

Ejecutar con cobertura:
```bash
./mvnw test jacoco:report
```

Las pruebas incluyen:
- Pruebas unitarias de servicios
- Pruebas de controladores con MockMvc
- Pruebas de autenticación y autorización
- Pruebas de validación de entrada

---

## Documentación

La API está completamente documentada mediante Swagger/OpenAPI. Acceder a:

```
http://localhost:8080/swagger-ui.html
```

También se incluyen colecciones de Postman para prueba manual de endpoints.

---

## Diseño de la Base de Datos

### Diagrama Entidad-Relación

![Diagrama ER](diagramaER.svg)

### Documentación Detallada

Para una documentación completa del modelo de datos, incluyendo descripción detallada de cada tabla, relaciones, constraints e índices, consulte el archivo [**MODELO_DATOS.md**](MODELO_DATOS.md).

El documento incluye:
- Descripción completa de cada entidad
- Campos, tipos y constraints
- Relaciones entre tablas
- Estrategia de índices para optimización
- Cálculos de progreso
- Consideraciones de diseño

### Entidades Principales (Resumen)

**User**
- id (PK)
- username (unique)
- email (unique)
- password (hasheada con BCrypt)
- role (USER, ADMIN)
- isActive (boolean)
- createdAt
- updatedAt

**Category**
- id (PK)
- name (string, unique)
- description (text, nullable)
- createdAt

**Lesson**
- id (PK)
- title
- description
- categoryId (FK → Category) - Categoría a la que pertenece la lección
- lessonOrder (orden de visualización dentro de la categoría)
- createdBy (FK → User) - Administrador que creó la lección
- relatedSimulatorId (FK → Simulator, nullable)
- isPublished (boolean)
- createdAt
- updatedAt
- updatedBy (FK → User) - Admin que realizó la última edición

**Step**
- id (PK)
- lessonId (FK → Lesson)
- stepOrder (orden secuencial dentro de la lección)
- title (titulo del paso)
- content (texto del paso)
- imageUrl (opcional)
- videoUrl (opcional)
- createdAt
- updatedAt

**Simulator**
- id (PK)
- title
- description
- feedback (texto de retroalimentación)
- createdBy (FK → User)
- lessonId (FK → Lesson, nullable)
- isActive (boolean)
- createdAt
- updatedAt
- updatedBy (FK → User)

**UserLessonProgress**
- id (PK)
- userId (FK → User)
- lessonId (FK → Lesson)
- isCompleted (boolean) - True cuando marca "Lección aprendida"
- isFavorite (boolean)
- completedAt (timestamp, nullable)
- accessCount (integer) - Cuántas veces accedió a la lección
- unique constraint: (userId, lessonId)

**UserSimulatorInteraction**
- id (PK)
- userId (FK → User)
- simulatorId (FK → Simulator)
- accessedAt (timestamp)
- accessCount (integer) - Cuántas veces intentó/accedió al simulador

**FAQ**
- id (PK)
- question
- answer
- topic (categoría/tema)
- createdBy (FK → User)
- isActive (boolean)
- createdAt
- updatedAt
- updatedBy (FK → User)

**AuditLog**
- id (PK)
- userId (FK → User)
- action (CREATE, UPDATE, DELETE, DISABLE_ACCOUNT)
- entityType (LESSON, SIMULATOR, FAQ, USER, CATEGORY)
- entityId
- previousValue (JSON, opcional)
- newValue (JSON, opcional)
- timestamp
- ipAddress (opcional)

---

## Consideraciones de Seguridad

- Validación de entrada en todos los endpoints
- Contraseñas hasheadas con BCrypt
- Tokens JWT con expiración
- CORS configurado según necesidad
- Protección contra inyección SQL mediante JPA
- Logs de auditoría para acciones sensibles (tabla AuditLog)
- Control de acceso basado en propiedad de contenido
- Restricción de modificación solo para contenido del usuario autenticado

---

## Mejoras Futuras (v1.1+)

- Notificaciones por email para nuevas lecciones
- Sistema de recomendaciones basado en historial
- Estadísticas de progreso del usuario
- Integración con servicio de storage para videos
- Sistema de comentarios en lecciones
- Talleres online con voluntarios

---

## Soporte y Contacto

Para reportar errores o sugerencias, abrir un issue en el repositorio.

---

## Licencia

Proyecto educativo. Derechos reservados IES Rafael Alberti.

---

**Última actualización**: Diciembre 2025

