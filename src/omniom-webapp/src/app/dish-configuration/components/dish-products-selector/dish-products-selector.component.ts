import { Component, Input, ViewChild } from '@angular/core';
import { CatalogueItem } from '../../../products/model';
import { ProductAddedToExcludedList, ProductRemovedFromExcludedList } from '../../../products/store/products-catalogue.actions';
import { Store } from '@ngxs/store';
import { ProductsCatalogueComponent } from '../../../products/components/products-catalogue/products-catalogue.component';

@Component({
  selector: 'app-dish-products-selector',
  template: `
    <div class="h-full ">
        <h2 class="text-xl mt-4">Składniki <mat-icon *ngIf="products.length < 1" color="warn" class="text-body-large pt-1">error</mat-icon></h2>
        <app-presentation-product-list (productRemovedFromList)="onProductRemoved($event)" [products]="products"></app-presentation-product-list>
        <app-products-catalogue #productsCatalogue
          [addButtonEnabled]="true"
          [onlyProducts]= "true"
          (addProductButtonClicked)="productAddedToMealDiary($event)">
        </app-products-catalogue>
      </div>
  `,
  styles: ``
})
export class DishProductsSelectorComponent {

  @ViewChild(ProductsCatalogueComponent) productsCatalogue?: ProductsCatalogueComponent;
  constructor(private store: Store) {
  }
  @Input() products: CatalogueItem[] = [];
  
  public productAddedToMealDiary(selectedProduct: CatalogueItem) {
    if (!selectedProduct)
      return;

    this.products.push(selectedProduct);
    this.store.dispatch(new ProductAddedToExcludedList([selectedProduct.guid]));
    this.productsCatalogue?.clearSearchPhrase();
  }

  public onProductRemoved(product: CatalogueItem) {
    this.store.dispatch(new ProductRemovedFromExcludedList(product.guid));
  }
}
