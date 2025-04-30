import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentServiceRequestComponent } from './recent-service-request.component';

describe('RecentServiceRequestComponent', () => {
  let component: RecentServiceRequestComponent;
  let fixture: ComponentFixture<RecentServiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentServiceRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
