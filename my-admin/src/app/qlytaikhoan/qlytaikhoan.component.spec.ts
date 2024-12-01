import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlytaikhoanComponent } from './qlytaikhoan.component';

describe('QlytaikhoanComponent', () => {
  let component: QlytaikhoanComponent;
  let fixture: ComponentFixture<QlytaikhoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QlytaikhoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QlytaikhoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
