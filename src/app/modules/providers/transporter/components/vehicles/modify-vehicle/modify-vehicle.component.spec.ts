import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyVehicleComponent } from './modify-vehicle.component';

describe('ModifyVehicleComponent', () => {
  let component: ModifyVehicleComponent;
  let fixture: ComponentFixture<ModifyVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
