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
