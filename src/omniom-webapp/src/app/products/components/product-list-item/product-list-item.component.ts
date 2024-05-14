import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MealEntry } from '../../../nutrition-diary/components/modify-meal-nutrition-entries/modify-meal-nutrition-entries.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list-item',
  template: `
    <div class="flex flex-row content-evenly">
            <div class="w-4/6">
              <mat-list-item class="">
                <span matListItemTitle>{{ product.name }}</span>
                <span matListItemLine>{{product.kcal }}kcal  B: {{product.proteins}}g T: {{product.fats}}g W:{{product.carbohydrates}}g</span>
              </mat-list-item>
            </div>
            <div class="w-2/6">
              <mat-form-field class="mt-2">
                <mat-label>Gramatura</mat-label>
                <input matInput min="0" [readonly]="loading$ | async" type="number" placeholder="Portion size" [(ngModel)]="product.portionInGrams">
                <span matTextSuffix>g</span>
              </mat-form-field>
            </div>
            <button class="mx-2" style="align-self: center;" mat-icon-button (click)="removeProductFromSelectionClicked(product)"><mat-icon>delete</mat-icon></button>
          </div>
  `,
  styleUrl: './product-list-item.component.scss'
})
export class ProductListItemComponent {


  @Input() product!: MealEntry;
  @Input() loading$!: Observable<boolean>;
  @Output() removeProductFromSelection = new EventEmitter<MealEntry>();


  removeProductFromSelectionClicked(selectedProduct: MealEntry) {
    this.removeProductFromSelection.emit(selectedProduct);
  }

}
