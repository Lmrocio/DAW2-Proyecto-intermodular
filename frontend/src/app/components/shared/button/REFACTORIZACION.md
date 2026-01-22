# Componente Button - Refactorizado

## ✅ Refactorización completada según especificaciones

El componente `app-button` ha sido completamente refactorizado siguiendo los requisitos de `descripcion.md` con las siguientes mejoras:

### 🎯 Características principales

#### 1. **Polimorfismo (Button vs Link)**
- Si se proporciona `link`, renderiza `<a [routerLink]>`
- Si no, renderiza `<button>`
- Ambos comparten exactamente el mismo estilo visual

#### 2. **Nueva API limpia y moderna**

```typescript
// Inputs disponibles
text: string                                      // Texto del botón
link: string | any[] | null                       // RouterLink (polimorfismo)
variant: 'brutal' | 'outline' | 'ghost' | 'nav'  // Variante visual
color: 'primary' | 'secondary' | 'accent' | 'error' | 'success'
size: 'sm' | 'md' | 'lg'                         // Tamaños (40px, 48px, 56px)
icon: string | null                               // Nombre icono Lucide
iconPosition: 'left' | 'right'                   // Posición del icono
disabled: boolean                                 // Estado deshabilitado
fullWidth: boolean                                // Ancho 100%
buttonType: 'button' | 'submit' | 'reset'        // Tipo HTML
ariaLabel?: string                                // Aria-label (automático si solo icono)
extraClass?: string                               // Clases adicionales
```

#### 3. **Integración con Lucide Angular**
- Usa `<lucide-icon>` para todos los iconos
- Tamaños automáticos según `size` del botón
- Accesibilidad con `aria-hidden="true"` en iconos

#### 4. **Sintaxis moderna Angular 17+**
- ✅ `computed()` signals para clases dinámicas
- ✅ Sintaxis `@if` en plantilla
- ✅ `inject()` preparado (si se necesitan servicios)
- ✅ Standalone component

### 🎨 Variantes visuales

#### BRUTAL (Neo-Brutalismo)
```html
<app-button 
  text="Guardar" 
  variant="brutal" 
  color="primary"
/>
```
- Sombra `4px 4px 0 0` negra
- Hover: sombra aumenta a `6px 6px`
- Active: sombra reduce a `2px 2px` (efecto presión)

#### OUTLINE
```html
<app-button 
  text="Cancelar" 
  variant="outline" 
  color="accent"
/>
```
- Sin sombra
- Fondo `var(--bg-primary)`
- Borde sólido 2px

#### GHOST
```html
<app-button 
  icon="settings" 
  variant="ghost" 
  color="primary"
/>
```
- Sin borde ni fondo
- Solo texto/icono visible
- Hover: fondo sutil

#### NAV (Navegación)
```html
<app-button 
  text="Siguiente" 
  icon="arrow-right" 
  iconPosition="right"
  variant="nav" 
  color="accent"
/>
```
- Bordes redondeados
- Optimizado para flechas anterior/siguiente
- Efecto slide en hover

### 🎨 Colores

