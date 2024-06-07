import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MealCatalogueItem, ProductCatalogueItem } from '../../../products/model';

@Component({
  selector: 'app-dish-details',
  template: `
    <mat-toolbar color="primary" class="justify-between">
  <div>
    <button mat-icon-button (click)="dialogRef.close()">
      <mat-icon>close</mat-icon>
    </button>
    <span class="self-center ms-4">Danie '{{dishName}}'</span>
  </div>
</mat-toolbar>

<mat-dialog-content>
<div class="dialog-content flex flex-col p-6">
  <div class="flex">
    <div class="flex flex-col w-1/2 p-4 mr-4 bg-white rounded-2xl shadow-xl">
      <h2 class="text-xl">Dane</h2>
      <form [formGroup]="form" class="form mt-4">
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Nazwa Dania</mat-label>
            <input readonly matInput formControlName="name">
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Ilość Porcji</mat-label>
            <input matInput type="number" formControlName="portions">
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Przepis</mat-label>
            <textarea readonly="true" [cols]="5" [rows]="5" matInput formControlName="recipe"></textarea>
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Opis</mat-label>
            <textarea readonly="true" [cols]="5"  matInput formControlName="description"></textarea>
          </mat-form-field>
        </div>
      </form>
    </div>
    <div class="flex flex-col w-1/2 p-4 bg-white rounded-2xl shadow-xl">
      <div class="h-full ">
        <h2 class="text-xl mt-4">Składniki</h2>
        <p>{{getProductsSummary()}}</p>
        <app-presentation-product-list [readonly]="true" [products]="products"></app-presentation-product-list>
      </div>
      <div class="h-full mt-8 ">
        <h2 class="text-xl mt-4">Składniki na porcję</h2>
        <p>{{getProductsSummaryPerPortion()}}</p>
        <app-presentation-product-list [readonly]="true" [products]="productsPerPortion"></app-presentation-product-list>
      </div>
    </div>
  </div>
</div>
</mat-dialog-content>

  `,
  styleUrl: './dish-details.component.scss'
})
export class DishDetailsComponent {
  products: ProductCatalogueItem[] = [];
  productsPerPortion: ProductCatalogueItem[] = [];
  form!: FormGroup;

  public dishName: string = '';
  constructor (
    public dialogRef: MatDialogRef<DishDetailsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      dish: MealCatalogueItem
    }) {
    const dish = data.dish;
    this.form = this.fb.group({
      name: [dish.name, []],
      portions: dish.portions,
      recipe: dish.recipe,
      description: dish.description
    });

    this.dishName = dish.name;
    this.form.updateValueAndValidity();
    this.products = dish.ingredients;
    this.productsPerPortion = dish.ingredients.map(p => {
      const portionInGrams = Math.round(p.portionInGrams / dish.portions);
      return new ProductCatalogueItem(p.name, p.guid, portionInGrams, p.kcalPer100g, p.proteinsPer100g, p.fatsPer100g, p.carbohydratesPer100g)
    });
  };


  public getProductsSummary(): string {
    return this.getSummary(1);
  }


  public getProductsSummaryPerPortion(): string {
    return this.getSummary(this.form.value.portions);
  }

  private getSummary(portions = 1): string {
    const totalKCal = this.products.reduce((acc, product) => acc + product.kcal, 0) / portions;
    const totalProtein = this.products.reduce((acc, product) => acc + product.proteins, 0) / portions;
    const totalCarbs = this.products.reduce((acc, product) => acc + product.carbohydrates, 0) / portions;
    const totalFats = this.products.reduce((acc, product) => acc + product.fats, 0) / portions;
    return `Kcal: ${ totalKCal.toFixed(2) }, B: ${ totalProtein.toFixed(2) }, W: ${ totalCarbs.toFixed(2) }, T: ${ totalFats.toFixed(2) }`;
  }
}

