import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IServiceclearComponent } from './iserviceclear.component';

describe('IServiceclearComponent', () => {
  let component: IServiceclearComponent;
  let fixture: ComponentFixture<IServiceclearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IServiceclearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IServiceclearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
