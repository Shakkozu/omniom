import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MealEntry } from '../../../nutrition-diary/components/modify-meal-nutrition-entries/modify-meal-nutrition-entries.component';
import { Store } from '@ngxs/store';
import { ProductDeselected } from '../../store/products-catalogue.actions';
import { ProductsCatalogueStore } from '../../store/products-catalogue.store';
import { ProductListChangedEvent } from '../products-list/products-list.component';

@Component({
  selector: 'app-product-list',
  template: `
    
          <div *ngFor="let product of products" class="">
          <app-product-list-item [product]="product" [loading$]="loading$" (removeProductFromSelection)="this.removeProductFromSelection($event)"></app-product-list-item>
          <mat-divider class=""></mat-divider>
        </div>
  `,
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @Input() products: MealEntry[] = [];
  @Input() loading$: Observable<boolean> = new Observable<boolean>();
  @Output() productRemovedFromList = new EventEmitter<MealEntry>();
  constructor (private store: Store) { 
    
  }
  
  removeProductFromSelection(product: MealEntry) {
    this.onProductListModified({ type: 'deselected', productId: product.guid })
    this.productRemovedFromList.emit(product);
  }

  onProductListModified(event: ProductListChangedEvent) {
    if (event.type === 'selected') {
      const productInfo = this.store.selectSnapshot(ProductsCatalogueStore.selectedProducts).find((product) => product.guid === event.productId);
      if (!productInfo || this.products.find((product) => product.guid === productInfo.guid))
        return;

      this.products.push(new MealEntry(
        productInfo.name,
        productInfo.guid,
        productInfo.suggestedPortionSizeG,
        productInfo.kcalPer100G,
        productInfo.proteinsPer100G,
        productInfo.fatPer100G,
        productInfo.carbsPer100G));

      return;
    }

    const productIndex = this.products.findIndex((product) => product.guid === event.productId);
    if (productIndex === -1)
      return;
    this.products.splice(productIndex, 1);
  }

}
