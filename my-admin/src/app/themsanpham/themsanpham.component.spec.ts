import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemsanphamComponent } from './themsanpham.component';

describe('ThemsanphamComponent', () => {
  let component: ThemsanphamComponent;
  let fixture: ComponentFixture<ThemsanphamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemsanphamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemsanphamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
