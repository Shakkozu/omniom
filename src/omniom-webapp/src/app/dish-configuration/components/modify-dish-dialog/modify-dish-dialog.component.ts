import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CatalogueItem, MealCatalogueItem } from '../../../products/model';
import { Dish } from '../../model';
import { DishFormComponent } from '../dish-form/dish-form.component';

@Component({
  selector: 'app-modify-dish-dialog',
  template: `
    <mat-toolbar color="primary" class="justify-between">
  <div>
    <button mat-icon-button (click)="dialogRef.close()">
      <mat-icon>close</mat-icon>
    </button>
    <span class="self-center">Nowe Danie</span>
  </div>
  <div>
    <button style="font-size: large;" mat-button class="w-24 font-title-large self-center" (click)="save()" type="submit">Zapisz</button>
  </div>
</mat-toolbar>

<div class="dialog-content flex flex-col p-6">
  <div class="flex">
    <div class="flex flex-col w-1/2 p-4 mr-4 bg-white rounded-2xl shadow-xl">
      <app-dish-form [singlePortion]="this.data.singlePortion ?? false" [products]="products" (formSubmitted)="onFormSubmitted($event)"></app-dish-form>
    </div>

    <div class="flex flex-col w-1/2 p-4 bg-white rounded-2xl shadow-xl">
      <app-dish-products-selector [products]="products"></app-dish-products-selector>
    </div>
  </div>
</div>
  `,
})
export class ModifyDishDialogComponent implements AfterViewInit {
  @ViewChild(DishFormComponent) dishForm!: DishFormComponent;
  public products: CatalogueItem[];
  public meal: MealCatalogueItem;
  constructor (
    public dialogRef: MatDialogRef<ModifyDishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModifyDishDialogConfiguration) {
    this.meal = this.data.dishDetails;
    this.products = this.meal.ingredients; 
  }

  
  onFormSubmitted($event: Dish) {
    this.dialogRef.close($event);
  }

  ngAfterViewInit(): void {
    this.dishForm.initialize(this.meal);
  }

  save() {
    this.dishForm.save();
  }
}

export interface ModifyDishDialogConfiguration {
  dishDetails: MealCatalogueItem;
  singlePortion?: boolean;
}
