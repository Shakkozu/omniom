import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ProductsCatalogueStore } from '../../../products/store/products-catalogue.store';


@Component({
  selector: 'app-add-nutrition-entry',
  template: `
    <h2 mat-dialog-title>Wybierz produkty które chcesz dodać</h2>
    <mat-dialog-content>
      <div class="flex flex-row">
        <div class="w-1/2">
          <app-products-catalogue
          [selectionList]="true">
        </app-products-catalogue>
      </div>
      <div class="w-1/2 ms-4 mt-20 rounded-xl shadow-xl">
          <div *ngFor="let product of selectedProducts$ | async" class="">
          <div class="flex flex-row content-evenly">
            <div class="w-2/3">
              <mat-list-item class="">
                <span matListItemTitle>{{ product.name }}</span>
                <span matListItemLine>{{product.kcalPer100G }}kcal  B: {{product.proteinsPer100G}}g T: {{product.fatPer100G}}g W:{{product.carbsPer100G}}g</span>
              </mat-list-item>
            </div>
            <div class="w-1/3 h-auto">
              <mat-form-field class="mt-2">
                <mat-label>Gramatura</mat-label>
                <input matInput placeholder="Portion size" [(ngModel)]="product.suggestedPortionSizeG">
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
  constructor (private store: Store, private dialogRef: MatDialogRef<AddNutritionEntryComponent>) {

  }

  onProductsConfirmed() {
    
  }
}
