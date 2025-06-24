import { Component, input, output } from "@angular/core";

@Component({
    selector: 'cp-travel-show-header',
    templateUrl: './travel-show-header.component.html',
    styleUrl: './travel-show-header.component.css',
    standalone: true,
    imports: [],
})
export class TravelShowHeaderComponent {
    // Inputs
    travelNameReference = input<string>('');
    travelId = input<string>('');
    isLoading = input<boolean>(false);

    // Outputs
    backToTravels = output<void>();

    onBackClick(): void {
        this.backToTravels.emit();
    }
}
