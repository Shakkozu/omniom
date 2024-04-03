import { Component } from '@angular/core';
import { ProductDetailsDescription } from '../../../products/model';

@Component({
  selector: 'app-add-nutrition-entry',
  template: `
    <h2 mat-dialog-title>Wybierz produkty które chcesz dodać</h2>
    <mat-dialog-content>
      <div class="w-full">
        <app-products-catalogue
          [selectionList]="true">
        </app-products-catalogue>
      </div>
    </mat-dialog-content>
    <div class="me-4">

      <mat-dialog-actions align="end">
          <button mat-button  [mat-dialog-close]="true" >Anuluj</button>
          <button mat-button color="primary" (click)="onProductsConfirmed()" cdkFocusInitial>Dalej</button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrl: './add-nutrition-entry.component.scss'
})
export class AddNutritionEntryComponent {

  onProductsConfirmed() {
    // handle event
  }
}
