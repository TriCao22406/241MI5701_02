import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteProductComponent } from './favorite-product.component';

describe('FavoriteProductComponent', () => {
  let component: FavoriteProductComponent;
  let fixture: ComponentFixture<FavoriteProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
