import { Component, OnInit, ViewChild } from '@angular/core';
import { MealPlanStatus } from '../../model';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PendingVerificationListItem } from '../../nutritionist-administration-rest.service';
import { FetchVerificationRequestDetails } from '../../store/nutritionist.actions';
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
      <th class="w-1/6" mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let item"> <button mat-icon-button (click)="showRequestDetails(item)" color="primary"><mat-icon>visibility</mat-icon></button> </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
</div>
  `,
  styleUrl: './meal-plans-list.component.scss'
})
export class MealPlansListComponent implements OnInit {
  public mealPlansListItems$: Observable<MealPlanListItem[]> = of([]);
  public displayedColumns: string[] = ['name', 'status', 'dailyCalories', 'modifiedAt', 'options'];
  public dataSource: MatTableDataSource<MealPlanListItem> = new MatTableDataSource<MealPlanListItem>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor (private store: Store,
    private mealPlanRestService: MealPlanConfigurationRestService,
    private router: Router
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

  ngOnInit(): void {
    this.mealPlanRestService.getMealPlans().subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource<MealPlanListItem>(data);
      this.dataSource.paginator = this.paginator;
    });
  }


  showRequestDetails(item: PendingVerificationListItem) {
    this.store.dispatch(new FetchVerificationRequestDetails(item.userId));
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface MealPlanListItem {
  guid: string;
  name: string;
  status: MealPlanStatus;
  dailyCalories: number;
  createdAt: Date;
  updatedAt: Date;
}