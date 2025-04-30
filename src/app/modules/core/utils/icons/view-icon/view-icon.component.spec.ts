import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIconComponent } from './view-icon.component';

describe('ViewIconComponent', () => {
  let component: ViewIconComponent;
  let fixture: ComponentFixture<ViewIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
