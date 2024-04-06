import { DaySummary, MealProductEntry, MealType } from '../model';

export enum NutritionDiaryActionTypes {
	AddNutritionEntries = '[Nutrition Diary] Add Nutrition Entries',
	AddNutritionEntriesSuccess = '[Nutrition Diary] Add Nutrition Entries Success',
	AddNutritionEntriesFailure = '[Nutrition Diary] Add Nutrition Entries Failure',
	SummaryDaySelected = '[Nutrition Diary] Summary day selected',
	FetchNutritionSummaries = '[Nutrition Diary] Fetch Nutrition Summaries',
	FetchNutritionSummariesSuccess = '[Nutrition Diary] Fetch Nutrition Summaries Success',
	FetchNutritionSummariesFailure = '[Nutrition Diary] Fetch Nutrition Summaries Failure',
	RefreshNutritionDaySummary = '[Nutrition Diary] Refresh Nutrition Day Summary'
}

export class AddNutritionEntries {
	static readonly type = NutritionDiaryActionTypes.AddNutritionEntries;

	constructor (public products: MealProductEntry[],
		public mealType: MealType,
		public selectedDay: Date) { }
}

export class AddNutritionEntriesSuccess {
	static readonly type = NutritionDiaryActionTypes.AddNutritionEntriesSuccess;

	constructor (public date: Date) { }
}

export class AddNutritionEntriesFailure {
	static readonly type = NutritionDiaryActionTypes.AddNutritionEntriesFailure;

	constructor (public error: string) { }
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

export class RefreshNutritionDaySummary {
	static readonly type = NutritionDiaryActionTypes.RefreshNutritionDaySummary;

	constructor (public date: Date) {
	}
}

export class SummaryDaySelected {
	static readonly type = NutritionDiaryActionTypes.SummaryDaySelected;

	constructor(public summary: DaySummary) {}
}

export type NutritionDiaryActions =
	| AddNutritionEntries
	| SummaryDaySelected
	| FetchNutritionSummaries
	| FetchNutritionSummariesSuccess
	| FetchNutritionSummariesFailure;
