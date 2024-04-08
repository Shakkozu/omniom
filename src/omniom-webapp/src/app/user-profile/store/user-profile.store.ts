import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { MealType } from "../../nutrition-diary/model";
import { FakeUserProfileService } from "../user-profile-rest.service";
import { UpdateUserMealsConfiguration } from "./user-profile.actions";

export interface UserProfileStateModel {
	mealsConfiguration: { key: MealType, enabled: boolean }[];
	loading: boolean;

}

@State<UserProfileStateModel>({
	name: 'userProfile',
	defaults: {
		mealsConfiguration: [
			{key: MealType.Breakfast, enabled: true},
			{key: MealType.SecondBreakfast, enabled: true},
			{key: MealType.Dinner, enabled: true},
			{key: MealType.Snack, enabled: true},
			{key: MealType.Supper, enabled: true},
		],
		loading: false,
	},
})
@Injectable()
export class UserProfileStore {
	constructor (private profileService: FakeUserProfileService) { 
	}

	@Selector()
	static mealsConfiguration(state: UserProfileStateModel): {key: MealType, enabled: boolean}[] {
		return state.mealsConfiguration;
	}
	
	@Selector()
	static loading(state: UserProfileStateModel): boolean {
		return state.loading;
	}

	@Action(UpdateUserMealsConfiguration)
	updateUserMealsConfiguration(ctx: StateContext<UserProfileStateModel>, action: UpdateUserMealsConfiguration) {
		ctx.patchState({
			loading: true
		})
		console.log('loading enabled')
		this.profileService.updateUserMealsConfiguration(action.configuration).subscribe(
			complete => { 
				const mapped = action.configuration.map(m => ({key: this.getMealTypeFromName(m.mealName), enabled: m.enabled}));
				ctx.patchState({
					mealsConfiguration: mapped,
					loading: false
				});
			},
			error => { }
		);
	}

	private getMealTypeFromName(name: string): MealType {
		switch (name) {
			case 'Breakfast':
				return MealType.Breakfast;
			case 'SecondBreakfast':
				return MealType.SecondBreakfast;
			case 'Dinner':
				return MealType.Dinner;
			case 'Snack':
				return MealType.Snack;
			case 'Supper':
				return MealType.Supper;
			default:
				throw new Error("Unknown meal name");
		}
	}
}