import { Dish } from "../model";

export enum DishConfigurationActionTypes {
	CreateDish = '[Dish Configuration] Create Dish',
	UpdateDish = '[Dish Configuration] Update Dish',
	DeleteDish = '[Dish Configuration] Delete Dish',
	FetchDishes = '[Dish Configuration] Fetch Dishes',
}

export class CreateDish {
	static readonly type = DishConfigurationActionTypes.CreateDish;

	constructor(public dish: Dish) {}
}

export class FetchDishes {
	static readonly type = DishConfigurationActionTypes.FetchDishes;

	constructor(public searchPhrase: string) {}
}