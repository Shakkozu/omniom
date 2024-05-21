import { Dish } from "../model";

export enum DishConfigurationActionTypes {
	CreateDish = '[Dish Configuration] Create Dish',
	UpdateDish = '[Dish Configuration] Update Dish',
	DeleteDish = '[Dish Configuration] Delete Dish',
	FetchDishes = '[Dish Configuration] Fetch Dishes',
	SelectDish = '[Dish Configuration] Select Dish',
	DeselectDish = '[Dish Configuration] Deselect Dish',
	ClearSelection = '[Dish Configuration] Clear Selection'

}

export class CreateDish {
	static readonly type = DishConfigurationActionTypes.CreateDish;

	constructor(public dish: Dish) {}
}

export class FetchDishes {
	static readonly type = DishConfigurationActionTypes.FetchDishes;

	constructor(public searchPhrase: string) {}
}

export class DishSelected {
	static readonly type = DishConfigurationActionTypes.SelectDish;

	constructor(public dishId: string) {}
}

export class DishDeselected {
	static readonly type = DishConfigurationActionTypes.DeselectDish;

	constructor(public dishId: string) {}
}

export class ClearSelection {
	static readonly type = DishConfigurationActionTypes.ClearSelection;

}