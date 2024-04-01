import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetailsDescription } from '../../model';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Store } from '@ngxs/store';
import { ProductDeselected, ProductSelected } from '../../store/products-catalogue.actions';
import { ProductsCatalogueStore } from '../../store/products-catalogue.store';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
  @Input() addButtonEnabled: boolean = false;
  @Input() selectionList: boolean = false;
  @ViewChild(MatSelectionList) selectedProductsList!: MatSelectionList;
  @ViewChild(MatSelectionList) notSelectedProductsList!: MatSelectionList;
  public products$: Observable<ProductDetailsDescription[]> = this.store.select(ProductsCatalogueStore.products);
  public selectedProducts$: Observable<ProductDetailsDescription[]> = this.store.select(ProductsCatalogueStore.selectedProducts);
  public notSelectedProducts$: Observable<ProductDetailsDescription[]> = this.store.select(ProductsCatalogueStore.productsWithoutSelectedProducts);
  
  @Output() addProductButtonClicked: EventEmitter<ProductDetailsDescription> = new EventEmitter<ProductDetailsDescription>();

  constructor (private store: Store) {}
  
  addProduct(product: ProductDetailsDescription) {
    this.addProductButtonClicked.emit(product);
  }

  productDeselected($event: MatSelectionListChange) {
    const productId = $event.options[0].value;
    const selected = $event.options[0].selected;
    if(selected)
      return;

    this.store.dispatch(new ProductDeselected(productId));
  }

  productSelected($event: MatSelectionListChange) {
    const productId = $event.options[0].value;
    const selected = $event.options[0].selected;
    if(!selected)
      return;

    this.store.dispatch(new ProductSelected(productId));
  }
}

