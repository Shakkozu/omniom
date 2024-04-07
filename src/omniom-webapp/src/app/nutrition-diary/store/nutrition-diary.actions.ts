import { DaySummary, MealProductEntry, MealType } from '../model';

export enum NutritionDiaryActionTypes {
	AddNutritionEntries = '[Nutrition Diary] Add Nutrition Entries',
	ModifyNutritionEntriesSuccess = '[Nutrition Diary] Modify Nutrition Entries Success',
	AddNutritionEntriesFailure = '[Nutrition Diary] Add Nutrition Entries Failure',
	SummaryDaySelected = '[Nutrition Diary] Summary day selected',
	FetchNutritionSummaries = '[Nutrition Diary] Fetch Nutrition Summaries',
	FetchNutritionSummariesSuccess = '[Nutrition Diary] Fetch Nutrition Summaries Success',
	FetchNutritionSummariesFailure = '[Nutrition Diary] Fetch Nutrition Summaries Failure',
	RefreshNutritionDaySummary = '[Nutrition Diary] Refresh Nutrition Day Summary',
	RemoveNutritionEntry = '[Nutrition Diary] Remove nutriiton entry'
}

export class RemoveNutritionEntry {
	static readonly type = NutritionDiaryActionTypes.RemoveNutritionEntry;

	constructor(public entryId: string, public mealType: MealType) {}
}

export class AddNutritionEntries {
	static readonly type = NutritionDiaryActionTypes.AddNutritionEntries;

	constructor (public products: MealProductEntry[],
		public mealType: MealType,
		public selectedDay: Date) { }
}

export class ModifyNutritionEntriesSuccess {
	static readonly type = NutritionDiaryActionTypes.ModifyNutritionEntriesSuccess;

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

	constructor(public nutritionDay: Date) {}
}

export type NutritionDiaryActions =
	| AddNutritionEntries
	| FetchNutritionSummaries
	| FetchNutritionSummariesSuccess
	| FetchNutritionSummariesFailure;
