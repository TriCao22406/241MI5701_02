import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [ProductsComponent, CommonModule],
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css'],
})
export class CollectionDetailComponent implements OnInit, OnDestroy {
  filteredCollection: any = null; // Or use an interface for better type safety
  private unsubscribe$ = new Subject<void>(); // The Subject to manage unsubscriptions

  constructor(
    private collectionService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
          if (params['collections']) {
              const decodedCollection = params['collections'].replace(/-/g, ' ');
              this.collectionService.getCollection().subscribe(data => {
                  this.filteredCollection = data.find(item => item.CollectionName2 === decodedCollection) || null;
                  console.log(this.filteredCollection)
              });
          }
      });
  }
  

  ngOnDestroy(): void {
    // Emit a value to unsubscribe from all active subscriptions
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
