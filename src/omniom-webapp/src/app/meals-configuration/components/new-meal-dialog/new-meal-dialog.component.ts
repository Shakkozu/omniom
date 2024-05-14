import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MealEntry } from '../../../products/model';

@Component({
  selector: 'app-new-meal-dialog',
  template: `
<mat-toolbar color="primary" class="justify-between">
  <span>Nowe Danie</span>
  <div>
    <button mat-icon-button (click)="dialogRef.close()">
      <mat-icon>close</mat-icon>
    </button>
    <button mat-icon-button (click)="save()">
      <mat-icon>save</mat-icon>
    </button>
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
            <textarea matInput formControlName="recipe"></textarea>
          </mat-form-field>
        </div>
        <div class="flex flex-col">
          <mat-form-field>
            <mat-label>Opis</mat-label>
            <textarea matInput formControlName="description"></textarea>
          </mat-form-field>
        </div>
      </form>
    </div>

    <div class="flex flex-col w-1/2 p-4 bg-white rounded-2xl shadow-xl">
      <div class="h-full ">
        <h2 class="text-xl mt-4">Produkty</h2>
        <app-presentation-product-list [products]="products"></app-presentation-product-list>
        <div class="example-button-container right-10 absolute">
        <button mat-fab class="absolute" color="primary" aria-label="Example icon button with a delete icon">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      </div>
    </div>
  </div>
        <button mat-raised-button color="primary" class="mt-8 w-24 self-center" type="submit">Zapisz</button>

</div>
  `,
  styleUrl: './new-meal-dialog.component.scss'
})
export class NewMealDialogComponent {
  save() {
    throw new Error('Method not implemented.');
  }
  public products: MealEntry[] = [];
  form: FormGroup;

  constructor (
    public dialogRef: MatDialogRef<NewMealDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      products: MealEntry[]
    }
    

  ) {
    this.products = data.products;
    this.form = this.fb.group({
      name: [''],
      recipe: [''],
      description: [''],
      portions: [1]
    });
  }


}
