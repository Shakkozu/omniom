import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NutritionDiaryService } from '../nutrition-diary-rest.service';
import { FetchNutritionSummaries, FetchNutritionSummariesSuccess, FetchNutritionSummariesFailure, SummaryDaySelected, AddNutritionEntry } from './nutrition-diary.actions';
import { DaySummary, MealType, NutritionDayDetails, NutritionDetailsGroupeByMeal, NutritionDiaryEntry } from '../model';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';
import { AddNutritionEntryComponent } from '../components/add-nutrition-entry/add-nutrition-entry.component';

export interface NutritionDiaryStateModel {
	daySummaries: DaySummary[];
	loading: boolean;
	selectedSummary: DaySummary | null;
	selectedNutritionDayDetails: NutritionDayDetails | null;
	nutritionDetailsLoading: boolean;
}

@State<NutritionDiaryStateModel>({
	name: 'nutritionDiary',
	defaults: {
		daySummaries: [],
		loading: false,
		selectedSummary: null,
		selectedNutritionDayDetails: null,
		nutritionDetailsLoading: false,
	}
})
@Injectable()
export class NutritionDiaryStore {
	constructor(private nutritionDiaryService: NutritionDiaryService,
		private matDialog: MatDialog) { }
		
	@Selector()
	static daySummaries(state: NutritionDiaryStateModel) {
		return state.daySummaries;
	}

	@Selector()
	static loading(state: NutritionDiaryStateModel) {
		return state.loading;
	}

	@Action(AddNutritionEntry)
	addNutritionEntry(ctx: StateContext<NutritionDiaryStateModel>, action: AddNutritionEntry) {
		const dialogRef = this.matDialog.open(AddNutritionEntryComponent, {
			width: '800px',
			data: { mealType: action.entry }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				ctx.dispatch(new FetchNutritionSummaries(new Date(), new Date()));
			}
		});
	}

	@Action(FetchNutritionSummaries)
	fetchDaySummaries(ctx: StateContext<NutritionDiaryStateModel>, action: FetchNutritionSummaries) {
		ctx.patchState({
			loading: true
		});
		return this.nutritionDiaryService.fetchDaySummaries(action.startDate, action.endDate).pipe(
			tap((daySummaries) => {
				ctx.dispatch(new FetchNutritionSummariesSuccess(daySummaries));
			})
		);
	}

	@Action(FetchNutritionSummariesSuccess)
	fetchDaySummariesSuccess(ctx: StateContext<NutritionDiaryStateModel>, action: FetchNutritionSummariesSuccess) {
		action.summaries.map(summary => summary.guid = uuidv4());
		ctx.patchState({
			daySummaries: action.summaries,
			loading: false
		});
	}

	@Action(FetchNutritionSummariesFailure)
	fetchDaySummariesFailure(ctx: StateContext<NutritionDiaryStateModel>, action: FetchNutritionSummariesFailure) {
		console.error(action.error);
		ctx.patchState({ loading: false });
	}

	@Action(SummaryDaySelected)
	summaryDaySelected(ctx: StateContext<NutritionDiaryStateModel>, action: SummaryDaySelected) {
		ctx.patchState({
			selectedSummary: action.summary,
			nutritionDetailsLoading: true
		});
		this.nutritionDiaryService.fetchDayDetails(action.summary.nutritionDay).subscribe(details => {
			ctx.patchState({
				selectedNutritionDayDetails: details[0],
				nutritionDetailsLoading: false
			});
		});
	}

	@Selector()
	static selectedSummary(state: NutritionDiaryStateModel) {
		return state.selectedSummary;
	}

	@Selector()
	static selectedNutritionDayDetails(state: NutritionDiaryStateModel) {
		return state.selectedNutritionDayDetails;
	}

	@Selector()
	static nutritionDayEntriesGroupedByMeal(state: NutritionDiaryStateModel): NutritionDetailsGroupeByMeal[] {
		if (!state.selectedNutritionDayDetails) {
			return [];
		}

		const result: { key: MealType; entries: NutritionDiaryEntry[]; }[] = [];
		const entries = state.selectedNutritionDayDetails.entries;
		entries.forEach(entry => {
			const key = entry.meal;
			const existing = result.find(r => r.key === key);
			if (existing) {
				existing.entries.push(entry);
			} else {
				result.push({ key, entries: [entry] });
			}

		});

		return result;
	}
		
	@Selector()
	static nutritionDetailsLoading(state: NutritionDiaryStateModel) {
		return state.nutritionDetailsLoading;
	}

}