| Color | Descripción | Uso recomendado |
|-------|-------------|-----------------|
| `primary` | Amarillo (#f8d770) | Acciones principales |
| `secondary` | Naranja (#ffb842) | Acciones secundarias |
| `accent` | Azul (#0454b1) | Llamadas a la acción |
| `error` | Rojo (#fb5353) | Acciones destructivas |
| `success` | Verde (#a7ee66) | Confirmaciones |

### 📏 Tamaños (optimizados para personas mayores)

| Size | Altura | Área táctil | Uso recomendado |
|------|--------|-------------|-----------------|
| `sm` | 40px | Mínima aceptable | Botones secundarios |
| `md` | 48px | Recomendado general | Uso estándar |
| `lg` | 56px | Óptimo accesibilidad | Personas mayores |

### ♿ Accesibilidad

#### 1. **Aria-label automático**
```html
<!-- Solo icono: aria-label se genera automáticamente -->
<app-button icon="user" />
<!-- Genera: aria-label="user" -->

<!-- Personalizado -->
<app-button icon="settings" ariaLabel="Configuración de la cuenta" />
```

#### 2. **Focus visible claro**
- Outline azul de 3px con offset
- Box-shadow adicional para visibilidad

#### 3. **Disabled accesible**
```html
<!-- Botón -->
<app-button text="Guardar" [disabled]="true" />

<!-- Enlace (usa aria-disabled + pointer-events:none) -->
<app-button text="Ver más" link="/detalle" [disabled]="true" />
```

#### 4. **Reducción de movimiento**
```scss
@media (prefers-reduced-motion: reduce) {
  // Transiciones y transforms desactivados
}
```

### 📚 Ejemplos de uso

#### Botón brutal primario (amarillo con sombra)
```html
<app-button 
  text="Empezar ahora" 
  variant="brutal" 
  color="primary"
  size="lg"
  (btnClick)="onStart()"
/>
```

#### Enlace con apariencia de botón
```html
<app-button 
  text="Ver lecciones" 
  link="/lecciones"
  variant="brutal" 
  color="accent"
  icon="book-open"
/>
```

#### Botón con icono a la derecha
```html
<app-button 
  text="Siguiente" 
  icon="arrow-right"
  iconPosition="right"
  variant="nav" 
  color="accent"
/>
```

#### Botón solo icono (icon-only)
```html
<app-button 
  icon="settings"
  variant="ghost"
  color="primary"
  ariaLabel="Configuración"
/>
```

#### Botón de error (destructivo)
```html
<app-button 
  text="Eliminar cuenta" 
  variant="outline"
  color="error"
  icon="trash-2"
  (btnClick)="onDelete()"
/>
```

#### Botón de éxito
```html
<app-button 
  text="¡Completado!" 
  variant="brutal"
  color="success"
  icon="check-circle"
  [disabled]="!formValid"
/>
```

#### Botón ancho completo
```html
<app-button 
  text="Continuar" 
  variant="brutal"
  color="primary"
  [fullWidth]="true"
  size="lg"
/>
```

### 🔄 Migración desde versión anterior

#### Antes (API antigua)
```html
<app-button 
  text="Guardar"
  variant="yellow"
  type="primary"
  size="large"
  routerLink="/perfil"
/>
```

#### Después (API nueva)
```html
<app-button 
  text="Guardar"
  color="primary"
  variant="brutal"
  size="lg"
  link="/perfil"
/>
```

### ⚙️ Variables SCSS usadas

El componente usa todas las variables del sistema de diseño:

```scss
// Espaciado
v.$spacing-1, v.$spacing-2, v.$spacing-3, v.$spacing-5, v.$spacing-6, v.$spacing-8

// Tipografía
v.$font-body, v.$font-weight-bold, v.$font-weight-medium
v.$font-size-sm, v.$font-size-base, v.$font-size-lg
v.$line-height-tight

// Bordes
v.$border-medium, v.$radius-sm

// Transiciones
v.$transition-fast, v.$easing-in-out

// Sombras
v.$shadow-focus
```

### ✨ Mejoras implementadas

1. ✅ **Polimorfismo**: Button vs Link sin duplicación de código
2. ✅ **Signals**: `computed()` para clases dinámicas reactivas
3. ✅ **Lucide icons**: Integración completa con biblioteca de iconos
4. ✅ **@if syntax**: Nueva sintaxis de control flow Angular 17+
5. ✅ **Accesibilidad**: aria-label automático, focus visible, áreas táctiles generosas
6. ✅ **Neo-brutalismo**: Variante `brutal` con sombras proyectadas 4px
7. ✅ **Variantes flexibles**: brutal, outline, ghost, nav
8. ✅ **Colores semánticos**: primary, secondary, accent, error, success
9. ✅ **Disabled mejorado**: Funciona tanto en `<button>` como `<a>` con aria-disabled
10. ✅ **Reducción movimiento**: Media query prefers-reduced-motion

### 🚀 Próximos pasos recomendados

1. Actualizar componentes que usan la API antigua
2. Migrar iconos SVG hard-coded a Lucide
3. Testear accesibilidad con screen readers
4. Revisar contraste de colores (WCAG AA)
5. Documentar patrones de uso en Storybook (si se usa)

---

**Refactorización completada** ✅  
Componente listo para producción con Angular 17+ y optimizado para accesibilidad.
