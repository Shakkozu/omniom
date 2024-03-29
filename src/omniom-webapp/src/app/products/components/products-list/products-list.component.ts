import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetailsDescription } from '../../model';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
  @Input() products$!: Observable<ProductDetailsDescription[]>;
  @Input() addButtonEnabled: boolean = false;
  @Input() selectionList: boolean = false;
  @ViewChild(MatSelectionList) selectedProductsList!: MatSelectionList;
  
  @Output() addProductButtonClicked: EventEmitter<ProductDetailsDescription> = new EventEmitter<ProductDetailsDescription>();
  @Output() catalogueSelectionChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  
  addProduct(product: ProductDetailsDescription) {
    this.addProductButtonClicked.emit(product);
  }

  onSelectionChange($event: MatSelectionListChange) {
    this.catalogueSelectionChanged.emit(this.selectedProductsList.selectedOptions.selected.map(option => option.value));
  }
}

