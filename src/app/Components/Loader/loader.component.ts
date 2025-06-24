import { Component, input, computed } from '@angular/core';

export type LoaderSize = 'small' | 'medium' | 'large';
export type LoaderVariant = 'primary' | 'secondary' | 'white';

@Component({
    selector: 'cp-loader',
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.css',
    standalone: true
})
export class LoaderComponent {
    // Props usando input()
    message = input<string>('Cargando...');
    size = input<LoaderSize>('medium');
    variant = input<LoaderVariant>('primary');
    fullScreen = input<boolean>(false);
    showMessage = input<boolean>(true);
    centered = input<boolean>(true);

    // Computed properties para clases CSS
    spinnerClasses = computed(() => {
        const baseClasses = 'border-solid border-t-transparent rounded-full animate-spin';
        const sizeClasses = {
            small: 'w-4 h-4 border-2',
            medium: 'w-8 h-8 border-2',
            large: 'w-12 h-12 border-4'
        };
        const variantClasses = {
            primary: 'border-blue-200 border-t-blue-600',
            secondary: 'border-gray-200 border-t-gray-600',
            white: 'border-white/30 border-t-white'
        };

        return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]}`;
    });

    containerClasses = computed(() => {
        let classes = 'flex items-center gap-3';

        if (this.centered()) {
            classes += ' justify-center';
        }

        if (this.fullScreen()) {
            classes += ' fixed inset-0 bg-white/90 backdrop-blur-sm z-50';
        }

        return classes;
    });

    messageClasses = computed(() => {
        const variantClasses = {
            primary: 'text-gray-600',
            secondary: 'text-gray-500',
            white: 'text-white'
        };

        return `text-sm font-medium ${variantClasses[this.variant()]}`;
    });
}
