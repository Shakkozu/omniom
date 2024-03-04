import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
  @Input() products!: Product[];
  @Input() addButtonEnabled: boolean = false;

  @Output() addProductButtonClicked: EventEmitter<Product> = new EventEmitter<Product>();
  
  addProduct(product: Product) {
    this.addProductButtonClicked.emit(product);
  }
}

