import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NutritionDiaryService } from '../nutrition-diary-rest.service';
import { FetchNutritionSummaries, FetchNutritionSummariesSuccess, FetchNutritionSummariesFailure } from './nutrition-diary.actions';
import { DaySummary } from '../model';
import { v4 as uuidv4 } from 'uuid';

export interface NutritionDiaryStateModel {
	daySummaries: DaySummary[];
	loading: boolean;
	// other properties...
}

@State<NutritionDiaryStateModel>({
	name: 'nutritionDiary',
	defaults: {
		daySummaries: [],
		loading : false,
	}
})
@Injectable()
export class NutritionDiaryStore {
	constructor (private nutritionDiaryService: NutritionDiaryService) { }
	
	@Selector()
	static daySummaries(state: NutritionDiaryStateModel) {
		return state.daySummaries;
	}

	@Selector()
	static loading(state: NutritionDiaryStateModel) {
		return state.loading;
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

}
