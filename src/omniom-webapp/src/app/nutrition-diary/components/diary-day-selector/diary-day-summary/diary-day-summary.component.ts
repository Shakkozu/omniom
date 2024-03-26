import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { DaySummary } from '../../../model';

@Component({
  selector: 'app-diary-day-summary',
  template: `<mat-card class="mt-2 rounded-lg pointer-events-auto
		 hover:bg-gray-200" [ngClass]="{'active': isActive}" (click)="onSummaryClicked(summary)">
			<mat-card-header>
				<mat-card-title>
					{{summary.nutritionDay | date:'longDate'}}
				</mat-card-title>
			</mat-card-header>
			<mat-card-content class="dashboard-card-content">
				<mat-list-item>
					<span matListItemTitle>{{summary.totalCalories }}kcal</span>
					<span matListItemLine>B: {{summary.totalProtein}}g T: {{summary.totalFat}}g W:{{summary.totalCarbs}}g</span>
				</mat-list-item>
			</mat-card-content>
			<mat-divider></mat-divider>
		</mat-card>
  `,
  styleUrl: './diary-day-summary.component.scss'
})
export class DiaryDaySummaryComponent {
  @Input() summary!: DaySummary;
  @Input() isActive!: boolean;
  @Output() summarySelected: EventEmitter<DaySummary> = new EventEmitter<DaySummary>();

  onSummaryClicked(summary: DaySummary): void {
    this.summarySelected.emit(summary);
  }
}
