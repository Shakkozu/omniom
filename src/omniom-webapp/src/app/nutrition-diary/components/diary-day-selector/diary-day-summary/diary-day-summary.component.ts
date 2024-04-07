import { Component, Input } from '@angular/core';
import { DaySummary } from '../../../model';
import { Store } from '@ngxs/store';
import { SummaryDaySelected } from '../../../store/nutrition-diary.actions';

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
					<span matListItemLine>B: {{summary.totalProteins}}g T: {{summary.totalFats}}g W:{{summary.totalCarbohydrates}}g</span>
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

	constructor (private store: Store) {
	}

	onSummaryClicked(summary: DaySummary): void {
		this.store.dispatch(new SummaryDaySelected(summary.nutritionDay));
	}
}
