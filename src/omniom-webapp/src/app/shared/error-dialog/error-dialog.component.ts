import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  template: `
  <h2 mat-dialog-title>Wystąpił błąd</h2>
<mat-dialog-content>
  <p style="white-space: pre-wrap;">{{formatErrorMessage(data.errorMessage)}}</p>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button mat-dialog-close>Ok</button>
</mat-dialog-actions>
    `,
  
})
export class ErrorDialogComponent {
  constructor (
    @Inject(MAT_DIALOG_DATA) public data: { errorMessage: string }
  ) { }

  public formatErrorMessage(errorMessage: string): string {
    return errorMessage.replace(/<br\/>/g, '\n');
  }
  

}
