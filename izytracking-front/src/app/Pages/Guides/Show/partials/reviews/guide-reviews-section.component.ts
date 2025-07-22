import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { GuideDetails } from "../../../../../Types/guide.types";
import { CardComponent } from "../../../../../Components/Card/card.component";

@Component({
    selector: 'cp-guide-reviews-section',
    template: `
        <cp-card title="Reseñas de Turistas" [variant]="'default'" [radius]="'lg'">
            @if (guideData().reviews && guideData().reviews!.length > 0) {
            <div class="reviews-content">
                @for (review of guideData().reviews!; track review.id) {
                <div class="review-item">
                    <div class="review-header">
                        <span class="reviewer-name">{{ review.touristName }}</span>
                        <span class="review-rating">⭐ {{ review.rating.toFixed(1) }}</span>
                    </div>
                    <p class="review-comment">{{ review.comment }}</p>
                    <span class="review-date">{{ review.date.toLocaleDateString() }}</span>
                </div>
                }
            </div>
            } @else {
            <p class="no-reviews">No hay reseñas disponibles</p>
            }
        </cp-card>
    `,
    styles: [`
        .reviews-content { display: flex; flex-direction: column; gap: 1rem; }
        .review-item { padding: 1rem; background: #f9fafb; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
        .review-header { display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem; }
        .reviewer-name { font-weight: 600; color: #374151; }
        .review-rating { color: #f59e0b; font-size: 0.875rem; }
        .review-comment { color: #6b7280; margin-bottom: 0.5rem; }
        .review-date { font-size: 0.75rem; color: #9ca3af; }
        .no-reviews { text-align: center; color: #6b7280; padding: 2rem; }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent],
})
export class GuideReviewsSectionComponent {
    guideData = input.required<GuideDetails>();
}
