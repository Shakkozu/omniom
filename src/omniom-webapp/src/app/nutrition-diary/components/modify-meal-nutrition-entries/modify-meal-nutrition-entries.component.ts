import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ProductsCatalogueStore } from '../../../products/store/products-catalogue.store';
import { ProductListChangedEvent } from '../../../products/components/products-list/products-list.component';
import { MealType, NutritionDiaryEntry } from '../../model';
import { AddNutritionEntries } from '../../store/nutrition-diary.actions';
import { NutritionDiaryStore } from '../../store/nutrition-diary.store';
import { ClearProductsSelection, ProductDeselected, SelectMultipleProducts } from '../../../products/store/products-catalogue.actions';
import { CatalogueItem, CatalogueItemType } from '../../../products/model';
import { DishConfigurationStore } from '../../../dish-configuration/store/dish-configuration.state';
import { DishDeselected, SelectMultipleDishes } from '../../../dish-configuration/store/dish-configuration.actions';


@Component({
  selector: 'app-meal-nutrition-entry-details',
  template: `
    <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
    <mat-toolbar color="primary" class="justify-between">
      <div>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
        <span class="self-center ms-4">Wybierz produkty które chcesz dodać</span>
      </div>
      <div>
        <button style="font-size: large;" mat-button class="w-24 font-title-large self-center" [disabled]="loading$ | async" (click)="onProductsConfirmed()" type="submit">Zapisz</button>
      </div>
    </mat-toolbar>
    <mat-dialog-content class="h-fit max-h-fit min-h-fit">
      <div class="dialog-content flex flex-row">
        <div class="w-1/2 h-fit">
          <app-products-catalogue [selectionList]="true"
             (dishListChanged)="onProductListModified($event)"
             (productListChanged)="onProductListModified($event)">
          </app-products-catalogue>
      </div>
      <div class="w-1/2 ms-4 mt-20 rounded-xl shadow-xl h-fit"  >
        <app-presentation-product-list (productRemovedFromList)="this.deselectProduct($event)" [products]="products" [loading$]="loading$"></app-presentation-product-list>
      </div>
    </div>
  </mat-dialog-content>
  `,
})
export class ModifyMealNutritionEntriesComponent {
  public loading$ = this.store.select(NutritionDiaryStore.loading);
  public products: CatalogueItem[] = [];
  constructor (private store: Store,
    public dialogRef: MatDialogRef<ModifyMealNutritionEntriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mealType: MealType, initialSelection: NutritionDiaryEntry[] }) {
    if (this.data.initialSelection) {
      const products = this.data.initialSelection.filter(p => p.productId !== null && p.productId !== undefined);
      const meals = this.data.initialSelection.filter(p => p.userMealId !== null && p.userMealId !== undefined);
      this.store.dispatch(new SelectMultipleProducts(products.map(p => p.productId)));
      this.store.dispatch(new SelectMultipleDishes(meals.map(p => p.userMealId)));
      this.products = this.data.initialSelection.map((product) => CatalogueItem.fromNutritionDiaryEntry(product));
    }
  }


  onProductsConfirmed() {
    const roundPortionSizeToTwoDecimalPlaces = (portionSize: number) => Math.round(portionSize * 100) / 100;
    const entries = this.products.map(p => ({ guid: p.guid, type: p.type, portionSize: roundPortionSizeToTwoDecimalPlaces(p.portionInGrams) }));
    const selectedDay = this.store.selectSnapshot(NutritionDiaryStore.selectedNutritionDay);
    if (selectedDay === undefined || selectedDay === null) {
      console.error('Selected day is undefined');
      return;
    }

    this.store.dispatch(new AddNutritionEntries(entries, this.data.mealType, selectedDay)).subscribe(_ => {
      this.store.dispatch(new ClearProductsSelection());
    });
  }

  onProductListModified(event: ProductListChangedEvent) {
    const productSelected = event.itemType === CatalogueItemType.Product;
    if (event.type === 'selected') {
      if (productSelected) {
        const productInfo = this.store.selectSnapshot(ProductsCatalogueStore.selectedProducts).find((product) => product.guid === event.catalogueItemId);
        if (!productInfo || this.products.find((product) => product.guid === productInfo.guid))
          return;

        this.products.push(productInfo);
        return;
      }
      else if (event.itemType === CatalogueItemType.Meal) {
        const productInfo = this.store.selectSnapshot(DishConfigurationStore.selectedDishes).find((product) => product.guid === event.catalogueItemId);
        if (!productInfo || this.products.find((product) => product.guid === productInfo.guid))
          return;


        this.products.push(new CatalogueItem(productInfo.name, CatalogueItemType.Meal, productInfo.guid, productInfo.portionInGrams, productInfo.kcalPer100g, productInfo.proteinsPer100g, productInfo.fatsPer100g, productInfo.carbohydratesPer100g));
        return;
      }
    }
    if (productSelected) {
      const productIndex = this.products.findIndex((product) => product.guid === event.catalogueItemId);
      if (productIndex === -1)
        return;
      this.products.splice(productIndex, 1);
    }
    else {
      const productInfo = this.store.selectSnapshot(DishConfigurationStore.selectedDishes).find((product) => product.guid === event.catalogueItemId);
      if (!productInfo || this.products.find((product) => product.guid === productInfo.guid))
        return;

      this.products.push(productInfo);
      return;
    }
  }

  deselectProduct(catalogueItem: CatalogueItem) {
    if (catalogueItem.type === CatalogueItemType.Product) {
      this.store.dispatch(new ProductDeselected(catalogueItem.guid));
      return;
    }

    this.store.dispatch(new DishDeselected(catalogueItem.guid));
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
