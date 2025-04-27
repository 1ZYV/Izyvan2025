import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServiceRequestComponent } from './list-service-request.component';

describe('ListServiceRequestComponent', () => {
  let component: ListServiceRequestComponent;
  let fixture: ComponentFixture<ListServiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListServiceRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
