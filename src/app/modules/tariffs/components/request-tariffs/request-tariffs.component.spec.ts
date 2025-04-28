import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTariffsComponent } from './request-tariffs.component';

describe('RequestTariffsComponent', () => {
  let component: RequestTariffsComponent;
  let fixture: ComponentFixture<RequestTariffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTariffsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
