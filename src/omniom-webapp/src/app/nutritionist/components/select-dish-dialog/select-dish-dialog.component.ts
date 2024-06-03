import { Component } from '@angular/core';
import { MealCatalogueItem } from '../../../products/model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-dish-dialog',
  template: `
<mat-toolbar color="primary" class="justify-between">
  <div>
    <button mat-icon-button (click)="dialogRef.close()">
      <mat-icon>close</mat-icon>
    </button>
    <span class="self-center">Wybierz danie</span>
  </div>
</mat-toolbar>

<div class="dialog-content flex flex-col">
  <div mat-dialog-content>
      <app-dishes-list
      [selectionList]="false"
      [singleSelectButtonEnabled]="true"
      [addNewDishButtonEnabled]="false"
      (singleMealCatalogueItemSelected)="onDishSelected($event)">
</app-dishes-list>
    </div>
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
