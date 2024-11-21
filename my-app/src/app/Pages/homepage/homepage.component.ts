import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import products from '../../../assets/products.json';

interface Image {
  name: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent implements OnInit{
  products: Image[] = [];

  ngOnInit(): void {
    this.products = products;
  }
}
