import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MealPlanStatus } from '../../model';
import { Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MealPlanConfigurationRestService } from '../../meal-plan-configuration-rest-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meal-plans-list',
  template: `
    <div class="mat-elevation-z8 bg-white">
      <button (click)="onAddNewMealPlanButtonClicked()" class="m-2" mat-raised-button color="primary">Dodaj nowy</button>
  <table mat-table fixedLayout="true" [dataSource]="dataSource">

    <ng-container matColumnDef="name">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef>Jadłospis</th>
      <td mat-cell *matCellDef="let item"> {{item.name}} </td>
    </ng-container>

    <ng-container matColumnDef="status">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Status </th>
      <td mat-cell *matCellDef="let item"> {{translateStatus(item.status)}} </td>
    </ng-container>

    <ng-container matColumnDef="dailyCalories">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Kcal </th>
      <td mat-cell *matCellDef="let item"> {{item.dailyCalories}} </td>
    </ng-container>

    <ng-container matColumnDef="modifiedAt">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Data modyfikacji </th>
      <td mat-cell *matCellDef="let item"> {{item.modifiedAt | date}} </td>
    </ng-container>

    <ng-container matColumnDef="options">
      <th class="w-1/5" mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let item">
      <div class="flex">
        <ng-container *ngIf="item.status === 'Draft'">
          <button  mat-icon-button (click)="editMealPlan(item)" color="primary">
            <mat-icon>edit</mat-icon>
          </button>
        </ng-container>
        <button *ngIf="item.status === 'Active'" mat-icon-button (click)="previewMealPlan(item)" color="primary">
          <mat-icon>visibility</mat-icon>
        </button>
      </div>
     </td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[20, 50, 100]" showFirstLastButtons></mat-paginator>
</div>
  `,
  styleUrl: './meal-plans-list.component.scss'
})
export class MealPlansListComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'status', 'dailyCalories', 'modifiedAt', 'options'];
  public dataSource: MatTableDataSource<MealPlanListItem> = new MatTableDataSource<MealPlanListItem>();
  @Input() public mealPlans$: Observable<MealPlanListItem[]> = of([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor (private router: Router
  ) {

  }
  
  public translateStatus(status: MealPlanStatus): string {
    switch (status) {
      case MealPlanStatus.Draft:
        return 'Szkic';
      case MealPlanStatus.Active:
        return 'Aktywny';
      case MealPlanStatus.Archived:
        return 'Zarchiwizowany';
      default:
        return 'Nieznany';
    }
  }

  public onAddNewMealPlanButtonClicked() {
    this.router.navigate(['/nutritionist/meal-plan-configurator']);
  }

  public editMealPlan(mealPlan: MealPlanListItem) {
    this.router.navigate(['/nutritionist/meal-plan-configurator', mealPlan.guid]);
  }

  public previewMealPlan(mealPlan: MealPlanListItem) {
    this.router.navigate(['/nutritionist/meal-plan-configurator', mealPlan.guid]);
  }

  ngOnInit(): void {
    this.mealPlans$.subscribe((mealPlans) => {
      this.dataSource = new MatTableDataSource<MealPlanListItem>(mealPlans);
      this.dataSource.paginator = this.paginator;
    });
  }
}

export interface MealPlanListItem {
  guid: string;
  name: string;
  status: MealPlanStatus;
  dailyCalories: number;
  createdAt: Date;
  updatedAt: Date;
}