import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DishConfigurationRestService } from '../../dish-configuration-rest-service';
import { DishConfigurationStore } from '../../store/dish-configuration.state';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductsCatalogueComponent } from '../../../products/components/products-catalogue/products-catalogue.component';
import { ProductsModule } from '../../../products/products.module';
import { CatalogueItem } from '../../../products/model';

@Component({
  selector: 'app-dish-details',
  // standalone: true,
  // imports: [
  //   MaterialModule,
  //   CommonModule,
  //   FormsModule,
  //   ReactiveFormsModule,
  //   ProductsModule,
  // ],
  template: `
    <mat-toolbar color="primary" class="justify-between">
  <div>
    <button mat-icon-button (click)="dialogRef.close()">
      <mat-icon>close</mat-icon>
    </button>
    <span class="self-center">Nowe Danie</span>
  </div>
  <div>
    <button style="font-size: large;" mat-button class="w-24 font-title-large self-center" type="submit">Zapisz</button>
  </div>
</mat-toolbar>

<div class="dialog-content flex flex-col p-6">
  <div class="flex">
    <div class="flex flex-col w-1/2 p-4 mr-4 bg-white rounded-2xl shadow-xl">
      <h2 class="text-xl">Dane</h2>
      <form [formGroup]="form" class="form mt-4">
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Nazwa Dania</mat-label>
            <input matInput formControlName="name">
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
            <textarea [cols]="5" [rows]="5" matInput formControlName="recipe"></textarea>
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Opis</mat-label>
            <textarea [cols]="5"  matInput formControlName="description"></textarea>
          </mat-form-field>
        </div>
      </form>
    </div>
    <div class="flex flex-col w-1/2 p-4 bg-white rounded-2xl shadow-xl">
      <div class="h-full ">
        <h2 class="text-xl mt-4">Składniki <mat-icon *ngIf="products.length < 1 && form.touched" color="warn" class="text-body-large pt-1">error</mat-icon></h2>
        <app-presentation-product-list [products]="products"></app-presentation-product-list>
        <!-- <app-products-catalogue #productsCatalogue
          [addButtonEnabled]="true"
          [onlyProducts]= "true">
        </app-products-catalogue> -->
      </div>
    </div>
  </div>
</div>
  `,
  styleUrl: './dish-details.component.scss'
})
export class DishDetailsComponent {
  products: CatalogueItem[] = [];
  form!: FormGroup;
  constructor (
    public dialogRef: MatDialogRef<DishDetailsComponent>,
    private store: Store,
    private fb: FormBuilder,
    private restService: DishConfigurationRestService,
    @Inject(MAT_DIALOG_DATA) public data: {
      dishId: string
    }) {
    this.form = this.fb.group({
      name: ['', []],
      portions: [1, []],
      recipe: [''],
      description: [],
    });
    this.store.select(DishConfigurationStore.dishDetailsById(this.data.dishId)).subscribe((dish) => {
      if (!dish)
        return;

      
      this.form.patchValue({
        name: dish.name,
        portions: dish.portions,
        recipe: dish.recipe,
        description: dish.description
      });
      this.products = dish.ingredients;
      this.form.disable();
    });
  }

}
