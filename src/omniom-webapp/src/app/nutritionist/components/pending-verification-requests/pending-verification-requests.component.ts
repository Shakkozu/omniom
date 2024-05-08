import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { FetchPendingVerificationRequests, FetchVerificationRequestDetails } from '../../store/nutritionist.actions';
import { PendingVerificationListItem } from '../../nutritionist-administration-rest.service';

@Component({
  selector: 'app-pending-verification-requests',
  template: `<div class="mat-elevation-z8">
  <table mat-table fixedLayout="true" [dataSource]="dataSource">

    <ng-container matColumnDef="name">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Imię </th>
      <td mat-cell *matCellDef="let item"> {{item.name}} </td>
    </ng-container>

    <ng-container matColumnDef="surname">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Nazwisko </th>
      <td mat-cell *matCellDef="let item"> {{item.surname}} </td>
    </ng-container>

    <ng-container matColumnDef="email">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Email </th>
      <td mat-cell *matCellDef="let item"> {{item.email}} </td>
    </ng-container>
    
    <ng-container matColumnDef="createdAt">
      <th class="w-1/4" mat-header-cell *matHeaderCellDef> Data utworzenia </th>
      <td mat-cell *matCellDef="let item"> {{item.createdAt | date}} </td>
    </ng-container>

    <ng-container matColumnDef="options">
      <th class="w-1/6" mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let item"> <button mat-icon-button (click)="showRequestDetails(item)" color="primary"><mat-icon>visibility</mat-icon></button> </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
</div>`,
})
export class PendingVerificationRequestsComponent implements AfterViewInit {
  constructor (private store: Store) {
  }

  displayedColumns: string[] = ['name', 'surname', 'email', 'createdAt', 'options'];
  public dataSource: MatTableDataSource<PendingVerificationListItem> = new MatTableDataSource<PendingVerificationListItem>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedRequestId: string | undefined;
  
  ngAfterViewInit(): void {
    this.store.select(state => state.nutritionist.pendingVerificationRequests).subscribe(data => {
      this.dataSource = new MatTableDataSource<PendingVerificationListItem>(data);
      this.dataSource.paginator = this.paginator;
    });
    this.store.dispatch(new FetchPendingVerificationRequests());
  }

  showRequestDetails(item: PendingVerificationListItem) {
    this.store.dispatch(new FetchVerificationRequestDetails(item.userId));
  }
}