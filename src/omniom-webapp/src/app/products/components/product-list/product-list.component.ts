import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ProductsCatalogueStore } from '../../store/products-catalogue.store';
import { ProductListChangedEvent } from '../products-list/products-list.component';
import { CatalogueItem, CatalogueItemType, MealEntry } from '../../model';

@Component({
  selector: 'app-presentation-product-list',
  template: `
          <div *ngFor="let product of products" >
          <app-presentation-product-list-item
          [product]="product"
          [readonly]="readonly"
           [loading$]="loading$" (removeProductFromSelection)="this.removeProductFromSelection($event)"></app-presentation-product-list-item>
          <mat-divider class=""></mat-divider>
        </div>
  `,
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @Input() products: CatalogueItem[] = [];
  @Input() readonly: boolean = false;
  @Input() loading$: Observable<boolean> = new Observable<boolean>();
  @Output() productRemovedFromList = new EventEmitter<CatalogueItem>();
  constructor (private store: Store) {

  }

  removeProductFromSelection(catalogueItem: CatalogueItem) {
    this.onProductListModified({ type: 'deselected', catalogueItemId: catalogueItem.guid, itemType: catalogueItem.type })
    this.productRemovedFromList.emit(catalogueItem);
  }

  onProductListModified(event: ProductListChangedEvent) {
    if (event.type === 'selected') {
      const productInfo = this.store.selectSnapshot(ProductsCatalogueStore.selectedProducts).find((product) => product.guid === event.catalogueItemId);
      if (!productInfo || this.products.find((product) => product.guid === productInfo.guid))
        return;

      this.products.push(productInfo);
      return;
    }

    const productIndex = this.products.findIndex((product) => product.guid === event.catalogueItemId);
    if (productIndex === -1)
      return;
    this.products.splice(productIndex, 1);
  }

}
