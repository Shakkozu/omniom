import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NutritionDiaryService } from '../nutrition-diary-rest.service';
import { FetchNutritionSummaries,
	FetchNutritionSummariesSuccess,
	FetchNutritionSummariesFailure,
	AddNutritionEntries,
	ModifyNutritionEntriesSuccess,
	AddNutritionEntriesFailure,
	RemoveNutritionEntry,
	SummaryDaySelected } from './nutrition-diary.actions';
import { DaySummary, MealType, NutritionDayDetails, NutritionDetailsGroupeByMeal, NutritionDiaryEntry } from '../model';
import { v4 as uuidv4 } from 'uuid';

export interface NutritionDiaryStateModel {
	daySummaries: DaySummary[];
	loading: boolean;
	selectedNutritionDay: Date | null;
	selectedNutritionDayDetails: NutritionDayDetails | null;
	nutritionDetailsLoading: boolean;
}

@State<NutritionDiaryStateModel>({
	name: 'nutritionDiary',
	defaults: {
		daySummaries: [],
		loading: false,
		selectedNutritionDayDetails: null,
		selectedNutritionDay: null,
		nutritionDetailsLoading: false,
	}
})
@Injectable()
export class NutritionDiaryStore {
	constructor (private nutritionDiaryService: NutritionDiaryService) { }

	@Selector()
	static selectedNutritionDay(state: NutritionDiaryStateModel) {
		return state.selectedNutritionDay;
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

	@Selector()
	static daySummaries(state: NutritionDiaryStateModel) {
		return state.daySummaries;
	}

	@Selector()
	static loading(state: NutritionDiaryStateModel) {
		return state.loading;
	}

	@Action(RemoveNutritionEntry)
	removeNutritionEntry(ctx: StateContext<NutritionDiaryStateModel>, action: RemoveNutritionEntry) {
		const selectedDay = ctx.getState().selectedNutritionDay;
		if (!selectedDay) {
			console.error('Selected day is undefined');
			return;
		}

		this.nutritionDiaryService.removeNutritionEntry(action.entryId).subscribe({
			next: _ => ctx.dispatch([
				new ModifyNutritionEntriesSuccess(selectedDay)]),
			error: error => console.error(error)
		});
	}


	@Action(AddNutritionEntries)
	addNutritionEntries(ctx: StateContext<NutritionDiaryStateModel>, action: AddNutritionEntries) {
		ctx.patchState({
			loading: true
		});
		return this.nutritionDiaryService.addNutritionEntries(action.products, action.mealType, action.selectedDay)
			.subscribe({
				next: _ => ctx.dispatch(new ModifyNutritionEntriesSuccess(action.selectedDay)),
				error: error => ctx.dispatch(new AddNutritionEntriesFailure(error))
			});
	}

	@Action(ModifyNutritionEntriesSuccess)
	modifyNutritionEntriesSuccess(ctx: StateContext<NutritionDiaryStateModel>, action: ModifyNutritionEntriesSuccess) {
		this.nutritionDiaryService.fetchDaySummaries(action.date, action.date).subscribe(summaries => {
			let stateNutritionDaySummaries = ctx.getState().daySummaries;
			let modifiedSummary = ctx.getState().daySummaries.findIndex(s => s.nutritionDay === action.date);
			stateNutritionDaySummaries[modifiedSummary].guid = uuidv4();
			if (modifiedSummary >= 0) {
				stateNutritionDaySummaries[modifiedSummary] = {
					...summaries[0],
					guid: uuidv4(),
				};
			}
			ctx.dispatch(new SummaryDaySelected(stateNutritionDaySummaries[modifiedSummary].nutritionDay));
			ctx.patchState({
				daySummaries: stateNutritionDaySummaries,
				loading: false,
			});
		});
	}

	@Action(AddNutritionEntriesFailure)
	addNutritionEntriesFailure(ctx: StateContext<NutritionDiaryStateModel>, action: AddNutritionEntriesFailure) {
		console.error(action.error);
		ctx.patchState({ loading: false });
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
			selectedNutritionDay: action.nutritionDay,
			nutritionDetailsLoading: true
		});
		this.nutritionDiaryService.fetchDayDetails(action.nutritionDay).subscribe(details => {
			ctx.patchState({
				selectedNutritionDayDetails: details[0],
				nutritionDetailsLoading: false
			});
		});
	}
}