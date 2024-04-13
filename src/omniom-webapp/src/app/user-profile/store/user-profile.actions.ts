import { NutritionTargetsConfiguration, UserProfileConfiguration } from "../model";

export class FetchUserProfileConfiguration {
	static readonly type = '[UserProfile] Fetch user profile configuration';
	constructor() {}
}

export class FetchUserProfileConfigurationSuccess {
	static readonly type = '[UserProfile] Fetch user profile configuration success';
	constructor(public configuration: UserProfileConfiguration) {}
}

export class UpdateUserMealsConfiguration {
	static readonly type = '[UserProfile] Update user meals configuration';
	constructor (public configuration: { mealName: string; enabled: boolean; }[]) {}
}

export class UpdateNutritionTargetsConfiguration {
	static readonly type = '[UserProfile] Update nutrition targets configuration';
	constructor (public configuration: NutritionTargetsConfiguration) {}
}



