import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, State, StateContext, Selector, Store } from "@ngxs/store";
import { OnLoginSuccess, Login, Register, Logout, OnLogoutSuccess, AuthorizationComponentOpened } from "./authorization.actions";
import { AuthService } from "../auth.service";
import { FetchUserProfileConfiguration } from "../../user-profile/store/user-profile.actions";
import { jwtDecode } from 'jwt-decode';
import { FetchNutritionistProfile } from "../../nutritionist/store/nutritionist.actions";
import { FetchDishes } from "../../dish-configuration/store/dish-configuration.actions";
import { FetchProducts } from "../../products/store/products-catalogue.actions";


export interface UserSessionStateModel {
	errors: string[];
	username: string;
	userId?: string;
	sessionId?: string;
	timestamp?: number;
}

const defaultState: UserSessionStateModel = {
	errors: [],
	username: '',
	userId: undefined,
	sessionId: undefined,
	timestamp: undefined
}

@Injectable({
	providedIn: 'root'
})

@Injectable()
@State<UserSessionStateModel>({
	name: 'userSession',
	defaults: defaultState
})

export class AuthorizationState  {
	private static sessionLifetimeInMinutes = 45;

	constructor (private authorizationService: AuthService,
		private store: Store,
		private router: Router) {
	}

	@Selector()
	static errors(state: UserSessionStateModel) {
		return state.errors;
	}

	@Selector()
	static isAdmin(state: UserSessionStateModel): boolean {
		const token = state.sessionId;
		if (!token) {
			return false;
		}
		const decoded: { [key: string]: any } = jwtDecode(token);
		return decoded['role'] === 'Administrator';
	}
	

	@Action(Register)
	public register(ctx: StateContext<UserSessionStateModel>, { userDto }: Register) {
		this.authorizationService.register(userDto.email, userDto.password, userDto.confirmPassword)
			.subscribe({
				next: response => {
					if (response.success) {
						ctx.patchState({ errors: [] });
						ctx.dispatch(new Login(userDto.email, userDto.password));
					}
				},
				error: errorResponse => {
					ctx.patchState({ errors: errorResponse.error.errors });
				}
			});
	}

	@Action(AuthorizationComponentOpened)
	public authorizationComponentOpened(ctx: StateContext<UserSessionStateModel>) {
		ctx.patchState({ errors: [] });
	}

	@Action(Login)
	public login(ctx: StateContext<UserSessionStateModel>, { username, password }: Login) {
		this.authorizationService.login(username, password)
			.subscribe({
				next: response => {
					if (response.success) {
						ctx.patchState({ errors: [] });
						ctx.dispatch(new OnLoginSuccess(username, response.token, response.userId));
					}
				},
				error: response => {
					ctx.patchState({ errors: response.error.errors });
				}
			});
	}

	@Action(OnLoginSuccess)
	public createUserSession({ patchState }: StateContext<UserSessionStateModel>,
		{ username, sessionId, userId }: OnLoginSuccess) {
		patchState({
			username: username,
			userId: userId,
			sessionId: sessionId,
			timestamp: Date.now(),
		});
		this.store.dispatch(new FetchUserProfileConfiguration());
		this.store.dispatch(new FetchNutritionistProfile());
		this.store.dispatch(new FetchProducts(''));
		this.store.dispatch(new FetchDishes(''));
		this.router.navigate(['/']);
	}

	@Action(Logout)
	public logout(ctx: StateContext<UserSessionStateModel>) {
		const state = ctx.getState();
		if (!state.sessionId)
			return;
		this.authorizationService.logout().subscribe({
			next: () => { },
			complete: () => {
				ctx.dispatch(new OnLogoutSuccess());
			},
			error: () => { 
				console.error('Logout failed');
			}
		});
	}

	@Action(OnLogoutSuccess)
	public onLogoutSuccess(ctx: StateContext<UserSessionStateModel>) {
		ctx.patchState(defaultState);
		this.router.navigate(['/']);
	}

	@Selector()
	public static isAuthenticated(state: UserSessionStateModel) {
		return !!state.sessionId && !this.isTimestampOlderThan60Minutes(state.timestamp);
	}

	@Selector()
	static userSessionId(state: UserSessionStateModel) {
		return state.sessionId;
	}

	@Selector()
	static userId(state: UserSessionStateModel) {
		return state.userId;
	}

	@Selector()
	static username(state: UserSessionStateModel) {
		return state.username;
	}

	private static isTimestampOlderThan60Minutes(timestamp: number | undefined): boolean {
		if (!timestamp)
			return false;

		const now = Date.now();
		const millisecondsInOneMinute = 60000;

		const differenceInMilliseconds = now - timestamp;
		const differenceInMinutes = differenceInMilliseconds / millisecondsInOneMinute;
		return differenceInMinutes > this.sessionLifetimeInMinutes;
	}
}