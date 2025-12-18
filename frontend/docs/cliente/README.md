# ClienteFase1 - Implementación en TecnoMayores

## Descripción

La página **`/client`** implementa todos los requisitos de ClienteFase1 de forma integrada en la aplicación TecnoMayores, una plataforma educativa para adultos mayores.

---

## ✅ Requisitos Cumplidos

### Tarea 1: Manipulación del DOM

| Requisito | Implementación | Uso Real |
|-----------|----------------|----------|
| **ViewChild** | `@ViewChild('searchInput')`, `@ViewChild('lessonsContainer')` | Acceso al buscador y contenedor de lecciones |
| **ElementRef** | `searchInput: ElementRef`, `lessonsContainer: ElementRef` | Referencias a elementos nativos |
| **Renderer2** | `this.renderer.addClass()`, `this.renderer.removeClass()` | Animaciones de lecciones completadas |
| **ngAfterViewInit** | Implementado para acceso seguro al DOM | Inicialización tras renderizado |

**Código:**
```typescript
@ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

focusSearch(): void {
  this.renderer.selectRootElement(this.searchInput.nativeElement).focus();
}

animateLessonCard(lessonId: number): void {
  this.renderer.addClass(card, 'client__lesson-card--completed');
}
```

---

### Tarea 2: Sistema de Eventos

| Evento | Uso en la App |
|--------|---------------|
| **(click)** | Abrir modal de lección, alternar favoritos, botones |
| **(keyup)** | Búsqueda en tiempo real de lecciones |
| **(keyup.enter)** | Activar lección con teclado |
| **(focus)** | Estilo del buscador al recibir foco |
| **(blur)** | Quitar estilo del buscador |
| **stopPropagation** | Botón favorito sin abrir modal |
| **@HostListener** | Cerrar modales con ESC |

**Código:**
```typescript
@HostListener('document:keydown.escape')
onEscapeKey(): void {
  this.closeAllModals();
}

toggleFavorite(lesson: Lesson, event: MouseEvent): void {
  event.stopPropagation(); // Evitar abrir el modal
  lesson.favorite = !lesson.favorite;
}
```

---

### Tarea 3: Componentes Interactivos

| Componente | Uso en la App |
|------------|---------------|
| **Modal** | Ver detalle de lección, formulario de login |
| **Tabs** | Navegación: Todas / Progreso / Favoritos |
| **Accordion** | FAQ - Preguntas frecuentes |
| **Tooltip** | Ayuda en buscador, favoritos, login |
| **Alert** | Bienvenida, lección completada |
| **Card** | Tarjetas de lecciones |
| **Button** | Acciones principales |
| **LoginForm** | Formulario de inicio de sesión |

---

### Tarea 4: Theme Switcher ✨ FUNCIONAL

El Theme Switcher está **completamente funcional** e integrado en el **Header** de la aplicación:

#### Funcionalidades Implementadas:

| Característica | Estado | Detalles |
|----------------|--------|----------|
| **Detectar prefers-color-scheme** | ✅ | Detecta automáticamente si el sistema prefiere modo oscuro |
| **Toggle claro/oscuro** | ✅ | Botón visual con iconos ☀️ y 🌙 |
| **Persistir en localStorage** | ✅ | Guarda la preferencia con key `tecnomayores-theme` |
| **Aplicar al cargar** | ✅ | Se inicializa automáticamente al arrancar la app |
| **Variables CSS coherentes** | ✅ | Colores basados en la paleta del proyecto |
| **Accesibilidad** | ✅ | ARIA labels, role="switch", navegación por teclado |

#### Paleta de Colores del Tema:

**Tema Claro (por defecto):**
- Fondo principal: `#fff6df` (coincide con $color-bg-light)
- Texto principal: `#030303` (coincide con $color-text-dark)
- Colores de marca: `#f8d770`, `#ffb842`, `#f3742b`, `#0454b1`

**Tema Oscuro:**
- Fondo principal: `#1a1410` (tono cálido oscuro complementario)
- Texto principal: `#f5f5f5` (casi blanco para legibilidad)
- Colores de marca: `#ffd966`, `#ffc04d`, `#ff8c4b`, `#3d8ff5` (más brillantes)

