import { Action, Selector, State, StateContext } from "@ngxs/store";
import { MealPlan } from "../model";
import { Injectable } from "@angular/core";
import { SaveMealPlanAsDraft, SaveMealPlanAsDraftSuccess } from "./meal-plan-configuration.actions";
import { MealPlanConfigurationRestService } from "../meal-plan-configuration-rest-service";
import { Router } from "@angular/router";

export interface MealPlanConfigurationStateModel {
	mealPlans: MealPlan[];
}
@State<MealPlanConfigurationStateModel>({
	name: 'mealPlanConfiguration',
	defaults: {
		mealPlans: [],
	}
})
@Injectable()
export class MealPlanConfigurationStore {
	constructor (private nutrtionistService: MealPlanConfigurationRestService,
		private router: Router
	) {

	}

	@Selector()
	static mealPlans(state: MealPlanConfigurationStateModel) {
		return state.mealPlans;
	}

	@Action(SaveMealPlanAsDraft)
	saveMealPlanAsDraft(ctx: StateContext<MealPlanConfigurationStateModel>, action: SaveMealPlanAsDraft) {
		this.nutrtionistService.saveMealPlan(action.mealPlan).subscribe({
			next: () => {
				ctx.dispatch(new SaveMealPlanAsDraftSuccess(action.mealPlan));
			},
			error: (error) => {
				console.error('error while saving meal plan', error);
			},
		})

		const state = ctx.getState();
		ctx.patchState({
			mealPlans: [...state.mealPlans, action.mealPlan]
		});
	}

	@Action(SaveMealPlanAsDraftSuccess)
	saveMealPlanAsDraftSuccess(ctx: StateContext<MealPlanConfigurationStateModel>, action: SaveMealPlanAsDraftSuccess) {
		const state = ctx.getState();
		const modifiedMealPlan = state.mealPlans.find(mealPlan => mealPlan.guid === action.mealPlan.guid);
		if (!modifiedMealPlan) {
			ctx.patchState({
				mealPlans: [...state.mealPlans, action.mealPlan]
			});
			return;
		}
		let modifiedMealPlansCollection = state.mealPlans.filter(mealPlan => mealPlan.guid !== action.mealPlan.guid);
		modifiedMealPlansCollection.push(action.mealPlan);
		ctx.patchState({
			mealPlans: modifiedMealPlansCollection
		});
		this.router.navigate(['/nutritionist']);
	}
}