import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyTariffComponent } from './modify-tariff.component';

describe('ModifyTariffComponent', () => {
  let component: ModifyTariffComponent;
  let fixture: ComponentFixture<ModifyTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyTariffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
