import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CeilPipe } from '../../../pipe/ceil.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { addToFavoritesLocalStorage } from '../../../../utils/product';
import { AuthService } from '../../../service/auth.service';

interface Product {
  _id: string;
  images: string[];
  productName: string;
  material: string;
  price: number;
  productType: string;
  materialfilter: string;
  productCollection: string;
  productCode: string;
  discount: number; // New field for discount
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule, CeilPipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  visibleProducts: Product[] = [];
  productsToShow = 9;

  categories = ['Nhẫn', 'Vòng tay', 'Vòng cổ'];
  materials = ['Vàng', 'Vàng kim', 'Vàng hồng', 'Vàng trắng', 'Bạc sterling'];

  selectedCategories: { [key: string]: boolean } = {};
  selectedMaterials: { [key: string]: boolean } = {};
  selectedPrices: { [key: string]: boolean } = {};
  selectedCollections: { [key: string]: boolean } = {};
  productCollections: string[] = [];
  sortCriteria: string | null = null;
  showDiscounted = false; // New property for discount filter

  // Price range slider variables
  priceRange = { min: 500000, max: 100000000 };
  sliderOptions: Options = {
    floor: 500000,
    ceil: 100000000,
    step: 500000,
    translate: (value: number): string => {
      return value.toLocaleString('vi-VN') + ' VNĐ';
    },
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;

      // Extract unique product collections
      this.productCollections = [
        ...new Set(this.products.map((product) => product.productCollection)),
      ];

      this.updateVisibleProducts();
    });

    // Handle query parameters
    this.route.queryParams.subscribe((params) => {
      if (params['categories']) {
        const categories = Array.isArray(params['categories'])
          ? params['categories']
          : [params['categories']];
        categories.forEach(
          (category) => (this.selectedCategories[category] = true)
        );
      }

      if (params['materials']) {
        const materials = Array.isArray(params['materials'])
          ? params['materials']
          : [params['materials']];
        materials.forEach(
          (material) => (this.selectedMaterials[material] = true)
        );
      }

      if (params['collections']) {
        const collections = Array.isArray(params['collections'])
          ? params['collections']
          : [params['collections']];
        collections.forEach((collection) => {
          const decodedCollection = collection.replace(/-/g, ' '); // Replace '-' with space
          this.selectedCollections[decodedCollection] = true;
        });
      }

      if (params['sort']) {
        this.sortCriteria = params['sort'];
      }

      if (params['discount'] === 'true') {
        this.showDiscounted = true; // Enable discount filter
      }
      this.updateVisibleProducts();
    });
  }

  updateVisibleProducts() {
    const filteredProducts = this.products
      .filter(
        (product) =>
          (!this.showDiscounted || product.discount > 0) && // Apply discount filter
          (!this.isFilterActive(this.selectedCategories) ||
            this.selectedCategories[product.productType]) &&
          (!this.isFilterActive(this.selectedMaterials) ||
            this.selectedMaterials[product.materialfilter]) &&
          this.isProductWithinPriceRange(product.price) && // Use price range filter
          (!this.isFilterActive(this.selectedCollections) ||
            this.selectedCollections[product.productCollection])
      )
      .sort((a, b) => (this.sortCriteria ? this.compareByCriteria(a, b) : 0));

    this.visibleProducts = filteredProducts.slice(0, this.productsToShow);
  }

  isFilterActive(filter: { [key: string]: boolean }) {
    return Object.values(filter).some((isChecked) => isChecked);
  }

  isProductWithinPriceRange(price: number): boolean {
    const minPrice = this.priceRange.min; // Prefer input, fallback to slider
    const maxPrice = this.priceRange.max; // Prefer input, fallback to slider

    return price >= minPrice && price <= maxPrice;
  }

  loadMoreProducts() {
    this.productsToShow += 9;
    this.updateVisibleProducts();
  }

  onFilterChange() {
    this.productsToShow = 9;
    this.updateVisibleProducts();
    this.goToFilteredProducts({
      selectedCategories: this.selectedCategories,
      selectedMaterials: this.selectedMaterials,
      selectedCollections: this.selectedCollections,
      sortCriteria: this.sortCriteria, // Include sort criteria if any
    });
  }

  onPriceInputChange(): void {
    const floor = this.sliderOptions.floor ?? 500000; // Default to 500,000 if undefined
    const ceil = this.sliderOptions.ceil ?? 100000000; // Default to 100,000,000 if undefined

    if (this.minPriceInput !== null && this.minPriceInput < floor) {
      this.minPriceInput = floor;
    }

    if (this.maxPriceInput !== null && this.maxPriceInput > ceil) {
      this.maxPriceInput = ceil;
    }

    if (
      this.maxPriceInput !== null &&
      this.minPriceInput !== null &&
      this.maxPriceInput < this.minPriceInput
    ) {
      this.maxPriceInput = this.minPriceInput;
    }

    // Use fallback to slider values if inputs are null
    this.priceRange.min =
      this.minPriceInput !== null ? this.minPriceInput : this.priceRange.min;
    this.priceRange.max =
      this.maxPriceInput !== null ? this.maxPriceInput : this.priceRange.max;

    this.updateVisibleProducts();
  }

  minPriceInput: number | null = null;
  maxPriceInput: number | null = null;

  onMinPriceInputChange(newValue: number): void {
    console.log('Input value changed to:', newValue);
    this.updateVisibleProducts();
  }

  onMaxPriceInputChange(newValue: number): void {
    console.log('Input value changed to:', newValue);
    this.updateVisibleProducts();
  }

  goToFilteredProducts(selectedFilters: any) {
    // Ensure selectedCollections is not undefined or null
    const filteredCollections = selectedFilters.selectedCollections
      ? Object.keys(selectedFilters.selectedCollections)
          .filter((key) => selectedFilters.selectedCollections[key])
          .map((key) => key.replace(/ /g, '-')) // Replace spaces with '-'
      : [];

    this.router.navigate([], {
      queryParams: {
        // Handle selectedCategories safely
        categories: selectedFilters.selectedCategories
          ? Object.keys(selectedFilters.selectedCategories).filter(
              (key) => selectedFilters.selectedCategories[key]
            )
          : [],
        // Handle selectedMaterials safely
        materials: selectedFilters.selectedMaterials
          ? Object.keys(selectedFilters.selectedMaterials).filter(
              (key) => selectedFilters.selectedMaterials[key]
            )
          : [],
        // Handle selectedPrices safely
        prices: selectedFilters.selectedPrices
          ? Object.keys(selectedFilters.selectedPrices).filter(
              (key) => selectedFilters.selectedPrices[key]
            )
          : [],
        // Use filteredCollections
        collections: filteredCollections,
        // Handle sortCriteria safely
        sort: selectedFilters.sortCriteria || '',
        // Handle discount parameter safely
        discount: this.showDiscounted ? 'true' : null, // Add discount parameter
      },
    });
  }

  sortProducts(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const sortValue = selectElement.value;

    this.sortCriteria = sortValue;
    this.updateVisibleProducts();
  }

  compareByCriteria(a: Product, b: Product): number {
    if (this.sortCriteria === 'priceAsc') {
      return a.price - b.price;
    } else if (this.sortCriteria === 'priceDesc') {
      return b.price - a.price;
    }
    return 0;
  }

  goToDiscountedProducts() {
    this.router.navigate([], {
      queryParams: {
        discount: true,
      },
    });
  }

  goToProductDetail(productCode: string) {
    this.router.navigate(['/Products', productCode]);
  }

  likedProducts = new Set<string>(); // Use a Set to track liked product IDs

  // Update toggleHeart method to accept both the event and the product
  toggleHeart(event: Event, product: any) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.addToFavorites(product);
    } else {
      this.removeFromFavorites(product);
    }
  }
  addToFavorites(product: any): void {
    if (product) {
      if (this.authService.isUserLoggedIn()) {
        // Người dùng đã đăng nhập
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          const favoriteData = {
            userId: userId,
            productId: product._id,
          };
          this.productService.addFavoriteProduct(favoriteData).subscribe({
            next: (response) => {
              console.log('Thêm vào mục yêu thích thành công:', response);
              this.snackBar.open(
                'Sản phẩm đã được thêm vào mục yêu thích',
                'Đóng',
                {
                  duration: 3000,
                }
              );
            },
            error: (error) => {
              console.error('Thêm vào mục yêu thích thất bại:', error);
              this.snackBar.open(error.error.message, 'Đóng', {
                duration: 3000,
              });
            },
          });
        } else {
          console.error('Lỗi: Không tìm thấy userId');
        }
        //Người dùng chưa đăng nhập
      } else {
        addToFavoritesLocalStorage(product);
        this.snackBar.open('Đã thêm vào mục yêu thích', 'Đóng', {
          duration: 3000,
        });
      }
    } else {
      console.error('Sản phẩm không tồn tại!');
    }
  }
  removeFromFavorites(product: any): void {
    if (this.authService.isUserLoggedIn()) {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        const favoriteData = { userId: userId, productId: product._id };
        this.productService.removefavoriteProduct(favoriteData).subscribe({
          next: () => {
            console.log(
              `Sản phẩm ${product.productName} đã được xóa khỏi mục yêu thích`
            );
            this.snackBar.open(
              'Sản phẩm đã được xóa khỏi mục yêu thích',
              'Đóng',
              {
                duration: 3000,
              }
            );
          },
          error: (error) => {
            console.error('Xóa khỏi mục yêu thích thất bại:', error);
            this.snackBar.open('Có lỗi xảy ra, vui lòng thử lại!', 'Đóng', {
              duration: 3000,
            });
          },
        });
      }
    } else {
      // Xóa khỏi LocalStorage
      const favoriteList = localStorage.getItem('favorites');
      let favorites = favoriteList ? JSON.parse(favoriteList) : [];
      favorites = favorites.filter(
        (item: any) => item.productId !== product.productId
      );
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log(
        `Sản phẩm ${product.productName} đã được xóa khỏi LocalStorage`
      );
      this.snackBar.open('Sản phẩm đã được xóa khỏi mục yêu thích', 'Đóng', {
        duration: 3000,
      });
    }
  }
}
