import { Injectable } from "@angular/core";
import { Dish, DishViewModel } from "../model";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CreateDish, FetchDishes } from "./dish-configuration.actions";
import { DishConfigurationRestService } from "../dish-configuration-rest-service";

export interface DishConfigurationState {
	dishes: DishViewModel[];
	selectedDishesIds: string[];
	excludedDishesIds: string[];
}

export const initialState: DishConfigurationState = {
	dishes: [],
	selectedDishesIds: [],
	excludedDishesIds: []
};


@State<DishConfigurationState>({
	name: 'dishConfiguration',
	defaults: initialState
})
@Injectable()

export class DishConfigurationStore {
	constructor (private restService: DishConfigurationRestService) { }

	@Selector()
	static dishes(state: DishConfigurationState) {
		const excludedDishesIds = state.excludedDishesIds;
		return state.dishes.filter(p => !excludedDishesIds.includes(p.guid));
	}

	@Selector()
	static selectedDishes(state: DishConfigurationState) {
		return state.dishes;
	}

	@Selector()
	static dishesWithoutSelection(state: DishConfigurationState) {
		const selectedDishesIds = state.selectedDishesIds;
		return state.dishes.filter(p => !selectedDishesIds.includes(p.guid));
	}


	@Action(CreateDish)
	createDish(ctx: StateContext<DishConfigurationState>, action: CreateDish) {
		const state = ctx.getState();
		this.restService.createDish(action.dish).subscribe({
			next: _ => {
				ctx.patchState({
					dishes: [...state.dishes, this.convertDishToViewModel(action.dish)]
				});
			},
			error: (_error) => console.error(_error)
		});
	}

	@Action(FetchDishes)
	fetchDishes(ctx: StateContext<DishConfigurationState>) {
		this.restService.fetchDishes().subscribe({
			next: (dishes) => {
				ctx.patchState({
					dishes: dishes
				});
			},
			error: (_error) => console.error(_error)
		});
	}

	private convertDishToViewModel(dish: Dish): DishViewModel {
		return {
			...dish,
			kcalPerPortion: dish.ingredients.reduce((acc, curr) => acc + curr.kcal, 0) / dish.portions,
			fatsGramsPerPortion: dish.ingredients.reduce((acc, curr) => acc + curr.fats, 0) / dish.portions,
			carbsGramsPerPortion: dish.ingredients.reduce((acc, curr) => acc + curr.carbohydrates, 0) / dish.portions,
			proteinsGramsPerPortion: dish.ingredients.reduce((acc, curr) => acc + curr.proteins, 0) / dish.portions
		};
	}

}
