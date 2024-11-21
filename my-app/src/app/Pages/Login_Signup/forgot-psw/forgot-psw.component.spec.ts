import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPSWComponent } from './forgot-psw.component';

describe('ForgotPSWComponent', () => {
  let component: ForgotPSWComponent;
  let fixture: ComponentFixture<ForgotPSWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPSWComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPSWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
