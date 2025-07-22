import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectableOption {
    id: string;
    title: string;
    description: string;
    icon: string;
    price?: number;
    metadata?: any;
}

@Component({
    selector: 'cp-selectable-card',
    templateUrl: './selectable-card.component.html',
    styleUrl: './selectable-card.component.css',
    standalone: true,
    imports: [CommonModule]
})
export class SelectableCardComponent {
    // Inputs
    option = input.required<SelectableOption>();
    isSelected = input<boolean>(false);
    showPrice = input<boolean>(true);
    disabled = input<boolean>(false);
    size = input<'sm' | 'md' | 'lg'>('md');

    // Outputs
    optionSelected = output<SelectableOption>();

    // Computed properties
    cardClasses = computed(() => {
        const baseClasses = ['selectable-card'];

        if (this.isSelected()) {
            baseClasses.push('selected');
        }

        if (this.disabled()) {
            baseClasses.push('disabled');
        }

        baseClasses.push(`size-${this.size()}`);

        return baseClasses.join(' ');
    });

    // Methods
    onCardClick(): void {
        if (!this.disabled()) {
            this.optionSelected.emit(this.option());
        }
    }
}
