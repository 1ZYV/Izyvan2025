import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTariffsComponent } from './list-tariffs.component';

describe('ListTariffsComponent', () => {
  let component: ListTariffsComponent;
  let fixture: ComponentFixture<ListTariffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTariffsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
