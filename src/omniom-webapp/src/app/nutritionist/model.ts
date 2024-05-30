import { MealType } from "../nutrition-diary/model";
import { MealCatalogueItem } from "../products/model";

export interface MealPlan {
	name: string;
	status: MealPlanStatus,
	dailyCalories: number;
	days: MealPlanDay[];
	guid: string;
}

export interface MealPlanDay {
	dayNumber: number;
	meals: MealPlanMeal[];
}

export interface MealPlanMeal {
	meal: MealType;
	products: MealPlanProduct[];
}

export interface MealPlanProduct {
	product: MealCatalogueItem;
	guid: string;
}

export interface DaySummary {
	dayNumber: number;
	totalCalories: string;
	totalProteins: string;
	totalFats: string;
	totalCarbs: string;
}


export enum MealPlanStatus {
	Active = 'Active',
	Draft = 'Draft',
	Archived = 'Archived'
}