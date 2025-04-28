import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTariffComponent } from './create-tariff.component';

describe('CreateTariffComponent', () => {
  let component: CreateTariffComponent;
  let fixture: ComponentFixture<CreateTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTariffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
