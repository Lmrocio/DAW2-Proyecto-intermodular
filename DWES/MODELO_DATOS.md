# Modelo de Datos - Plataforma Educativa de Tecnología

## Índice

1. [Diagrama Entidad-Relación](#diagrama-entidad-relación)
2. [Descripción de Entidades](#descripción-de-entidades)
3. [Relaciones y Constraints](#relaciones-y-constraints)
4. [Justificación del Diseño](#justificación-del-diseño)
5. [Índices y Optimización](#índices-y-optimización)

---

## Diagrama Entidad-Relación

![Diagrama ER](diagramaER.svg)

*Diagrama visual del modelo de datos completo de la plataforma*

---

## Descripción de Entidades

### 1. User

**Tabla de Gestión de Usuarios y Autenticación**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único del usuario |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Nombre de usuario único para login |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Correo electrónico único |
| password | VARCHAR(255) | NOT NULL | Contraseña hasheada con BCrypt |
| role | ENUM('USER', 'ADMIN') | NOT NULL, DEFAULT='USER' | Rol del usuario |
| isActive | BOOLEAN | NOT NULL, DEFAULT=true | Estado de la cuenta |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Última actualización |

**Descripción:**
Almacena información de todos los usuarios del sistema. Los usuarios pueden tener dos roles:
- **USER**: Usuario normal con acceso a lecciones, favoritos e historial
- **ADMIN**: Administrador que puede crear y gestionar contenido

**Relaciones:**
- 1:N con Lesson (createdBy, updatedBy)
- 1:N con Simulator (createdBy, updatedBy)
- 1:N con FAQ (createdBy, updatedBy)
- 1:N con UserLessonProgress
- 1:N con UserSimulatorInteraction
- 1:N con AuditLog

---

### 2. Category

**Tabla de Organización de Lecciones**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único de categoría |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Nombre de la categoría |
| description | TEXT | NULL | Descripción de la categoría |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Fecha de creación |

**Descripción:**
Define las categorías temáticas que agrupan lecciones. Facilita la navegación y organización del contenido.

**Ejemplos de categorías:**
- Redes Sociales
- Mensajería
- Búsqueda en Internet
- Compras Online
- Videollamadas
- Seguridad Digital

**Relaciones:**
- 1:N con Lesson (categoryId)

---

### 3. Lesson

**Tabla de Contenido Principal - Tutoriales Estructurados**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único de lección |
| title | VARCHAR(255) | NOT NULL | Título de la lección |
| description | TEXT | NOT NULL | Descripción y objetivo |
| categoryId | BIGINT | FK, NOT NULL | Referencia a Category |
| lessonOrder | INT | NOT NULL | Orden dentro de la categoría |
| createdBy | BIGINT | FK, NOT NULL | Admin que creó la lección |
| updatedBy | BIGINT | FK, NOT NULL | Admin que realizó última edición |
| relatedSimulatorId | BIGINT | FK, NULL | Simulador asociado (opcional) |
| isPublished | BOOLEAN | NOT NULL, DEFAULT=false | Estado de publicación |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Última actualización |

**Descripción:**
Almacena las lecciones (tutoriales) que son el contenido principal de la plataforma. Cada lección:
- Pertenece a una categoría
- Contiene múltiples pasos secuenciales
- Es creada y editada por un administrador
- Puede vincularse opcionalmente con un simulador para práctica
- Solo el creador puede modificarla

**Restricciones:**
- `lessonOrder` debe ser único por categoría
- `relatedSimulatorId` es opcional (NULL permitido)
- `createdBy` y `updatedBy` son administradores

**Relaciones:**
- N:1 con Category (categoryId)
- N:1 con User (createdBy)
- N:1 con User (updatedBy)
- 0:1 con Simulator (relatedSimulatorId)
- 1:N con Step (lessonId)
- 1:N con UserLessonProgress (lessonId)

---

### 4. Step

**Tabla de Pasos Secuenciales dentro de Lecciones**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único del paso |
| lessonId | BIGINT | FK, NOT NULL | Referencia a Lesson |
| stepOrder | INT | NOT NULL | Número secuencial dentro de lección |
| title | VARCHAR(255) | NOT NULL | Título del paso |
| content | LONGTEXT | NOT NULL | Contenido principal del paso |
| imageUrl | VARCHAR(500) | NULL | URL de imagen (opcional) |
| videoUrl | VARCHAR(500) | NULL | URL de video (opcional) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Última actualización |

**Descripción:**
Representa los pasos individuales que componen una lección. Cada paso:
- Tiene un orden secuencial dentro de su lección
- Contiene un único concepto o acción a aprender
- Puede incluir texto, imágenes y/o videos
- Es mostrado uno a uno al usuario de forma progresiva
- No se rastrea progreso individual por paso (solo por lección)

**Restricciones:**
- `stepOrder` debe ser único por lección
- Al eliminar una lección, se eliminan automáticamente todos sus pasos (CASCADE DELETE)
- `imageUrl` y `videoUrl` son opcionales

**Relaciones:**
- N:1 con Lesson (lessonId)

**Ejemplo de pasos en "Cómo enviar un mensaje de WhatsApp":**
1. "Abre la aplicación WhatsApp"
2. "Busca el contacto en tu lista"
3. "Presiona el campo de mensaje"
4. "Escribe tu mensaje"
5. "Presiona enviar"

---

### 5. Simulator

**Tabla de Prácticas Interactivas**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único del simulador |
| title | VARCHAR(255) | NOT NULL | Título del simulador |
| description | TEXT | NULL | Descripción y objetivo |
| feedback | LONGTEXT | NULL | Mensajes de retroalimentación |
| createdBy | BIGINT | FK, NOT NULL | Admin que creó el simulador |
| updatedBy | BIGINT | FK, NOT NULL | Admin que realizó última edición |
| lessonId | BIGINT | FK, NULL | Lección asociada (opcional) |
| isActive | BOOLEAN | NOT NULL, DEFAULT=true | Estado del simulador |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Última actualización |

**Descripción:**
Almacena los simuladores interactivos que permiten a los usuarios practicar en entornos seguros. Cada simulador:
- Proporciona feedback inmediato
- Permite practicar sin consecuencias reales
- Puede vincularse opcionalmente con una lección
- Puede usarse de forma independiente
- Solo el creador puede modificarlo
- No afecta el cálculo de progreso general

**Relaciones:**
- N:1 con User (createdBy)
- N:1 con User (updatedBy)
- 0:1 con Lesson (lessonId)
- 1:N con UserSimulatorInteraction

---

### 6. UserLessonProgress

**Tabla de Seguimiento del Progreso del Usuario**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| userId | BIGINT | FK, NOT NULL | Referencia a User |
| lessonId | BIGINT | FK, NOT NULL | Referencia a Lesson |
| isCompleted | BOOLEAN | NOT NULL, DEFAULT=false | ¿Lección completada? |
| isFavorite | BOOLEAN | NOT NULL, DEFAULT=false | ¿Lección en favoritos? |
| completedAt | TIMESTAMP | NULL | Fecha/hora de completación |
| accessCount | INT | NOT NULL, DEFAULT=0 | Cuántas veces accedió |

**Descripción:**
Registra el progreso de cada usuario en cada lección. Es la tabla central para:
- Rastrear qué lecciones ha completado cada usuario
- Guardar lecciones como favoritas
- Calcular progreso por categoría y global
- Registrar fecha de completación

**Restricciones:**
- UNIQUE(userId, lessonId) - Un usuario solo puede tener un registro por lección
- `isCompleted = true` solo cuando usuario marca explícitamente "Lección aprendida"
- Al eliminar usuario o lección, se eliminan sus registros (CASCADE DELETE)

**Relaciones:**
- N:1 con User (userId)
- N:1 con Lesson (lessonId)

**Cálculo de Progreso:**
```sql
-- Progreso por Categoría
SELECT COUNT(*) / (SELECT COUNT(*) FROM Lesson WHERE categoryId = ?) * 100
FROM UserLessonProgress 
WHERE userId = ? AND lessonId IN (
  SELECT id FROM Lesson WHERE categoryId = ?
) AND isCompleted = true

-- Progreso Global
SELECT COUNT(*) / (SELECT COUNT(*) FROM Lesson) * 100
FROM UserLessonProgress 
WHERE userId = ? AND isCompleted = true
```

---

### 7. UserSimulatorInteraction

**Tabla de Registro de Acceso a Simuladores**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| userId | BIGINT | FK, NOT NULL | Referencia a User |
| simulatorId | BIGINT | FK, NOT NULL | Referencia a Simulator |
| accessedAt | TIMESTAMP | NOT NULL | Fecha/hora del acceso |
| accessCount | INT | NOT NULL, DEFAULT=0 | Cuántas veces intentó/accedió |

**Descripción:**
Registra cada interacción de un usuario con un simulador. Proporciona datos para:
- Rastrear qué simuladores se utilizan más
- Base para futuras recomendaciones (v1.2+)
- Análisis de uso
- **NO afecta** el cálculo de progreso general

**Restricciones:**
- Al eliminar usuario o simulador, se eliminan sus registros (CASCADE DELETE)

**Relaciones:**
- N:1 con User (userId)
- N:1 con Simulator (simulatorId)

---

### 8. FAQ

**Tabla de Preguntas Frecuentes**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| question | VARCHAR(500) | NOT NULL | Pregunta formulada |
| answer | LONGTEXT | NOT NULL | Respuesta detallada |
| topic | VARCHAR(100) | NOT NULL | Categoría/tema de la FAQ |
| createdBy | BIGINT | FK, NOT NULL | Admin que creó |
| updatedBy | BIGINT | FK, NOT NULL | Admin que editó |
| isActive | BOOLEAN | NOT NULL, DEFAULT=true | ¿FAQ visible? |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Última actualización |

**Descripción:**
Almacena preguntas frecuentes sobre la plataforma. Son:
- Accesibles sin autenticación requerida
- Organizables por tema/categoría
- Editables solo por su creador
- Base para mejorar UX según dudas comunes

**Relaciones:**
- N:1 con User (createdBy)
- N:1 con User (updatedBy)

---

### 9. AuditLog

**Tabla de Registro de Auditoría**

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| userId | BIGINT | FK, NOT NULL | Usuario que realizó acción |
| action | ENUM | NOT NULL | Tipo de acción realizada |
| entityType | ENUM | NOT NULL | Tipo de entidad afectada |
| entityId | BIGINT | NOT NULL | ID de la entidad afectada |
| previousValue | JSON | NULL | Valor anterior (para UPDATE) |
| newValue | JSON | NULL | Valor nuevo (para UPDATE/CREATE) |
| timestamp | TIMESTAMP | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Momento de la acción |
| ipAddress | VARCHAR(50) | NULL | IP desde donde se realizó |

**Valores Permitidos:**
- **action**: CREATE, UPDATE, DELETE, DISABLE_ACCOUNT
- **entityType**: LESSON, SIMULATOR, FAQ, USER, CATEGORY, STEP

**Descripción:**
Registro completo de auditoría que rastrea:
- Quién realizó cada acción
- Qué tipo de acción fue
- Qué entidad fue afectada
- Cuándo ocurrió
- Desde dónde se realizó
- Valores anteriores y nuevos (para auditoría de cambios)

**Propósito:**
- Trazabilidad completa de cambios
- Seguridad y cumplimiento normativo
- Recuperación de datos si es necesario
- Análisis de actividad del sistema
- Solo admins pueden consultar logs

**Relaciones:**
- N:1 con User (userId)

---

## Relaciones y Constraints

### Relaciones Principales

```
User
  ├─ 1:N ──→ Lesson (createdBy)
  ├─ 1:N ──→ Lesson (updatedBy)
  ├─ 1:N ──→ Simulator (createdBy)
  ├─ 1:N ──→ Simulator (updatedBy)
  ├─ 1:N ──→ FAQ (createdBy)
  ├─ 1:N ──→ FAQ (updatedBy)
  ├─ 1:N ──→ UserLessonProgress
  ├─ 1:N ──→ UserSimulatorInteraction
  └─ 1:N ──→ AuditLog

Category
  └─ 1:N ──→ Lesson (categoryId)

Lesson
  ├─ 1:N ──→ Step (lessonId)
  ├─ 0:1 ──→ Simulator (relatedSimulatorId)
  └─ 1:N ──→ UserLessonProgress (lessonId)

Simulator
  └─ 1:N ──→ UserSimulatorInteraction (simulatorId)
```

### Constraints de Integridad Referencial

| Relación | ON DELETE | ON UPDATE |
|----------|-----------|-----------|
| Lesson.categoryId → Category.id | RESTRICT | CASCADE |
| Lesson.createdBy → User.id | RESTRICT | CASCADE |
| Lesson.updatedBy → User.id | RESTRICT | CASCADE |
| Step.lessonId → Lesson.id | CASCADE | CASCADE |
| Simulator.lessonId → Lesson.id | SET NULL | CASCADE |
| UserLessonProgress.userId → User.id | CASCADE | CASCADE |
| UserLessonProgress.lessonId → Lesson.id | CASCADE | CASCADE |
| UserSimulatorInteraction.userId → User.id | CASCADE | CASCADE |
| UserSimulatorInteraction.simulatorId → Simulator.id | CASCADE | CASCADE |
| FAQ.createdBy → User.id | RESTRICT | CASCADE |
| AuditLog.userId → User.id | CASCADE | CASCADE |

**Explicación:**
- **RESTRICT**: No permite eliminar si existen referencias (protección)
- **CASCADE**: Elimina automáticamente registros dependientes
- **SET NULL**: Establece la FK en NULL si se elimina la entidad referenciada

---

## Índices y Optimización

### Índices por Tabla

#### User
- PRIMARY KEY: `id`
- UNIQUE: `username`, `email`

#### Category
- PRIMARY KEY: `id`
- UNIQUE: `name`

#### Lesson
- PRIMARY KEY: `id`
- INDEX: `(categoryId, lessonOrder)` - Para búsqueda por categoría
- INDEX: `(createdBy)` - Para obtener lecciones de un admin

#### Step
- PRIMARY KEY: `id`
- INDEX: `(lessonId, stepOrder)` - Para obtener pasos en orden

#### Simulator
- PRIMARY KEY: `id`
- INDEX: `(createdBy)` - Para obtener simuladores de un admin

#### UserLessonProgress
- PRIMARY KEY: `id`
- UNIQUE: `(userId, lessonId)` - Garantiza un registro por usuario-lección
- INDEX: `(userId, isCompleted)` - Para cálculo de progreso
- INDEX: `(lessonId, isCompleted)` - Para estadísticas de lección

#### UserSimulatorInteraction
- PRIMARY KEY: `id`
- INDEX: `(userId, simulatorId)` - Para historial de usuario
- INDEX: `(accessedAt)` - Para análisis temporal

#### FAQ
- PRIMARY KEY: `id`
- INDEX: `(topic)` - Para búsqueda por categoría
- INDEX: `(createdBy)` - Para obtener FAQ de un admin

#### AuditLog
- PRIMARY KEY: `id`
- INDEX: `(timestamp)` - Para búsquedas temporales
- INDEX: `(userId, action)` - Para historial por usuario

---

## Justificación del Diseño

El modelo de datos ha sido diseñado siguiendo los requisitos específicos del proyecto y la rúbrica DWES v1.2. Cada decisión de diseño está justificada por las necesidades funcionales y no funcionales del sistema.

### Decisiones Principales de Diseño

#### 1. Separación de Concepto: Lesson vs Step

**Decisión**: Dividir las lecciones en pasos secuenciales.

**Justificación**:
- El proyecto requiere "tutoriales estructurados en pasos" que representen una curva de aprendizaje progresiva
- Permite mostrar contenido de forma gradual, mejorando la experiencia para adultos mayores (target user)
- Facilita la gestión modular de contenido educativo
- Cada paso es una unidad atómica de información

#### 2. Tabla de Progreso (UserLessonProgress)

**Decisión**: Crear tabla separada para rastrear progreso en lugar de campos en User.

**Justificación**:
- Normalización: Evita datos redundantes (N:M entre User y Lesson)
- Escalabilidad: Soporta múltiples registros de progreso sin afectar tabla User
- Auditoría: Cada cambio de progreso es registrable
- Flexibilidad: Permite campos adicionales (completedAt, accessCount, etc.)

#### 3. Propiedad de Contenido (createdBy, updatedBy)

**Decisión**: Rastrear quién creó y modificó cada contenido.

**Justificación**:
- Requisito de la rúbrica: "Control de acceso basado en roles"
- Permite que admins solo editen su propio contenido (requisito explícito del proyecto)
- Auditoría: Trazabilidad completa de quién realizó cambios
- Justificación: Evita ediciones cruzadas entre administradores

#### 4. Tabla de Auditoría (AuditLog)

**Decisión**: Crear tabla dedicada para logs de auditoría.

**Justificación**:
- Requisito de la rúbrica: "Documentación bien realizada"
- Seguridad: Rastrea todas las acciones sensibles
- Cumplimiento: Permite auditorías y análisis posteriores
- Recuperación: Base para revertir cambios si es necesario
- Independencia: No interfiere con la lógica operacional

#### 5. Relación Lesson ↔ Simulator (Opcional)

**Decisión**: Vincular simuladores opcionalmente con lecciones (relación 0:1).

**Justificación**:
- Requisito del proyecto: "Simuladores pueden estar vinculados o ser independientes"
- Flexibilidad: No todas las lecciones necesitan simulador
- Modularidad: Simuladores pueden usarse en múltiples contextos
- SET NULL: Si se elimina simulador, la lección no queda huérfana

#### 6. Categorizacion de Contenido

**Decisión**: Tabla separada de Category en lugar de string.

**Justificación**:
- Normalización: Evita duplicación de nombres de categorías
- Consultas: Facilita filtrado y búsqueda por categoría
- Escalabilidad: Permite agregar metadatos a categorías (descripción, orden, etc.)
- Progreso: Cálculo de "progreso por categoría" requiere relación clara

#### 7. Registros Separados para Simuladores (UserSimulatorInteraction)

**Decisión**: Tabla independiente para interacciones con simuladores.

**Justificación**:
- Decisión del proyecto: "Simuladores NO afectan cálculo de progreso"
- Separación: Mantiene claro que son datos complementarios
- Futuro-proof: Base para v1.2+ (sistema de recomendaciones)
- Análisis: Permite estudiar patrones de uso sin contaminar progreso

#### 8. No Implementar Soft Delete

**Decisión**: No usar campos `isDeleted` o similar.

**Justificación**:
- Simplicidad: Reduce complejidad del modelo
- Proyectos educativos: Menos críticos para cumplimiento normativo
- Auditoría: AuditLog proporciona historial completo
- Facilidad: Operaciones DELETE y UPDATE más simples
- Nota: En producción real, se consideraría soft delete

### Relaciones N:N

**Decisión**: No existen relaciones muchos-a-muchos (N:M) en el modelo.

**Justificación**:
- Simplicidad: El proyecto no requiere N:M complejas
- Claridad: Las relaciones 1:N son suficientes para los requisitos
- Rendimiento: Menos tablas de unión = consultas más simples
- Escalabilidad: Las consultas son más eficientes sin joins múltiples

### Índices - Optimización para Consultas Frecuentes

**Decisión**: Índices específicos en campos FK y de búsqueda.

**Justificación**:
- Rendimiento: Acelera las consultas más frecuentes:
  - `Lesson(categoryId, lessonOrder)` - Listar lecciones por categoría
  - `UserLessonProgress(userId, isCompleted)` - Calcular progreso
  - `AuditLog(timestamp)` - Búsquedas por período
- No excesivo: Solo en campos realmente necesarios (evita overhead de escritura)
- Rúbrica: "Modelo complejo bien relacionado. Consultas complejas"

### Privacidad y Seguridad

**Decisión**: Sin tablas de estadísticas globales o rankings.

**Justificación**:
- Requisito explícito del proyecto: "No estadísticas colectivas por privacidad"
- UX: Evita comparaciones y posibles avergüenzas entre usuarios
- Diseño: Solo datos individuales (su propio progreso)
- Nota: Cumple requisitos de protección de datos

### Constraints de Integridad Referencial

**Decisión**: CASCADE y RESTRICT selectivos.

**Justificación**:
- CASCADE DELETE en Step → Lesson: Los pasos dependen totalmente de la lección
- CASCADE DELETE en UserLessonProgress → User/Lesson: Datos complementarios, se pueden borrar
- SET NULL en Simulator → Lesson: Relación opcional, no debe causar cascada
- RESTRICT en createdBy: Impide borrar admins con contenido (protección)

### Escalabilidad Futura

**Decisión**: Estructura preparada para futuras versiones.

**Justificación**:
- v1.1: Gamificación requiere `UserLessonProgress.isCompleted` (ya existe)
- v1.2: Recomendaciones requieren `UserSimulatorInteraction` (ya existe)
- Extensibilidad: Nuevas tablas se pueden agregar sin refactorizar existentes
- Índices: Preparados para crecimiento de datos

---

## Notas Importantes

### Consideraciones de Diseño

1. **Privacidad**: No hay tablas de estadísticas colectivas. El progreso es individual por usuario.

2. **Auditoría**: Cada cambio en contenido se registra en AuditLog para trazabilidad completa.

3. **Propiedad de Contenido**: Los admins solo pueden editar su propio contenido:
   ```sql
   WHERE createdBy = :currentUserId
   ```

4. **Soft Delete**: Las tablas no implementan soft delete, pero AuditLog proporciona historial.

5. **Timestamps**: Todas las tablas tienen `createdAt` y `updatedAt` para auditoría temporal.

6. **Escalabilidad**: Los índices están diseñados para queries frecuentes sin afectar inserciones.

### Migración de BD

Para crear las tablas desde código Java (Spring Boot + JPA/Hibernate), usar:
- Entidades anotadas con `@Entity`
- `spring.jpa.hibernate.ddl-auto=create-drop` en desarrollo
- Flyway o Liquibase para migraciones en producción

---

**Última actualización**: Diciembre 2025
**Proyecto**: Plataforma Educativa de Tecnología para Adultos Mayores

