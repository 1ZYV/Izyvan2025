import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyGuideComponent } from './modify-guide.component';

describe('ModifyGuideComponent', () => {
  let component: ModifyGuideComponent;
  let fixture: ComponentFixture<ModifyGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
