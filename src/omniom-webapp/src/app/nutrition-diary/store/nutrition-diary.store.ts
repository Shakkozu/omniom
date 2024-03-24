import { State, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NutritionDiaryService } from '../nutrition-diary.service';
import { FetchNutritionSummaries, FetchNutritionSummariesSuccess, FetchNutritionSummariesFailure } from './nutrition-diary.actions';
import { DaySummary } from '../model';

export interface NutritionDiaryStateModel {
	daySummaries: DaySummary[];
	// other properties...
}

@State<NutritionDiaryStateModel>({
	name: 'nutritionDiary',
	defaults: {
		daySummaries: [],
	}
})
@Injectable()
export class NutritionDiaryStore {
	constructor(private nutritionDiaryService: NutritionDiaryService) {}

	@Action(FetchNutritionSummaries) // Add the 'type' property
	fetchDaySummaries(ctx: StateContext<NutritionDiaryStateModel>, action: FetchNutritionSummaries) {
		return this.nutritionDiaryService.fetchDaySummaries(action.startDate, action.endDate).pipe(
			tap((daySummaries) => {
				const state = ctx.getState();
				ctx.patchState({
					daySummaries: [...state.daySummaries, ...daySummaries]
				});
			})
		);
	}

	@Action(FetchNutritionSummariesSuccess)
	fetchDaySummariesSuccess(ctx: StateContext<NutritionDiaryStateModel>, action: FetchNutritionSummariesSuccess) {
		ctx.patchState({
			daySummaries: action.summaries
		});
	}

	@Action(FetchNutritionSummariesFailure)
	fetchDaySummariesFailure(ctx: StateContext<NutritionDiaryStateModel>, action: FetchNutritionSummariesFailure) {
		console.error(action.error);
	}

}