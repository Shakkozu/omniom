import { Injectable } from "@angular/core";
import { Dish, DishViewModel, MealCatalogueItemDto } from "../model";
import { Action, Selector, State, StateContext, createSelector } from "@ngxs/store";
import { ClearSelection, CreateDish, DishDeselected, DishSelected, FetchDishes, SelectMultipleDishes as InitializeSelectionList, SelectDishToViewDetails } from "./dish-configuration.actions";
import { DishConfigurationRestService } from "../dish-configuration-rest-service";
import { CatalogueItem, MealCatalogueItem } from "../../products/model";

export interface DishConfigurationState {
	mealCatalogueItems: MealCatalogueItemDto[];
	dishes: CatalogueItem[];
	selectedCatalogueDishesIds: string[];
	excludedCatalogueDishesIds: string[];

}

export const initialState: DishConfigurationState = {
	mealCatalogueItems: [],
	dishes: [],
	selectedCatalogueDishesIds: [],
	excludedCatalogueDishesIds: [],

};

@State<DishConfigurationState>({
	name: 'dishConfiguration',
	defaults: initialState
})
@Injectable()

export class DishConfigurationStore {
	constructor (private restService: DishConfigurationRestService) { }
	
	@Selector()
	static dishDetailsById(itemId: string): (state: DishConfigurationState) => MealCatalogueItem | undefined {
		return createSelector([DishConfigurationStore], (state: DishConfigurationState) => {
			const mealCatalogueItemDto = state.mealCatalogueItems.find(item => item.guid === itemId);
			if (!mealCatalogueItemDto) {
				return undefined;
			}
			return MealCatalogueItem.fromMealDto(mealCatalogueItemDto);
		});
	}

	@Selector()
	static dishes(state: DishConfigurationState) {
		const excludedDishesIds = state.excludedCatalogueDishesIds;
		return state.dishes.filter(dish => !excludedDishesIds.includes(dish.guid));
	}

	@Selector()
	static selectedDishes(state: DishConfigurationState) {
		const selectedDishesIds = state.selectedCatalogueDishesIds;
		return state.dishes.filter(dish => selectedDishesIds.includes(dish.guid));
	}

	@Selector()
	static dishesWithoutSelection(state: DishConfigurationState) {
		const selectedDishesIds = state.selectedCatalogueDishesIds;
		return state.dishes.filter(dish => !selectedDishesIds.includes(dish.guid));
	}

	@Action(SelectDishToViewDetails)
	selectDishToViewDetails(ctx: StateContext<DishConfigurationState>, action: SelectDishToViewDetails) {
		const state = ctx.getState();
		ctx.patchState({
			selectedCatalogueDishesIds: [...state.selectedCatalogueDishesIds, action.dishId],
			excludedCatalogueDishesIds: state.excludedCatalogueDishesIds.filter(id => id !== action.dishId)
		});
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
					dishes: dishes.map(dish => CatalogueItem.fromDto(dish)),
					mealCatalogueItems: dishes,
				});
			},
			error: (_error) => console.error(_error)
		});
	}

	@Action(DishSelected)
	dishSelected(ctx: StateContext<DishConfigurationState>, action: DishSelected) {
		const state = ctx.getState();
		ctx.patchState({
			selectedCatalogueDishesIds: [...state.selectedCatalogueDishesIds, action.dishId],
			excludedCatalogueDishesIds: state.excludedCatalogueDishesIds.filter(id => id !== action.dishId)
		});
	}

	@Action(InitializeSelectionList)
	selectMultipleDishes (ctx: StateContext<DishConfigurationState>, action: InitializeSelectionList) {
		const state = ctx.getState();
		ctx.patchState({
			selectedCatalogueDishesIds: [...action.dishId],
			excludedCatalogueDishesIds: state.excludedCatalogueDishesIds.filter(id => !action.dishId.includes(id))
		});
	}

	@Action(ClearSelection)
	clearSelection(ctx: StateContext<DishConfigurationState>) {
		ctx.patchState({
			selectedCatalogueDishesIds: [],
			excludedCatalogueDishesIds: []
		});
	}
	

	@Action(DishDeselected)
	dishDeselected(ctx: StateContext<DishConfigurationState>, action: DishDeselected) {
		const state = ctx.getState();
		ctx.patchState({
			selectedCatalogueDishesIds: state.selectedCatalogueDishesIds.filter(id => id !== action.dishId),
			excludedCatalogueDishesIds: [...state.excludedCatalogueDishesIds, action.dishId]
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
