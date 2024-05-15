import { MealEntry } from "../products/model";

export interface Dish {
	name: string;
	guid: string;
	description: string;
	recipe: string;
	portions: number;
	ingredients: MealEntry[];
}