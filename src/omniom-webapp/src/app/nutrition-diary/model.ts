export interface DaySummaryDto {
	nutritionDay: Date;
	totalCalories: number;
	totalCarbohydrates: number;
	totalProteins: number;
	totalFats: number;
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
	userMealId: string;
	userMealName: string;
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

export interface MealProductEntry {
	guid: string;
	type: string;
	portionSize: number;
}
