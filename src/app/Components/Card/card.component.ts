import { NgTemplateOutlet, NgClass } from "@angular/common";
import { Component, contentChild, input, output, signal, computed, TemplateRef } from "@angular/core";
import {
    CardVariant,
    CardSize,
    CardRadius,
    CardColor,
    CardPadding,
    CardState,
    CardHeaderConfig,
    CardFooterConfig,
    CardClassMap
} from "./card.types";

/**
 * Card Component
 * 
 * Un componente de tarjeta flexible y personalizable con múltiples variantes y estilos.
 * 
 * @example
 * ```html
 * <!-- Uso básico -->
 * <cp-card title="Mi Tarjeta">
 *   <p>Contenido de la tarjeta</p>
 * </cp-card>
 * 
 * <!-- Con variante y tamaño -->
 * <cp-card title="Elevada" variant="elevated" size="lg">
 *   <p>Tarjeta con sombra elevada</p>
 * </cp-card>
 * 
 * <!-- Con color y bordes redondeados -->
 * <cp-card title="Colorida" variant="filled" color="blue" radius="lg">
 *   <p>Tarjeta con fondo azul</p>
 * </cp-card>
 * 
 * <!-- Interactiva -->
 * <cp-card title="Clickeable" hoverable="true" clickable="true">
 *   <p>Tarjeta con efectos hover</p>
 * </cp-card>
 * 
 * <!-- Con templates personalizados -->
 * <cp-card>
 *   <ng-template #headerSlot>
 *     <div class="flex items-center gap-2">
 *       <icon name="star" />
 *       <span>Header Personalizado</span>
 *     </div>
 *   </ng-template>
 *   
 *   <p>Contenido principal</p>
 *   
 *   <ng-template #footerSlot>
 *     <div class="flex justify-end gap-2">
 *       <button>Cancelar</button>
 *       <button>Aceptar</button>
 *     </div>
 *   </ng-template>
 * </cp-card>
 * ```
 */
@Component({
    selector: 'cp-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.css',
    standalone: true,
    imports: [NgTemplateOutlet, NgClass],
})

export class CardComponent {
    // Propiedades básicas
    title = input<string>('');
    subtitle = input<string>('');

    // Propiedades de estilo
    variant = input<CardVariant>('default');
    size = input<CardSize>('md');
    radius = input<CardRadius>('md');
    color = input<CardColor>('white');
    padding = input<CardPadding>('md');

    // Propiedades de estado
    state = input<CardState>('default');
    loading = input<boolean>(false);
    disabled = input<boolean>(false);

    // Propiedades interactivas
    hoverable = input<boolean>(false);
    clickable = input<boolean>(false);

    // Propiedades de configuración
    showHeader = input<boolean>(true);
    showFooter = input<boolean>(true);
    footerAlign = input<'left' | 'center' | 'right' | 'between'>('right');

    // Clases CSS adicionales
    classList = input<string>('');

    // Propiedades del footer legacy (mantener compatibilidad)
    actionLabel = input('Ver detalles');

    hasActions = input<boolean>(false);

    // Estado interno con señales
    isProcessing = signal(false);

    // Outputs
    actionClicked = output<void>();
    cardClicked = output<void>();

    // Slots con contentChild (nueva API)
    headerTemplate = contentChild<TemplateRef<unknown>>('headerSlot');
    footerTemplate = contentChild<TemplateRef<unknown>>('footerSlot');

    // Computed property para generar las clases CSS
    cardClasses = computed(() => {
        const baseClasses = 'cp-card';
        const variantClasses = this.getVariantClasses();
        const sizeClasses = this.getSizeClasses();
        const radiusClasses = this.getRadiusClasses();
        const paddingClasses = this.getPaddingClasses();
        const stateClasses = this.getStateClasses();
        const interactiveClasses = this.getInteractiveClasses();
        const additionalClasses = this.classList();

        return `${baseClasses} ${variantClasses} ${sizeClasses} ${radiusClasses} ${paddingClasses} ${stateClasses} ${interactiveClasses} ${additionalClasses}`.trim();
    });

    // Computed property para clases del footer
    footerClasses = computed(() => {
        return `card-footer align-${this.footerAlign()}`;
    });
    constructor() { }

    // Métodos de eventos
    async handleAction() {
        this.isProcessing.set(true);
        this.actionClicked.emit();
        // Simular operación asíncrona
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.isProcessing.set(false);
    }

    onCardClick() {
        if (this.clickable() && !this.disabled() && !this.loading()) {
            this.cardClicked.emit();
        }
    }

    // Métodos privados para generar clases CSS
    private getVariantClasses(): string {
        const classMap: Record<CardVariant, string> = {
            default: 'bg-white border border-gray-200 shadow-sm',
            elevated: 'bg-white border border-gray-100 shadow-lg',
            outlined: 'bg-transparent border-2 border-gray-300',
            filled: this.getFilledColorClasses(),
            ghost: 'bg-transparent border-0 shadow-none',
            glass: 'glass backdrop-blur-sm border border-white/20'
        };
        return classMap[this.variant()];
    }

    private getFilledColorClasses(): string {
        const colorMap: Record<CardColor, string> = {
            white: 'bg-white text-gray-900',
            gray: 'bg-gray-100 text-gray-900',
            blue: 'bg-blue-50 text-blue-900 border-blue-200',
            green: 'bg-green-50 text-green-900 border-green-200',
            yellow: 'bg-yellow-50 text-yellow-900 border-yellow-200',
            red: 'bg-red-50 text-red-900 border-red-200',
            purple: 'bg-purple-50 text-purple-900 border-purple-200',
            indigo: 'bg-indigo-50 text-indigo-900 border-indigo-200'
        };
        return colorMap[this.color()];
    }

    private getSizeClasses(): string {
        const sizeMap: Record<CardSize, string> = {
            xs: 'max-w-xs',
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            full: 'w-full'
        };
        return sizeMap[this.size()];
    }

    private getRadiusClasses(): string {
        const radiusMap: Record<CardRadius, string> = {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            full: 'rounded-full'
        };
        return radiusMap[this.radius()];
    }

    private getPaddingClasses(): string {
        const paddingMap: Record<CardPadding, string> = {
            none: '[&_.card-header]:p-0 [&_.card-body]:p-0 [&_.card-footer]:p-0',
            sm: '[&_.card-header]:p-3 [&_.card-body]:p-3 [&_.card-footer]:p-3',
            md: '[&_.card-header]:p-4 [&_.card-body]:p-4 [&_.card-footer]:p-4',
            lg: '[&_.card-header]:p-6 [&_.card-body]:p-6 [&_.card-footer]:p-6',
            xl: '[&_.card-header]:p-8 [&_.card-body]:p-8 [&_.card-footer]:p-8'
        };
        return paddingMap[this.padding()];
    }

    private getStateClasses(): string {
        const currentState = this.loading() ? 'loading' :
            this.disabled() ? 'disabled' :
                this.state();

        const stateMap: Record<CardState, string> = {
            default: '',
            loading: 'loading',
            error: 'error',
            success: 'success',
            disabled: 'disabled'
        };
        return stateMap[currentState];
    }

    private getInteractiveClasses(): string {
        const classes: string[] = [];

        if (this.hoverable()) {
            classes.push('hoverable');
        }

        if (this.clickable()) {
            classes.push('clickable');
        }

        return classes.join(' ');
    }
}