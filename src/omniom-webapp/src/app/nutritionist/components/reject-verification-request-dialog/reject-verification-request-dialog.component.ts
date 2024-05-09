import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { RejectVerificationRequest } from '../../store/nutritionist.actions';

@Component({
  selector: 'app-reject-verification-request-dialog',
  template: `
    <h2 mat-dialog-title>Odrzucenie wniosku o weryfikację</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="w-full">
      <mat-dialog-content>
        <mat-form-field class="w-96">
          <textarea matInput placeholder="Powód odrzucenia wniosku" formControlName="reason"></textarea>
          <mat-error *ngIf="form.controls['reason'].invalid">Podaj powód odrzucenia weryfikacji, musi mieć co najmniej 10 znaków</mat-error>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-raised-button mat-dialog-close>Anuluj</button>
        <button mat-raised-button type="submit" [mat-dialog-close]="true" color="warn" [disabled]="form.invalid">Odrzuć</button>
      </mat-dialog-actions>
    </form>
  `
})
export class RejectVerificationRequestDialogComponent {
  form: FormGroup;

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: {
      requestId: string,
      userId: string
     },
    private fb: FormBuilder,
    private store: Store
  ) { 
    this.form = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.form.invalid)
      return;
    console.log('dispatching reject verification request');

    this.store.dispatch(new RejectVerificationRequest(
      this.data.requestId,
      this.form.value.reason,
      this.data.userId,
    ));
  }
}