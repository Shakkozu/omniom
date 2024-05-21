import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Store } from '@ngxs/store';
import { ProductDeselected, ProductSelected } from '../../store/products-catalogue.actions';
import { ProductsCatalogueStore } from '../../store/products-catalogue.store';
import { CatalogueItem, CatalogueItemType } from '../../model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
  @Input() addButtonEnabled: boolean = false;
  @Input() selectionList: boolean = false;
  @ViewChild(MatSelectionList) selectedProductsList!: MatSelectionList;
  @ViewChild(MatSelectionList) notSelectedProductsList!: MatSelectionList;
  public products$: Observable<CatalogueItem[]> = this.store.select(ProductsCatalogueStore.products);
  public selectedProducts$: Observable<CatalogueItem[]> = this.store.select(ProductsCatalogueStore.selectedProducts);
  public notSelectedProducts$: Observable<CatalogueItem[]> = this.store.select(ProductsCatalogueStore.productsWithoutSelectedProducts);
  
  @Output() addProductButtonClicked: EventEmitter<CatalogueItem> = new EventEmitter<CatalogueItem>();
  @Output() productListChanged: EventEmitter<ProductListChangedEvent> = new EventEmitter<ProductListChangedEvent>();

  constructor (private store: Store) {}
  
  addProduct(product: CatalogueItem) {
    this.addProductButtonClicked.emit(product);
  }

  productDeselected($event: MatSelectionListChange) {
    const productId = $event.options[0].value;
    const selected = $event.options[0].selected;
    if(selected)
      return;

    this.store.dispatch(new ProductDeselected(productId));
    this.productListChanged.emit({ type: 'deselected', catalogueItemId: productId, itemType: CatalogueItemType.Product});
  }

  productSelected($event: MatSelectionListChange) {
    const productId = $event.options[0].value;
    const selected = $event.options[0].selected;
    if(!selected)
      return;

    this.store.dispatch(new ProductSelected(productId));
    this.productListChanged.emit({ type: 'selected', catalogueItemId: productId, itemType: CatalogueItemType.Product});
  }
}

export type ListChangeType = 'selected' | 'deselected';
export interface ProductListChangedEvent {
  type: ListChangeType;
  catalogueItemId: string;
  itemType: CatalogueItemType;
}


