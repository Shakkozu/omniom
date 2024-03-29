import { Action } from '@ngxs/store';
import { DaySummary } from '../model';

export enum NutritionDiaryActionTypes {
	AddNutritionEntry = '[Nutrition Diary] Add Nutrition Entry',
	SummaryDaySelected = '[Nutrition Diary] Summary day selected',
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

export class SummaryDaySelected {
	static readonly type = NutritionDiaryActionTypes.SummaryDaySelected;

	constructor(public summary: DaySummary) {}
}

export type NutritionDiaryActions =
	| AddNutritionEntry
	| SummaryDaySelected
	| FetchNutritionSummaries
	| FetchNutritionSummariesSuccess
	| FetchNutritionSummariesFailure;


export class AddNutritionEntry {
	static readonly type = NutritionDiaryActionTypes.AddNutritionEntry;

	constructor(public entry: any) {}
}