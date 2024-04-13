import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { MealType } from "../../nutrition-diary/model";
import { UserProfileRestService } from "../user-profile-rest.service";
import { FetchUserProfileConfiguration, UpdateNutritionTargetsConfiguration, UpdateUserMealsConfiguration } from "./user-profile.actions";
import { NutritionTargetsConfiguration } from "../model";
import { switchMap } from "rxjs";


export interface UserProfileStateModel {
	mealsConfiguration: { key: MealType, enabled: boolean }[];
	loading: boolean;
	nutritionTargets: NutritionTargetsConfiguration | null
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
		nutritionTargets: null,
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

	@Selector()
	static nutritionTargets(state: UserProfileStateModel): NutritionTargetsConfiguration | null {
		return state.nutritionTargets;
	}

	@Action(UpdateNutritionTargetsConfiguration)
	updateNutritionTargetsConfiguration(ctx: StateContext<UserProfileStateModel>, action: UpdateNutritionTargetsConfiguration) {
		ctx.patchState({
			loading: true
		})
		this.profileService.updateNutritionTargetsConfiguration(action.configuration).subscribe(
			_ => {
				ctx.patchState({
					nutritionTargets: action.configuration,
					loading: false
				});
			},
			error => {
				console.error('Error updating nutrition targets configuration');
				ctx.patchState({loading: false});
			 }
		);
	}


	@Action(FetchUserProfileConfiguration)
	initializeUserProfile(ctx: StateContext<UserProfileStateModel>) {
		ctx.patchState({
			loading: true
		})

		this.profileService.getNutritionTargetsConfiguration().subscribe(
			config => {
				ctx.patchState({
					nutritionTargets: config,
					loading: false
				});
			},
			error => {
				console.error('Error fetching user profile configuration');
				ctx.patchState({
					loading: false
				});
			}
		);

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
				throw new Error("Unknown meal name: " + name);
		}
	}
}