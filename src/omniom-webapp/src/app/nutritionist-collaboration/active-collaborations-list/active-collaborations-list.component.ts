import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AssignMealPlanToCollaborationDialog } from '../assign-meal-plan-to-collaboration-dialog/assign-meal-plan-to-collaboration-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MealPlanListItem } from '../../nutritionist/components/meal-plans-list/meal-plans-list.component';
import { CollaborationsRestService } from '../collaborations-rest-service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-active-collaborations-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, AssignMealPlanToCollaborationDialog],
  template: `
    <mat-spinner *ngIf="loading"></mat-spinner>
  <div class="mat-elevation-z8 bg-white">
      <ng-container *ngIf="!loading" >
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
              <button *ngIf="mealPlanNotDefined(item)"  mat-icon-button (click)="attachMealPlan(item)" color="primary">
                <mat-icon>edit</mat-icon>
              </button>
            </ng-container>
          </div>
        </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    <mat-paginator [pageSizeOptions]="[20, 50, 100]"></mat-paginator>
    </ng-container>
  </div>

  `,
  styleUrl: './active-collaborations-list.component.scss'
})
export class ActiveCollaborationsListComponent implements OnInit {
  public loading: boolean = false;
  @Input() public mealPlans$: Observable<MealPlanListItem[]> = of([]);
  private mealPlans: MealPlanListItem[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource$: Observable<CollaborationSummary[]> = of([]);
  public displayedColumns: string[] = ['username', 'userMail', 'dateFrom', 'dateTo', 'mealPlanAttached', 'options'];
  public dataSource: MatTableDataSource<CollaborationSummary> = new MatTableDataSource<CollaborationSummary>();

  constructor (private matDialog: MatDialog,
    private collaborationsRestService: CollaborationsRestService,
  ) {

  }

  attachMealPlan(summary: CollaborationSummary) {
    this.matDialog.open(AssignMealPlanToCollaborationDialog, {
      width: '600px',
      height: '500px',
      data: {
        summary: summary,
        mealPlans: this.mealPlans
      }
    }).afterClosed().subscribe((mealPlan: MealPlanListItem) => {
      if (!mealPlan) return;

      this.loading = true;
      this.collaborationsRestService.attachMealPlanToCollaboration(summary.guid, mealPlan.guid).subscribe({
        next: () => { 
          summary.mealPlanAttachedGuid = mealPlan.guid;
          summary.mealPlanAttached = mealPlan.name;
        },
        complete: () => { this.loading = false; },
        error: () => {
          console.error('Error while attaching meal plan to collaboration');
          this.loading = false;
        }
          
      })
    });
  }

  mealPlanNotDefined(summary: CollaborationSummary) {
    return summary.mealPlanAttachedGuid === '';
  }

  ngOnInit(): void {
    this.mealPlans$.subscribe(data => {
      this.mealPlans = data;
    });
    this.dataSource$ = of([
      {
        username: 'Jan Kowalski',
        userMail: 'jan.kowalski@gmail.com',
        dateFrom: new Date(),
        dateTo: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        mealPlanAttachedGuid: '',
        mealPlanAttached: '',
        guid: '1234'
      },
      {
        username: 'Jan Kowalski2',
        userMail: 'jan.kowalski2@gmail.com',
        dateFrom: new Date(),
        dateTo: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        mealPlanAttachedGuid: '1235',
        mealPlanAttached: 'Dietetyczny plan 2',
        guid: '1235'
      },
    ]);

    this.dataSource$.subscribe(data => {
      this.dataSource = new MatTableDataSource<CollaborationSummary>(data);
      this.dataSource.paginator = this.paginator;
    });
  }

}


export interface CollaborationSummary {
  guid: string;
  username: string;
  userMail: string;
  dateFrom: Date;
  dateTo: Date;
  mealPlanAttachedGuid: string;
  mealPlanAttached: string;
}