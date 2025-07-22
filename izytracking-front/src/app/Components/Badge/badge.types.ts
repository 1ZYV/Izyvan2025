/**
 * Tipos para el componente Badge
 */

// Variantes de color del badge
export type BadgeVariant =
    | 'primary'     // Azul principal
    | 'secondary'   // Gris secundario
    | 'success'     // Verde éxito
    | 'warning'     // Amarillo advertencia
    | 'danger'      // Rojo peligro/error
    | 'info'        // Cian información
    | 'light'       // Claro
    | 'dark';       // Oscuro

// Tamaños del badge
export type BadgeSize =
    | 'xs'          // Extra pequeño
    | 'sm'          // Pequeño
    | 'md'          // Mediano (por defecto)
    | 'lg'          // Grande
    | 'xl';         // Extra grande

// Estilos de presentación del badge
export type BadgeStyle =
    | 'filled'      // Relleno sólido
    | 'outline'     // Solo borde
    | 'soft'        // Fondo suave con texto de color
    | 'ghost';      // Transparente con texto de color

// Forma del badge
export type BadgeShape =
    | 'rounded'     // Bordes redondeados (por defecto)
    | 'pill'        // Completamente redondeado
    | 'square';     // Bordes cuadrados

// Posición del badge cuando se usa como overlay
export type BadgePosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left';

// Configuración completa del badge
export interface BadgeConfig {
    variant: BadgeVariant;
    size: BadgeSize;
    style: BadgeStyle;
    shape: BadgeShape;
    position?: BadgePosition;
    customClasses?: string;
    animate?: boolean;
    dismissible?: boolean;
}

// Mapas de clases CSS para cada variante y estilo
export interface BadgeClassMap {
    filled: Record<BadgeVariant, string>;
    outline: Record<BadgeVariant, string>;
    soft: Record<BadgeVariant, string>;
    ghost: Record<BadgeVariant, string>;
}

// Mapas de clases CSS para tamaños
export type BadgeSizeClassMap = Record<BadgeSize, string>;

// Mapas de clases CSS para formas
export type BadgeShapeClassMap = Record<BadgeShape, string>;
