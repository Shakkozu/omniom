import { Component } from '@angular/core';
import { MealCatalogueItem } from '../../../products/model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-dish-dialog',
  template: `
  <h2 mat-dialog-title>Wybierz danie</h2>
    <div mat-dialog-content>
      <app-dishes-list
      [selectionList]="false"
      [singleSelectButtonEnabled]="true"
      [addNewDishButtonEnabled]="false"
      (singleMealCatalogueItemSelected)="onDishSelected($event)"
      >
</app-dishes-list>
      

    </div>

  `,
  styleUrl: './select-dish-dialog.component.scss'
})
export class SelectDishDialogComponent {

  constructor (public dialogRef: MatDialogRef<SelectDishDialogComponent>,
  ) { 
    
  }

  onDishSelected(mealCatalogueItem: MealCatalogueItem) {
    this.dialogRef.close(mealCatalogueItem);
  }

}
