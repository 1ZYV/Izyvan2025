import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBillingsComponent } from './list-billings.component';

describe('ListBillingsComponent', () => {
  let component: ListBillingsComponent;
  let fixture: ComponentFixture<ListBillingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBillingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBillingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
