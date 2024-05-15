import { Dish } from "../model";

export enum DishConfigurationActionTypes {
	CreateDish = '[Dish Configuration] Create Dish',
	UpdateDish = '[Dish Configuration] Update Dish',
	DeleteDish = '[Dish Configuration] Delete Dish',
}

export class CreateDish {
	static readonly type = DishConfigurationActionTypes.CreateDish;

	constructor(public dish: Dish) {}
}