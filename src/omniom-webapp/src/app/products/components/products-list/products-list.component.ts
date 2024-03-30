import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetailsDescription } from '../../model';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Store } from '@ngxs/store';
import { FetchProducts } from '../../store/products-catalogue.actions';
import { ProductsCatalogueStore } from '../../store/products-catalogue.store';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
  @Input() addButtonEnabled: boolean = false;
  @Input() selectionList: boolean = false;
  @ViewChild(MatSelectionList) selectedProductsList!: MatSelectionList;
  public products$: Observable<ProductDetailsDescription[]> = this.store.select(ProductsCatalogueStore.products);
  public productsWithSelectedProductsOnTop$: Observable<ProductDetailsDescription[]> = this.store.select(ProductsCatalogueStore.productsWithSelectedProductsOnTop);
  
  @Output() addProductButtonClicked: EventEmitter<ProductDetailsDescription> = new EventEmitter<ProductDetailsDescription>();
  @Output() catalogueSelectionChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor (private store: Store) {
  }
  
  addProduct(product: ProductDetailsDescription) {
    this.addProductButtonClicked.emit(product);
  }

  onSelectionChange($event: MatSelectionListChange) {
    this.catalogueSelectionChanged.emit(this.selectedProductsList.selectedOptions.selected.map(option => option.value));
  }
}

