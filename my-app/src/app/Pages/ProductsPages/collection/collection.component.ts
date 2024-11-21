import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'] // Fixed typo: changed `styleUrl` to `styleUrls`
})
export class CollectionComponent implements OnInit {
  collection: any[] = [];

  constructor(
    private collectionService: ProductService,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    this.collectionService.getCollection().subscribe(data => {
      this.collection = data;
    });
  }

  // Navigate to the selected collection
  goToCollection(collectionName: string): void {
    console.log('Navigating to collection:', collectionName);
    this.router.navigate(['/Collections', collectionName], {
      queryParams: { collections: collectionName }
    });
  }

  replaceSpacesWithHyphen(value: string): string {
    return value.replace(/\s+/g, '-');
  }
  
}
