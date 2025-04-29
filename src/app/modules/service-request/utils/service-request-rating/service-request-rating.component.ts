import { Component, input } from '@angular/core';

@Component({
  selector: 'app-service-request-rating',
  imports: [],
  templateUrl: './service-request-rating.component.html',
  styleUrl: './service-request-rating.component.css',
})
export class ServiceRequestRatingComponent {
  ratings = input<number>();
  ratingArray: number[] = Array(this.ratings()).fill(0);
}
