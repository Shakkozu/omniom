import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrorHandler } from '../../../shared/form-error-handler';
import { Dish } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { CatalogueItem } from '../../../products/model';

@Component({
  selector: 'app-dish-form',
  template: `
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
  `,
})
export class DishFormComponent {
  form: FormGroup;
  @Output() formSubmitted: EventEmitter<Dish> = new EventEmitter();
  @Input() products: CatalogueItem[] = [];

  constructor (
    private fb: FormBuilder,
    private formErrorHandler: FormErrorHandler,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      portions: [1, [Validators.min(1), Validators.max(100), Validators.required]],
      recipe: [''],
      description: [''],
    });
  }

  public getErrorMessage(formControlName: string): string {
    return this.formErrorHandler.handleError(this.form, formControlName);
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
      ingredients: this.products
    };

    this.formSubmitted.emit(dish);
  }
}
