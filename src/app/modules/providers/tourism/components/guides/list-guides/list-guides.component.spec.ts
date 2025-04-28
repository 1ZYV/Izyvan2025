import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGuidesComponent } from './list-guides.component';

describe('ListGuidesComponent', () => {
  let component: ListGuidesComponent;
  let fixture: ComponentFixture<ListGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGuidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
