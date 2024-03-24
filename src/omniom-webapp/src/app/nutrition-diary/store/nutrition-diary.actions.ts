import { Action } from '@ngxs/store';

export enum NutritionDiaryActionTypes {
	FetchNutritionSummaries = '[Nutrition Diary] Fetch Nutrition Summaries',
	FetchNutritionSummariesSuccess = '[Nutrition Diary] Fetch Nutrition Summaries Success',
	FetchNutritionSummariesFailure = '[Nutrition Diary] Fetch Nutrition Summaries Failure',
}

export class FetchNutritionSummaries {
	static readonly type = NutritionDiaryActionTypes.FetchNutritionSummaries;

	constructor(public startDate: Date, public endDate: Date) {}
}

export class FetchNutritionSummariesSuccess {
	static readonly type = NutritionDiaryActionTypes.FetchNutritionSummariesSuccess;

	constructor(public summaries: any[]) {}
}

export class FetchNutritionSummariesFailure {
	static readonly type = NutritionDiaryActionTypes.FetchNutritionSummariesFailure;

	constructor(public error: string) {}
}

export type NutritionDiaryActions =
	| FetchNutritionSummaries
	| FetchNutritionSummariesSuccess
	| FetchNutritionSummariesFailure;