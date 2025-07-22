import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { GuideDetails } from "../../../../../Types/guide.types";
import { CardComponent } from "../../../../../Components/Card/card.component";

@Component({
    selector: 'cp-guide-portfolio-section',
    template: `
        <cp-card title="Portafolio" [variant]="'default'" [radius]="'lg'">
            @if (guideData().portfolio && guideData().portfolio!.length > 0) {
            <div class="portfolio-content">
                @for (photo of guideData().portfolio!; track photo) {
                <div class="portfolio-item">
                    <img [src]="photo" alt="Portafolio" class="portfolio-image" />
                </div>
                }
            </div>
            } @else {
            <p class="no-portfolio">No hay fotos de portafolio disponibles</p>
            }
        </cp-card>
    `,
    styles: [`
        .portfolio-content { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .portfolio-item { border-radius: 0.5rem; overflow: hidden; }
        .portfolio-image { width: 100%; height: 150px; object-fit: cover; border-radius: 0.5rem; }
        .no-portfolio { text-align: center; color: #6b7280; padding: 2rem; }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent],
})
export class GuidePortfolioSectionComponent {
    guideData = input.required<GuideDetails>();
}
