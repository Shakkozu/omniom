import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-active-collaborations-list',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  template: `
    <div class="mat-elevation-z8 bg-white">
  <table mat-table fixedLayout="true" [dataSource]="dataSource">

    <ng-container matColumnDef="username">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef>Użytkownik</th>
      <td mat-cell *matCellDef="let item"> {{item.username}} </td>
    </ng-container>

    <ng-container matColumnDef="userMail">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Email </th>
      <td mat-cell *matCellDef="let item"> {{item.userMail}} </td>
    </ng-container>

    <ng-container matColumnDef="dateFrom">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Ważny od </th>
      <td mat-cell *matCellDef="let item"> {{item.dateFrom | date}} </td>
    </ng-container>
    
    <ng-container matColumnDef="dateTo">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Ważny do </th>
      <td mat-cell *matCellDef="let item"> {{item.dateTo | date}} </td>
    </ng-container>
    
    <ng-container matColumnDef="mealPlanAttached">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Jadłospis </th>
      <td mat-cell *matCellDef="let item"> {{item.mealPlanAttached}} </td>
    </ng-container>

    <ng-container matColumnDef="options">
      <th class="w-1/5" mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let item">
      <div class="flex">
        <ng-container>
          <button  mat-icon-button (click)="attachMealPlan(item)" color="primary">
            <mat-icon>edit</mat-icon>
          </button>
        </ng-container>
      </div>
     </td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[20, 50, 100]" showFirstLastButtons></mat-paginator>
</div>
  `,
  styleUrl: './active-collaborations-list.component.scss'
})
export class ActiveCollaborationsListComponent implements OnInit {
  public dataSource$: Observable<CollaborationSummary[]> = of([]);
  public displayedColumns: string[] = ['username', 'userMail', 'dateFrom', 'dateTo', 'mealPlanAttached', 'options'];
  public dataSource: MatTableDataSource<CollaborationSummary> = new MatTableDataSource<CollaborationSummary>();

  attachMealPlan(summary: CollaborationSummary) {
  }

  ngOnInit(): void {
    this.dataSource$ = of([
      {
        username: 'Jan Kowalski',
        userMail: 'jan.kowalski@gmail.com',
        dateFrom: new Date(),
        dateTo: new Date().setDate(new Date().getDate() + 7),
        mealPlanAttachedGuid: '123',
        mealPlanAttached: 'Dietetyczny plan 1'
      },
      {
        username: 'Jan Kowalski2',
        userMail: 'jan.kowalski2@gmail.com',
        dateFrom: new Date(),
        dateTo: new Date().setDate(new Date().getDate() + 7),
        mealPlanAttachedGuid: '1235',
        mealPlanAttached: 'Dietetyczny plan 2'
      },
    ]);

    this.dataSource$.subscribe(data => {
      this.dataSource.data = data;
    });
  }

}


export interface CollaborationSummary {

}