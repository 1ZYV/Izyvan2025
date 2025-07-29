import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { GuideDetails } from "../../../../../Types/guide.types";
import { CardComponent } from "../../../../../Components/Card/card.component";

@Component({
    selector: 'cp-guide-profile-section',
    templateUrl: './guide-profile-section.component.html',
    styleUrl: './guide-profile-section.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent],
})
export class GuideProfileSectionComponent {
    // Inputs
    guideData = input.required<GuideDetails>();
}
