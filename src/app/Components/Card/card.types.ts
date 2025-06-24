/**
 * Tipos para el componente Card
 */

// Variantes de estilo para la card
export type CardVariant =
    | 'default'     // Estilo por defecto
    | 'elevated'    // Con sombra elevada
    | 'outlined'    // Solo con borde
    | 'filled'      // Con fondo de color
    | 'ghost'       // Transparente
    | 'glass';      // Efecto glassmorphism

// Tamaños de la card
export type CardSize =
    | 'xs'          // Extra pequeña
    | 'sm'          // Pequeña
    | 'md'          // Mediana (por defecto)
    | 'lg'          // Grande
    | 'xl'          // Extra grande
    | 'full';       // Ancho completo

// Esquinas de la card
export type CardRadius =
    | 'none'        // Sin bordes redondeados
    | 'sm'          // Bordes ligeramente redondeados
    | 'md'          // Bordes moderadamente redondeados
    | 'lg'          // Bordes muy redondeados
    | 'xl'          // Bordes extra redondeados
    | 'full';       // Completamente redondeado

// Colores para las variantes filled
export type CardColor =
    | 'white'       // Blanco
    | 'gray'        // Gris
    | 'blue'        // Azul
    | 'green'       // Verde
    | 'yellow'      // Amarillo
    | 'red'         // Rojo
    | 'purple'      // Morado
    | 'indigo';     // Índigo

// Padding interno de la card
export type CardPadding =
    | 'none'        // Sin padding
    | 'sm'          // Padding pequeño
    | 'md'          // Padding mediano
    | 'lg'          // Padding grande
    | 'xl';         // Padding extra grande

// Estados de la card
export type CardState =
    | 'default'     // Estado normal
    | 'loading'     // Cargando
    | 'error'       // Error
    | 'success'     // Éxito
    | 'disabled';   // Deshabilitada

// Configuración del header
export interface CardHeaderConfig {
    show: boolean;
    title?: string;
    subtitle?: string;
    icon?: string;
    actions?: boolean;
}

// Configuración del footer
export interface CardFooterConfig {
    show: boolean;
    align: 'left' | 'center' | 'right' | 'between';
    variant: 'default' | 'minimal' | 'actions';
}

// Configuración completa de la card
export interface CardConfig {
    variant: CardVariant;
    size: CardSize;
    radius: CardRadius;
    color?: CardColor;
    padding: CardPadding;
    state: CardState;
    header: CardHeaderConfig;
    footer: CardFooterConfig;
    hoverable?: boolean;
    clickable?: boolean;
    shadow?: boolean;
    border?: boolean;
}

// Mapas de clases CSS
export interface CardClassMap {
    variant: Record<CardVariant, string>;
    size: Record<CardSize, string>;
    radius: Record<CardRadius, string>;
    color: Record<CardColor, string>;
    padding: Record<CardPadding, string>;
    state: Record<CardState, string>;
}

// Props para animaciones
export interface CardAnimationConfig {
    hover?: boolean;
    scale?: number;
    duration?: number;
    ease?: string;
}
