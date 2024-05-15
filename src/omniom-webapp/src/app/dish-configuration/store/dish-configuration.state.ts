import { Injectable } from "@angular/core";
import { Dish } from "../model";
import { Action, State, StateContext } from "@ngxs/store";
import { CreateDish } from "./dish-configuration.actions";
import { DishConfigurationRestService } from "../dish-configuration-rest-service";

export interface DishConfigurationState {
	dishes: Dish[];
}

export const initialState: DishConfigurationState = {
	dishes: []
};


@State<DishConfigurationState>({
	name: 'dishConfiguration',
	defaults: initialState
})
@Injectable()

export class DishConfigurationStore {
	constructor (private restService: DishConfigurationRestService) { }


	@Action(CreateDish)
	createDish(ctx: StateContext<DishConfigurationState>, action: CreateDish) {
		const state = ctx.getState();
		this.restService.createDish(action.dish).subscribe({
			next: _ => {
				ctx.patchState({
					dishes: [...state.dishes, action.dish]
				});
			},
			error: (_error) => console.error(_error)
		});
	}

}
