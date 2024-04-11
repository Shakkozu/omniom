import { Component } from '@angular/core';

@Component({
  selector: 'app-user-settings-page',
  template: `
  <mat-grid-list cols="4" rowHeight="260px">
    <mat-grid-tile [colspan]="1" [rowspan]="2" class="dashboard-card" >
      <app-meals-configuration></app-meals-configuration>
    </mat-grid-tile>
  </mat-grid-list>
  `,
  styleUrl: './user-settings-page.component.scss'
})
export class UserSettingsPageComponent {
  cards = [
    { title: 'Meals Configuration', cols: 1, rows: 1 },
    { title: 'User Profile', cols: 1, rows: 1 },
    { title: 'User Summary', cols: 2, rows: 2 },
  ];

}
