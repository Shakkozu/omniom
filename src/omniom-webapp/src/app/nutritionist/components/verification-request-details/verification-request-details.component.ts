import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NutritionistAdministrationRestService, RequestAttachment, VerificationRequestDetails } from '../../nutritionist-administration-rest.service';
import { MatDialog } from '@angular/material/dialog';
import { RejectVerificationRequestDialogComponent } from '../reject-verification-request-dialog/reject-verification-request-dialog.component';
import { ConfirmVerificationRequest } from '../../store/nutritionist.actions';

@Component({
  selector: 'app-verification-request-details',
  template: `
    <div class="bg-white p-4 shadow-md rounded-lg" *ngIf="details$ | async as details">
      <h1 class="text-headline-medium">Verification Request Details</h1>
      <p class="text-body-large">Imię: {{details.name}}</p>
      <p class="text-body-large">Nazwisko: {{details.surname}}</p>
      <p class="text-body-large">Email: {{details.email}}</p>
      <p class="text-body-large">Miasto: {{details.city}}</p>
      <p class="text-body-large">Data utworzenia wniosku: {{details.createdAt | date}}</p>
      <mat-list>
          <mat-list-item *ngFor="let requestAttachment of details.attachments" >

            <mat-icon matListItemIcon>folder</mat-icon>
            <button mat-button matListItemTitle color="primary" (click)="showAttachment(requestAttachment)" class="text-body-medium">{{requestAttachment.attachment.fileName}}</button>
          </mat-list-item>
      </mat-list>

      <button mat-raised-button class="m-2" (click)="confirmRequest()" color="primary">Zatwierdź</button>
      <button mat-raised-button class="m-2" (click)="rejectRequest()" color="warn">Odrzuć</button>
    </div>
    
  `
})
export class VerificationRequestDetailsComponent implements AfterViewInit, OnDestroy {

  public details$: Observable<VerificationRequestDetails> | undefined;
  private dialogRef: any;
  constructor (private store: Store,
    private dialog: MatDialog,
    private adminService: NutritionistAdministrationRestService
  ) {

  }

  confirmRequest() {
    const details = this.store.selectSnapshot(state => state.nutritionist.selectedVerificationRequestDetails);

    this.store.dispatch(new ConfirmVerificationRequest(details.userId));
    
  }

  rejectRequest() {
    const details = this.store.selectSnapshot(state => state.nutritionist.selectedVerificationRequestDetails);
    console.log(details);
    this.dialog.open(RejectVerificationRequestDialogComponent, {
      width: '500px',
      height: '300px',
      data: {
        requestId: details.guid,
        userId: details.userId
      }
    });
    
  }

  ngAfterViewInit(): void {
    this.details$ = this.store.select(state => state.nutritionist.selectedVerificationRequestDetails);
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }

  showAttachment(attachment: RequestAttachment) {
    this.adminService.openPdf(attachment.requestGuid, attachment.id);
  }
}
