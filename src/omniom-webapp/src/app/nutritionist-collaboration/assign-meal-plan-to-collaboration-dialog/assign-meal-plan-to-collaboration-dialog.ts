import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MealPlanListItem } from '../../nutritionist/components/meal-plans-list/meal-plans-list.component';
import { CommonModule } from '@angular/common';
import { CollaborationSummary } from '../active-collaborations-list/active-collaborations-list.component';
import { MealPlanStatus } from '../../nutritionist/model';

@Component({
  selector: 'app-assign-meal-plan-to-collaboration-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  template: `
    <mat-toolbar color="primary" class="justify-between">
  <div>
    <button mat-icon-button (click)="dialogRef.close()">
      <mat-icon>close</mat-icon>
    </button>
    <span class="self-center">Przypisz jadłospis</span>
  </div>
</mat-toolbar>

<div class="dialog-content p-6">
  <form>
    <mat-form-field>
      <mat-label>Użytkownik</mat-label>
      <input matInput [value]="data?.summary?.username" readonly>
    </mat-form-field>
  </form>

  <mat-list role="list">
    <ng-container *ngFor="let mealPlan of getMealPlans">
      <mat-list-item>
        {{mealPlan.name}} - {{mealPlan.dailyCalories}}kcal
        <button (click)="onMealPlanSelected(mealPlan)" mat-icon-button>
          <mat-icon>check</mat-icon>
        </button>
      </mat-list-item>
      <mat-divider></mat-divider>
    </ng-container>
  </mat-list>
</div>
  `,
  styleUrl: './assign-meal-plan-to-collaboration-dialog.scss'
})
export class AssignMealPlanToCollaborationDialog {
  constructor (public dialogRef: MatDialogRef<AssignMealPlanToCollaborationDialog>,
    @Inject(MAT_DIALOG_DATA) public data?: {
      summary: CollaborationSummary;
      mealPlans: MealPlanListItem[];
    }
  ) {

  }

  public get getMealPlans() {
    return this.data?.mealPlans.filter(mp => mp.status === MealPlanStatus.Active) ?? [];
  }

  onMealPlanSelected(mealPlan: MealPlanListItem) {
    this.dialogRef.close(mealPlan);
  }

}
