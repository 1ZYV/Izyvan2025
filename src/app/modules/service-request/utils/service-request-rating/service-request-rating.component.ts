import { Component, input } from '@angular/core';

@Component({
  selector: 'app-service-request-rating',
  imports: [],
  templateUrl: './service-request-rating.component.html',
  styleUrl: './service-request-rating.component.css',
})
export class ServiceRequestRatingComponent {
  ratings = input<number>(0); // Default value is 0
  ratingArray: number[] = [];

  ngOnInit() {
    this.updateRatingArray();
  }

  updateRatingArray() {
    this.ratingArray = Array.from({ length: this.ratings() }, (_, i) => i + 1);
  }
}
