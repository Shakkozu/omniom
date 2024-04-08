import { UserProfileConfiguration } from "../model";

export class FetchUserProfileConfiguration {
	static readonly type = '[UserProfile] Fetch user profile configuration';
	constructor() {}
}

export class FetchUserProfileConfigurationSuccess {
	static readonly type = '[UserProfile] Fetch user profile configuration success';
	constructor(public configuration: UserProfileConfiguration) {}
}

export class FetchUserProfileConfigurationFailure {
	static readonly type = '[UserProfile] Fetch user profile configuration failure';
	constructor(public error: string) {}
}

export class UpdateUserMealsConfiguration {
	static readonly type = '[UserProfile] Update user meals configuration';
	constructor (public configuration: { mealName: string; enabled: boolean; }[]) {}
}

export class UpdateUserMealsConfigurationSuccess {
	static readonly type = '[UserProfile] Update user meals configuration success';
	constructor() {}
}

export class UpdateUserMealsConfigurationFailure {
	static readonly type = '[UserProfile] Update user meals configuration failure';
	constructor(public error: string) {}
}
