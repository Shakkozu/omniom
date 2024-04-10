import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { MealType } from "../../nutrition-diary/model";
import { UserProfileRestService } from "../user-profile-rest.service";
import { FetchUserProfileConfiguration, UpdateUserMealsConfiguration } from "./user-profile.actions";

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
	constructor (private profileService: UserProfileRestService) {
	}

	@Selector()
	static mealsConfiguration(state: UserProfileStateModel): {key: MealType, enabled: boolean}[] {
		return state.mealsConfiguration;
	}
	
	@Selector()
	static loading(state: UserProfileStateModel): boolean {
		return state.loading;
	}

	@Action(FetchUserProfileConfiguration)
	initializeUserProfile(ctx: StateContext<UserProfileStateModel>) {
		ctx.patchState({
			loading: true
		})
		this.profileService.getUserMealsConfiguration().subscribe(
			config => {
				const mapped = config.map(m => ({ key: this.getMealTypeFromName(m.mealName), enabled: m.enabled }));
				ctx.patchState({
					mealsConfiguration: mapped,
					loading: false
				});
			},
			error => {
				console.error('Error fetching user meals configuration');
				ctx.patchState({
					loading: false
				});
			}
		);
	}

	@Action(UpdateUserMealsConfiguration)
	updateUserMealsConfiguration(ctx: StateContext<UserProfileStateModel>, action: UpdateUserMealsConfiguration) {
		ctx.patchState({
			loading: true
		})
		this.profileService.updateUserMealsConfiguration(action.configuration).subscribe(
			_ => { 
				const mapped = action.configuration.map(m => ({key: this.getMealTypeFromName(m.mealName), enabled: m.enabled}));
				ctx.patchState({
					mealsConfiguration: mapped,
					loading: false
				});
			},
			_ => { }
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