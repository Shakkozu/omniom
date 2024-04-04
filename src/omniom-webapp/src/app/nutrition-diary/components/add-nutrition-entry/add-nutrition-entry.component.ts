import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ProductsCatalogueStore } from '../../../products/store/products-catalogue.store';
import { ProductListChangedEvent } from '../../../products/components/products-list/products-list.component';


@Component({
  selector: 'app-add-nutrition-entry',
  template: `
    <h2 mat-dialog-title>Wybierz produkty które chcesz dodać</h2>
    <mat-dialog-content>
      <div class="flex flex-row">
        <div class="w-1/2">
          <app-products-catalogue
          [selectionList]="true"
          (productListChanged)="onProductListModified($event)">
        </app-products-catalogue>
      </div>
      <div class="w-1/2 ms-4 mt-20 rounded-xl shadow-xl h-fit">
          <div *ngFor="let product of products" class="">
          <div class="flex flex-row content-evenly">
            <div class="w-2/3">
              <mat-list-item class="">
                <span matListItemTitle>{{ product.name }}</span>
                <span matListItemLine>{{product.kcal }}kcal  B: {{product.proteins}}g T: {{product.fats}}g W:{{product.carbohydrates}}g</span>
              </mat-list-item>
            </div>
            <div class="w-1/3">
              <mat-form-field class="mt-2">
                <mat-label>Gramatura</mat-label>
                <input matInput min="0" type="number" placeholder="Portion size" [(ngModel)]="product.portionInGrams">
                <span matTextSuffix>g</span>
              </mat-form-field>
            </div>
          </div>
          <mat-divider class=""></mat-divider>
        </div>
      </div>
    </div>
  </mat-dialog-content>
    <div class="me-4 mt-4">
      <mat-dialog-actions align="end">
        <button mat-button  [mat-dialog-close]="true" >Anuluj</button>
        <button mat-button [mat-dialog-close]="true" color="primary" (click)="onProductsConfirmed()" cdkFocusInitial>Dalej</button>
    </mat-dialog-actions>
  </div>
  `,
  styleUrl: './add-nutrition-entry.component.scss'
})
export class AddNutritionEntryComponent {
  public selectedProducts$ = this.store.select(ProductsCatalogueStore.selectedProducts);
  public products: MealEntry[] = [];
  constructor (private store: Store, private dialogRef: MatDialogRef<AddNutritionEntryComponent>) {
    console.log(this.store.selectSnapshot(ProductsCatalogueStore.selectedProducts));
    this.products = this.store.selectSnapshot(ProductsCatalogueStore.selectedProducts).map((product) =>
      new MealEntry(product.name,
        product.guid,
        product.suggestedPortionSizeG,
        product.kcalPer100G,
        product.proteinsPer100G,
        product.fatPer100G,
        product.carbsPer100G));
  }

  onProductsConfirmed() {

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

export class MealEntry {
  constructor (public name: string, public guid: string,
    public portionInGrams: number,
    private kcalPer100g: number,
    private proteinsPer100g: number,
    private fatsPer100g: number,
    private carbohydratesPer100g: number) {
    this.name = name;
    this.portionInGrams = portionInGrams;
    this.guid = guid;
    this.kcalPer100g = kcalPer100g;
    this.proteinsPer100g = proteinsPer100g;
    this.fatsPer100g = fatsPer100g;
    this.carbohydratesPer100g = carbohydratesPer100g;
  }

  get kcal(): number {
    return +(this.kcalPer100g * this.portionInGrams / 100).toFixed(2);
  }

  get proteins(): number {
    return +(this.proteinsPer100g * this.portionInGrams / 100).toFixed(2);
  }

  get fats(): number {
    return +(this.fatsPer100g * this.portionInGrams / 100).toFixed(2);
  }

  get carbohydrates(): number {
    return +(this.carbohydratesPer100g * this.portionInGrams / 100).toFixed(2);
  }


}

export interface AdjustProductPortionViewModel {
  name: string;
  guid: string;
  portionSize: number;
  kcal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;

  proteinsPer100G: number;
  kcalPer100G: number;
  fatPer100G: number;
  carbsPer100G: number;
}
