import { Component } from '@angular/core';
import { ProductDetailsDescription } from '../../../products/model';

@Component({
  selector: 'app-add-nutrition-entry',
  template: `
    <h2 mat-dialog-title>Dodaj produkt do posiłku</h2>
<mat-dialog-content>
  <div class="w-full">
    <app-products-catalogue
     (catalogueSelectionChanged)="onProductsSelectionChanged($event)"
      [selectionList]="true"
     ></app-products-catalogue>
  </div>
</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button mat-dialog-close>No</button>
  <button mat-button mat-dialog-close cdkFocusInitial>Ok</button>
</mat-dialog-actions>
`,
  styleUrl: './add-nutrition-entry.component.scss'
})
export class AddNutritionEntryComponent {
  
  onProductsSelectionChanged($event: string[]) {
    }
}
