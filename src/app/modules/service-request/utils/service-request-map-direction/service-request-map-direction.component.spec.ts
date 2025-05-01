import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestMapDirectionComponent } from './service-request-map-direction.component';

describe('ServiceRequestMapDirectionComponent', () => {
  let component: ServiceRequestMapDirectionComponent;
  let fixture: ComponentFixture<ServiceRequestMapDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestMapDirectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestMapDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