#### Archivos:
- `services/theme.service.ts` - Lógica del servicio
- `components/shared/theme-switcher/` - Componente visual
- `styles/00-settings/_theme.scss` - Variables CSS de temas
- `app.ts` - Inicialización del servicio

#### Cómo Funciona:

1. **Al cargar la app**: 
   - Lee localStorage → Si existe, aplica ese tema
   - Si no existe → Detecta `prefers-color-scheme`
   - Aplica la clase `theme-light` o `theme-dark` al `<html>`

2. **Al hacer click en el switcher**:
   - Alterna entre `light` y `dark`
   - Actualiza localStorage
   - Cambia la clase del documento
   - Actualiza meta theme-color para móviles

3. **Variables CSS Custom Properties**:
   - Todas las variables usan `var(--color-*)` con fallback a SCSS
   - Los componentes se adaptan automáticamente al cambio

---

### Tarea 5: Documentación

| Documento | Ubicación |
|-----------|-----------|
| README técnico | `frontend/docs/cliente/README.md` |
| Arquitectura de eventos | `frontend/docs/cliente/EVENTOS.md` |

---

## 📱 Funcionalidades de la Página Cliente

### 1. Listado de Lecciones
- Grid responsive de lecciones con Cards
- Imagen, título, descripción, categoría, duración, dificultad
- Indicador de lección completada (✓)
- Botón de favorito con animación

### 2. Buscador
- Filtrado en tiempo real
- Eventos (keyup), (focus), (blur)
- Tooltip de ayuda
- Manipulación DOM con Renderer2

### 3. Tabs de Navegación
- **Todas las Lecciones**: Muestra todas
- **Mi Progreso**: Solo completadas
- **Mis Favoritos**: Solo favoritas
- Navegación por teclado

### 4. Barra de Progreso
- Muestra lecciones completadas
- Porcentaje visual animado
- Se actualiza dinámicamente

### 5. FAQ con Accordion
- 4 preguntas frecuentes reales
- Respuestas útiles para usuarios mayores
- Navegación por teclado (flechas, Enter)

### 6. Modal de Lección
- Detalle completo de la lección
- Botón "Marcar como Completada"
- Cierre con ESC, backdrop o botón

### 7. Modal de Login
- Usa el componente LoginForm existente
- Integración con el sistema de autenticación (futuro)

### 8. Alertas
- Bienvenida al entrar
- Éxito al completar lección
- Auto-cierre después de 3 segundos

---

## 🎨 Variables y Componentes Utilizados

### Variables SCSS:
- `$color-primary`, `$color-secondary`, `$color-accent`, `$color-success`
- `$font-primary` (Arima Madurai), `$font-secondary` (Glory), `$font-body` (Montserrat)
- `$spacing-*` para márgenes y paddings
- `$radius-*` para bordes redondeados
- `$shadow-*` para elevaciones
- `$breakpoint-*` para responsive

### Componentes existentes:
- `app-button` - Botones con variantes
- `app-card` - Tarjetas (base de referencia)
- `app-alert` - Notificaciones
- `app-login-form` - Formulario de login
- `app-modal` - Modales
- `app-tabs` - Pestañas
- `app-accordion` - Acordeón
- `app-tooltip` - Tooltips

---

## 🧪 Cómo Probar

1. Iniciar el servidor:
   ```bash
   cd frontend
   npm start
   ```

2. Navegar a `http://localhost:4200/client`

3. Probar funcionalidades:
   - **Búsqueda**: Escribir en el buscador para filtrar
   - **Tabs**: Click en "Mi Progreso" o "Mis Favoritos"
   - **Favoritos**: Click en la estrella ☆ de una lección
   - **Modal**: Click en una lección para ver detalles
   - **Completar**: Pulsar "Marcar como Completada"
   - **FAQ**: Click en las preguntas del acordeón
   - **Login**: Pulsar "Iniciar Sesión"
   - **ESC**: Cerrar modales con la tecla ESC
   - **Theme**: Usar el toggle en el header

