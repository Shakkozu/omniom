import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetailsDescription } from '../../model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
  @Input() products$!: Observable<ProductDetailsDescription[]>;
  @Input() addButtonEnabled: boolean = false;

  @Output() addProductButtonClicked: EventEmitter<ProductDetailsDescription> = new EventEmitter<ProductDetailsDescription>();
  
  addProduct(product: ProductDetailsDescription) {
    this.addProductButtonClicked.emit(product);
  }
}

