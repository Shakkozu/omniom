import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CatalogueItem } from '../../../products/model';
import { Store } from '@ngxs/store';
import { CleanupExcludedList } from '../../../products/store/products-catalogue.actions';
import { ProductsCatalogueComponent } from '../../../products/components/products-catalogue/products-catalogue.component';
import { Dish } from '../../model';
import { CreateDish } from '../../store/dish-configuration.actions';
import { DishFormComponent } from '../dish-form/dish-form.component';

@Component({
  selector: 'app-new-meal-dialog',
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
      <app-dish-form [singlePortion]="this.singlePortion" [products]="products" (formSubmitted)="onFormSubmitted($event)"></app-dish-form>
    </div>

    <div class="flex flex-col w-1/2 p-4 bg-white rounded-2xl shadow-xl">
      <app-dish-products-selector [products]="products"></app-dish-products-selector>
    </div>
  </div>
</div>
  `,
})
export class NewDishDialogComponent implements OnDestroy, OnInit {
  public products: CatalogueItem[] = [];
  public singlePortion: boolean = false;
  @ViewChild(ProductsCatalogueComponent) productsCatalogue?: ProductsCatalogueComponent;
  @ViewChild(DishFormComponent) dishForm!: DishFormComponent;

  constructor (
    public dialogRef: MatDialogRef<NewDishDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: NewDishDialogConfiguration) {
    this.products = data.products;
  }
  

  public save() {
    this.dishForm?.save();
  }

  onFormSubmitted($event: Dish) {
    if (this.data.createNewDishOnSave) {
      this.store.dispatch(new CreateDish($event));
    }
    this.dialogRef.close($event);
  }

  ngOnInit(): void {
    this.singlePortion = this.data.singlePortion ?? false;
  }


  ngOnDestroy(): void {
    this.store.dispatch(new CleanupExcludedList());
  }
}

export interface NewDishDialogConfiguration {
  products: CatalogueItem[];
  createNewDishOnSave: boolean;
  singlePortion?: boolean;
}