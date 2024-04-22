import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-and-conditions-dialog',
  template: `
    <h2 mat-dialog-title>Regulamin</h2>
    <mat-dialog-content class="mat-typography">
      <p>Rejestrując się jako dietetyk, akceptujesz następujące warunki:</p>
      <ul>
        <li>Posiadasz odpowiednie kwalifikacje i certyfikaty do wykonywania zawodu dietetyka.</li>
        <li>Zobowiązujesz się do dostarczania prawdziwych i aktualnych informacji o swoich kwalifikacjach i doświadczeniu.</li>
        <li>Zobowiązujesz się do przestrzegania zasad etyki zawodowej.</li>
        <li>Zgadzasz się na przestrzeganie wszelkich obowiązujących przepisów prawa dotyczących ochrony danych osobowych i prywatności pacjentów.</li>
      </ul>
    </mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button mat-dialog-close>Anuluj</button>
  <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Potwierdzam</button>
</mat-dialog-actions>
  `,
  styles: ``
})
export class TermsAndConditionsDialogComponent {
}
