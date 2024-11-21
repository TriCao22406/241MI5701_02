import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyHistoryComponent } from './buy-history.component';

describe('BuyHistoryComponent', () => {
  let component: BuyHistoryComponent;
  let fixture: ComponentFixture<BuyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
