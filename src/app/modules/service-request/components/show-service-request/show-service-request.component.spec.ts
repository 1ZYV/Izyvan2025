import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowServiceRequestComponent } from './show-service-request.component';

describe('ShowServiceRequestComponent', () => {
  let component: ShowServiceRequestComponent;
  let fixture: ComponentFixture<ShowServiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowServiceRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
