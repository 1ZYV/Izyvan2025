import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestRatingComponent } from './service-request-rating.component';

describe('ServiceRequestRatingComponent', () => {
  let component: ServiceRequestRatingComponent;
  let fixture: ComponentFixture<ServiceRequestRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
