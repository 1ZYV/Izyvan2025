import { Component, input } from '@angular/core';

@Component({
    selector: 'cp-empty-state',
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.css',
    standalone: true
})
export class EmptyStateComponent {
    // Props usando input()
    icon = input<string>('📋');
    title = input<string>('No hay datos');
    description = input<string>('No se encontraron elementos para mostrar.');
    actionText = input<string | undefined>(undefined);
    showAction = input<boolean>(false);

    // Events (mantenemos como input por ahora, puede ser output después)
    onActionClick = input<(() => void) | undefined>(undefined);

    onAction(): void {
        const clickHandler = this.onActionClick();
        if (clickHandler) {
            clickHandler();
        }
    }
}
