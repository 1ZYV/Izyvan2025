# Componentes UI Estandarizados

Esta documentación describe los componentes de interfaz de usuario estandarizados que se pueden usar en toda la aplicación para mantener consistencia visual y funcional.

## 🔄 LoaderComponent

Componente estandarizado para mostrar estados de carga.

### Uso Básico

```html
<cp-loader></cp-loader>
```

### Props

| Prop          | Tipo                                  | Default         | Descripción                                 |
| ------------- | ------------------------------------- | --------------- | ------------------------------------------- |
| `message`     | `string`                              | `'Cargando...'` | Mensaje a mostrar junto al spinner          |
| `size`        | `'small' \| 'medium' \| 'large'`      | `'medium'`      | Tamaño del spinner                          |
| `variant`     | `'primary' \| 'secondary' \| 'white'` | `'primary'`     | Variante de color                           |
| `fullScreen`  | `boolean`                             | `false`         | Si debe ocupar toda la pantalla con overlay |
| `showMessage` | `boolean`                             | `true`          | Si debe mostrar el mensaje                  |
| `centered`    | `boolean`                             | `true`          | Si debe estar centrado                      |

### Ejemplos

```html
<!-- Loader básico -->
<cp-loader message="Cargando datos..."></cp-loader>

<!-- Loader pequeño sin mensaje -->
<cp-loader size="small" [showMessage]="false"></cp-loader>

<!-- Loader de pantalla completa -->
<cp-loader message="Procesando..." size="large" [fullScreen]="true"> </cp-loader>

<!-- Loader en línea -->
<cp-loader size="small" [centered]="false" message="Enviando..."> </cp-loader>
```

### Variantes de Color

- **primary**: Azul (default)
- **secondary**: Gris
- **white**: Blanco (para fondos oscuros)

### Tamaños

- **small**: 16px (w-4 h-4)
- **medium**: 32px (w-8 h-8)
- **large**: 48px (w-12 h-12)

## 📄 EmptyStateComponent

Componente para mostrar estados vacíos cuando no hay datos disponibles.

### Uso Básico

```html
<cp-empty-state></cp-empty-state>
```

### Props

| Prop            | Tipo          | Default                                       | Descripción                                   |
| --------------- | ------------- | --------------------------------------------- | --------------------------------------------- |
| `icon`          | `string`      | `'📋'`                                        | Emoji o icono a mostrar                       |
| `title`         | `string`      | `'No hay datos'`                              | Título del estado vacío                       |
| `description`   | `string`      | `'No se encontraron elementos para mostrar.'` | Descripción del estado                        |
| `actionText`    | `string?`     | `undefined`                                   | Texto del botón de acción                     |
| `showAction`    | `boolean`     | `false`                                       | Si debe mostrar el botón de acción            |
| `onActionClick` | `() => void?` | `undefined`                                   | Función a ejecutar al hacer clic en la acción |

### Ejemplos

```html
<!-- Estado vacío básico -->
<cp-empty-state icon="🚗" title="No tienes viajes" description="Cuando tengas viajes programados aparecerán aquí."> </cp-empty-state>

<!-- Con botón de acción -->
<cp-empty-state icon="📝" title="No hay notas" description="Crea tu primera nota para comenzar." actionText="Crear nota" [showAction]="true" [onActionClick]="createNote"> </cp-empty-state>

<!-- Para errores -->
<cp-empty-state icon="⚠️" title="Error al cargar datos" description="No se pudieron cargar los elementos. Intenta nuevamente." actionText="Reintentar" [showAction]="true" [onActionClick]="retry"> </cp-empty-state>
```

## 🎨 Patrones de Uso

### Loading States

#### Para listas/páginas

```html
@if (isLoading()) {
<cp-loader message="Cargando elementos..." size="medium" variant="primary"> </cp-loader>
}
```

#### Para formularios/acciones

```html
@if (isSaving()) {
<cp-loader message="Guardando..." size="small" [centered]="false"> </cp-loader>
}
```

#### Para modales/overlays

```html
@if (isProcessing()) {
<cp-loader message="Procesando solicitud..." size="large" [fullScreen]="true"> </cp-loader>
}
```

### Empty States

#### Para listas vacías

```html
@if (!isLoading() && items().length === 0) {
<cp-empty-state icon="📋" title="No hay elementos" description="Los elementos que agregues aparecerán aquí." actionText="Agregar elemento" [showAction]="true" [onActionClick]="addItem"> </cp-empty-state>
}
```

#### Para errores de carga

```html
@if (hasError()) {
<cp-empty-state icon="⚠️" title="Error al cargar" description="No se pudieron cargar los datos. Verifica tu conexión." actionText="Reintentar" [showAction]="true" [onActionClick]="reload"> </cp-empty-state>
}
```

## 🚀 Migración desde Componentes Personalizados

### Antes (Loading personalizado)

```html
<div class="flex justify-center items-center py-12">
  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  <p class="ml-4 text-gray-600">Cargando...</p>
</div>
```

### Después (LoaderComponent)

```html
<cp-loader message="Cargando..." size="large"></cp-loader>
```

### Antes (Empty state personalizado)

```html
<div class="text-center py-12">
  <div class="text-gray-400 text-6xl mb-4">🚗</div>
  <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes viajes</h3>
  <p class="text-gray-500">Cuando tengas viajes aparecerán aquí.</p>
</div>
```

### Después (EmptyStateComponent)

```html
<cp-empty-state icon="🚗" title="No tienes viajes" description="Cuando tengas viajes aparecerán aquí."> </cp-empty-state>
```

## ✅ Beneficios

1. **Consistencia**: Todos los estados de carga y vacíos se ven igual
2. **Mantenibilidad**: Un solo lugar para cambios de diseño
3. **Reutilización**: Componentes listos para usar en cualquier parte
4. **Accesibilidad**: Estados correctamente etiquetados para screen readers
5. **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
6. **Personalización**: Props suficientes para cubrir la mayoría de casos de uso

## 🎯 Mejores Prácticas

1. **Usar mensajes descriptivos**: "Cargando viajes..." mejor que "Cargando..."
2. **Elegir el tamaño adecuado**: `small` para acciones inline, `large` para páginas
3. **Considerar el contexto**: `variant="white"` para fondos oscuros
4. **Proveer acciones útiles**: Botones que realmente ayuden al usuario
5. **Mantener consistencia**: Usar los mismos iconos para el mismo tipo de contenido
