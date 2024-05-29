import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogueItem, MealEntry } from '../../../products/model';
import { Store } from '@ngxs/store';
import { CleanupExcludedList, ProductAddedToExcludedList, ProductRemovedFromExcludedList } from '../../../products/store/products-catalogue.actions';
import { ProductsCatalogueComponent } from '../../../products/components/products-catalogue/products-catalogue.component';
import { Dish } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { CreateDish } from '../../store/dish-configuration.actions';
import { FormErrorHandler } from '../../../shared/form-error-handler';

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
      <h2 class="text-xl">Dane</h2>
      <form [formGroup]="form" (ngSubmit)="save()" class="form mt-4">
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Nazwa Dania</mat-label>
            <input matInput formControlName="name">
            <mat-error>{{getErrorMessage("name")}}</mat-error>
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Ilość Porcji</mat-label>
            <input matInput type="number" formControlName="portions">
            <mat-error>{{getErrorMessage("portions")}}</mat-error>
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Przepis</mat-label>
            <textarea [cols]="5" [rows]="5" matInput formControlName="recipe"></textarea>
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Opis</mat-label>
            <textarea matInput formControlName="description"></textarea>
          </mat-form-field>
          <mat-error *ngIf="products.length < 1 && form.touched">Co najmniej 1 składnik jest wymagany</mat-error>
        </div>
      </form>
    </div>

    <div class="flex flex-col w-1/2 p-4 bg-white rounded-2xl shadow-xl">
      <div class="h-full ">
        <h2 class="text-xl mt-4">Składniki <mat-icon *ngIf="products.length < 1 && form.touched" color="warn" class="text-body-large pt-1">error</mat-icon></h2>
        <app-presentation-product-list (productRemovedFromList)="onProductRemoved($event)" [products]="products"></app-presentation-product-list>
        <app-products-catalogue #productsCatalogue
          [addButtonEnabled]="true"
          [onlyProducts]= "true"
          (addProductButtonClicked)="productAddedToMealDiary($event)">
        </app-products-catalogue>
      </div>
    </div>
  </div>
</div>
  `,
})
export class NewDishDialogComponent implements OnDestroy {
  public products: CatalogueItem[] = [];
  @ViewChild(ProductsCatalogueComponent) productsCatalogue?: ProductsCatalogueComponent;
  form: FormGroup;

  constructor (
    public dialogRef: MatDialogRef<NewDishDialogComponent>,
    private fb: FormBuilder,
    private store: Store,
    private formErrorHandler: FormErrorHandler,
    @Inject(MAT_DIALOG_DATA) public data: {
      products: CatalogueItem[]
    }) {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        portions: [1, [Validators.min(1), Validators.max(100), Validators.required]],
        recipe: [''],
        description: [''],
      });
    this.products = data.products;
  }

  public productAddedToMealDiary(selectedProduct: CatalogueItem) {
    if (!selectedProduct)
      return;

    this.products.push(selectedProduct);
    this.store.dispatch(new ProductAddedToExcludedList([selectedProduct.guid]));
    this.productsCatalogue?.clearSearchPhrase();
  }

  public onProductRemoved(removedMealEntry: CatalogueItem) {
    this.store.dispatch(new ProductRemovedFromExcludedList(removedMealEntry.guid));
  }

  public save() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    if (this.products.length < 1)
      return;
      

    const dish: Dish = {
      name: this.form.value.name,
      recipe: this.form.value.recipe,
      description: this.form.value.description,
      portions: this.form.value.portions,
      guid: uuidv4(),
      ingredients: this.products.map(p => p.toProductCatalogueItem())
    };

    this.store.dispatch(new CreateDish(dish));
    this.dialogRef.close();
  }

  public getErrorMessage(formControlName: string): string {
    return this.formErrorHandler.handleError(this.form, formControlName);
  }


  ngOnDestroy(): void {
    this.store.dispatch(new CleanupExcludedList());
  }
}

export interface NewDishDialogConfiguration {
  products: CatalogueItem[];
  createNewDishOnSave: boolean;
}