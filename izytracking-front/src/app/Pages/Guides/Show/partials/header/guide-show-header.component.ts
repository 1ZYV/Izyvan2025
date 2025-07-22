import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'cp-guide-show-header',
    templateUrl: './guide-show-header.component.html',
    styleUrl: './guide-show-header.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class GuideShowHeaderComponent {
    // Inputs
    guideName = input<string>('');
    guideId = input<string>('');
    isLoading = input<boolean>(false);

    // Outputs
    backToGuides = output<void>();

    onBackClick(): void {
        this.backToGuides.emit();
    }
}
