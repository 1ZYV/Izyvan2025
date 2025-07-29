import { NgClass } from "@angular/common";
import { Component, input, computed } from "@angular/core";
import {
    BadgeVariant,
    BadgeSize,
    BadgeStyle,
    BadgeShape,
    BadgeClassMap,
    BadgeSizeClassMap,
    BadgeShapeClassMap
} from "./badge.types";

/**
 * Badge Component
 * 
 * Un componente de badge versátil con múltiples variantes, tamaños, estilos y formas.
 * 
 * @example
 * ```html
 * <!-- Uso básico -->
 * <cp-badge label="Nuevo" />
 * 
 * <!-- Con variante y tamaño -->
 * <cp-badge label="Éxito" variant="success" size="lg" />
 * 
 * <!-- Estilo outline -->
 * <cp-badge label="Advertencia" variant="warning" style="outline" />
 * 
 * <!-- Estilo suave -->
 * <cp-badge label="Info" variant="info" style="soft" />
 * 
 * <!-- Forma de píldora -->
 * <cp-badge label="Notificación" variant="danger" shape="pill" />
 * 
 * <!-- Con animación -->
 * <cp-badge label="Activo" variant="success" animate="true" />
 * 
 * <!-- Con clases personalizadas -->
 * <cp-badge label="Custom" variant="primary" classList="shadow-lg" />
 * 
 * <!-- Tamaños disponibles -->
 * <cp-badge label="XS" size="xs" />
 * <cp-badge label="SM" size="sm" />
 * <cp-badge label="MD" size="md" />
 * <cp-badge label="LG" size="lg" />
 * <cp-badge label="XL" size="xl" />
 * 
 * <!-- Variantes de color -->
 * <cp-badge label="Primary" variant="primary" />
 * <cp-badge label="Secondary" variant="secondary" />
 * <cp-badge label="Success" variant="success" />
 * <cp-badge label="Warning" variant="warning" />
 * <cp-badge label="Danger" variant="danger" />
 * <cp-badge label="Info" variant="info" />
 * <cp-badge label="Light" variant="light" />
 * <cp-badge label="Dark" variant="dark" />
 * 
 * <!-- Estilos disponibles -->
 * <cp-badge label="Filled" style="filled" />
 * <cp-badge label="Outline" style="outline" />
 * <cp-badge label="Soft" style="soft" />
 * <cp-badge label="Ghost" style="ghost" />
 * ```
 */
@Component({
    selector: 'cp-badge',
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.css',
    standalone: true,
    imports: [NgClass],
})

export class BadgeComponent {
    // Propiedades de entrada para el badge
    label = input<string>('Badge');
    variant = input<BadgeVariant>('primary');
    size = input<BadgeSize>('md');
    style = input<BadgeStyle>('filled');
    shape = input<BadgeShape>('rounded');
    animate = input<boolean>(false);
    dismissible = input<boolean>(false);
    classList = input<string>(''); // Clases CSS adicionales

    // Computed property para generar las clases CSS
    badgeClasses = computed(() => {
        const baseClasses = 'inline-flex items-center justify-center font-medium cp-badge';
        const variantClasses = this.getVariantClasses();
        const sizeClasses = this.getSizeClasses();
        const shapeClasses = this.getShapeClasses();
        const animationClasses = this.animate() ? 'transition-all duration-200 ease-in-out' : '';
        const additionalClasses = this.classList();

        return `${baseClasses} ${variantClasses} ${sizeClasses} ${shapeClasses} ${animationClasses} ${additionalClasses}`.trim();
    }); constructor() { }

    private getVariantClasses(): string {
        const styleType = this.style();
        const variant = this.variant();

        // Mapas de clases completos para cada estilo
        const classMap: BadgeClassMap = {
            filled: {
                primary: 'bg-blue-500 text-white',
                secondary: 'bg-gray-500 text-white',
                success: 'bg-green-500 text-white',
                warning: 'bg-yellow-500 text-black',
                danger: 'bg-red-500 text-white',
                info: 'bg-cyan-500 text-white',
                light: 'bg-gray-100 text-gray-800',
                dark: 'bg-gray-900 text-white'
            },
            outline: {
                primary: 'border border-blue-500 text-blue-500 bg-transparent',
                secondary: 'border border-gray-500 text-gray-500 bg-transparent',
                success: 'border border-green-500 text-green-500 bg-transparent',
                warning: 'border border-yellow-500 text-yellow-600 bg-transparent',
                danger: 'border border-red-500 text-red-500 bg-transparent',
                info: 'border border-cyan-500 text-cyan-500 bg-transparent',
                light: 'border border-gray-300 text-gray-600 bg-transparent',
                dark: 'border border-gray-700 text-gray-700 bg-transparent'
            },
            soft: {
                primary: 'bg-blue-100 text-blue-800',
                secondary: 'bg-gray-100 text-gray-800',
                success: 'bg-green-100 text-green-800',
                warning: 'bg-yellow-100 text-yellow-800',
                danger: 'bg-red-100 text-red-800',
                info: 'bg-cyan-100 text-cyan-800',
                light: 'bg-gray-50 text-gray-700',
                dark: 'bg-gray-200 text-gray-900'
            },
            ghost: {
                primary: 'text-blue-500 bg-transparent hover:bg-blue-50',
                secondary: 'text-gray-500 bg-transparent hover:bg-gray-50',
                success: 'text-green-500 bg-transparent hover:bg-green-50',
                warning: 'text-yellow-600 bg-transparent hover:bg-yellow-50',
                danger: 'text-red-500 bg-transparent hover:bg-red-50',
                info: 'text-cyan-500 bg-transparent hover:bg-cyan-50',
                light: 'text-gray-400 bg-transparent hover:bg-gray-50',
                dark: 'text-gray-700 bg-transparent hover:bg-gray-100'
            }
        };

        return classMap[styleType][variant];
    }

    private getSizeClasses(): string {
        const sizeMap: BadgeSizeClassMap = {
            xs: 'px-1.5 py-0.5 text-xs',
            sm: 'px-2 py-1 text-xs',
            md: 'px-3 py-1 text-sm',
            lg: 'px-4 py-2 text-base',
            xl: 'px-5 py-2.5 text-lg'
        };
        return sizeMap[this.size()];
    }

    private getShapeClasses(): string {
        const shapeMap: BadgeShapeClassMap = {
            rounded: 'rounded-md',
            pill: 'rounded-full',
            square: 'rounded-none'
        };
        return shapeMap[this.shape()];
    }
}