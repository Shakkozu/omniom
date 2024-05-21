import { Injectable } from "@angular/core";
import { Dish, DishViewModel } from "../model";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ClearSelection, CreateDish, DishDeselected, DishSelected, FetchDishes } from "./dish-configuration.actions";
import { DishConfigurationRestService } from "../dish-configuration-rest-service";
import { CatalogueItem, MealCatalogueItem } from "../../products/model";

export interface DishConfigurationState {
	dishes: CatalogueItem[];
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
		return state.dishes.filter(dish => !excludedDishesIds.includes(dish.guid));
	}

	@Selector()
	static selectedDishes(state: DishConfigurationState) {
		const selectedDishesIds = state.selectedDishesIds;
		return state.dishes.filter(dish => selectedDishesIds.includes(dish.guid));
	}

	@Selector()
	static dishesWithoutSelection(state: DishConfigurationState) {
		const selectedDishesIds = state.selectedDishesIds;
		return state.dishes.filter(dish => !selectedDishesIds.includes(dish.guid));
	}


	@Action(CreateDish)
	createDish(ctx: StateContext<DishConfigurationState>, action: CreateDish) {
		const state = ctx.getState();
		this.restService.createDish(action.dish).subscribe({
			next: _ => {
				ctx.patchState({
					dishes: [...state.dishes, MealCatalogueItem.fromDish(action.dish)]
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
					dishes: dishes.map(dish => CatalogueItem.fromDto(dish))
				});
			},
			error: (_error) => console.error(_error)
		});
	}

	@Action(DishSelected)
	dishSelected(ctx: StateContext<DishConfigurationState>, action: DishSelected) {
		const state = ctx.getState();
		ctx.patchState({
			selectedDishesIds: [...state.selectedDishesIds, action.dishId],
			excludedDishesIds: state.excludedDishesIds.filter(id => id !== action.dishId)
		});
	}

	@Action(ClearSelection)
	clearSelection(ctx: StateContext<DishConfigurationState>) {
		ctx.patchState({
			selectedDishesIds: [],
			excludedDishesIds: []
		});
	}
	

	@Action(DishDeselected)
	dishDeselected(ctx: StateContext<DishConfigurationState>, action: DishDeselected) {
		const state = ctx.getState();
		ctx.patchState({
			selectedDishesIds: state.selectedDishesIds.filter(id => id !== action.dishId),
			excludedDishesIds: [...state.excludedDishesIds, action.dishId]
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
