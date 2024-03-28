export interface DaySummaryDto {
	nutritionDay: Date;
	totalCalories: number;
	totalProtein: number;
	totalCarbs: number;
	totalFat: number;
}

export interface DaySummary extends DaySummaryDto {
	guid: string;
}

export interface NutritionDayDetails {
	date: Date;
	entries: NutritionDiaryEntry[];
}

export interface NutritionDiaryEntry {
	guid: string;
	productId: string;
	userId: string;
	productName: string;
	portionInGrams: number;
	meal: MealType;
	calories: number;
	proteins: number;
	carbohydrates: number;
	fats: number;
}

export enum MealType {
	Breakfast = 0,
	SecondBreakfast = 1,
	Dinner = 2,
	Snack = 3,
	Supper = 4
}


export interface NutritionDetailsGroupeByMeal {	
	key: MealType;
	entries: NutritionDiaryEntry[];
}