import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthorizationComponentOpened, Login } from '../store/authorization.actions';
import { AuthorizationState } from '../store/authorization.state';

@Component({
	selector: 'app-login',
	template: `
  <div class="container">
	<form mat-form [formGroup]="loginForm" (ngSubmit)="save()" autocomplete="on">
		<div class="row">
			<mat-form-field  appearance="fill">
				<mat-label>Login</mat-label>
				<input matinput formControlName="login" matInput autocomplete="username">
			</mat-form-field>
		</div>
		<div class="row">
			<mat-form-field appearance="fill">
				<mat-label>Enter your password</mat-label>
				<input formControlName="password" matInput [type]="hide ? 'password' : 'text'" autocomplete="current-password">
				<button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'"
					[attr.aria-pressed]="hide" type="button">
					<mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
				</button>
			</mat-form-field>
		</div>
		<div class="formErrors text-md my-2">
			<mat-error *ngFor="let error of errors$ | async">{{error}}</mat-error>
		</div>
		<button mat-button mat-flat-button type="submit" color="primary">Submit</button>
	</form>
</div>
`,
})
export class LoginComponent {
	public loginForm!: FormGroup;
	public hide: boolean = true;
	public errors$: Observable<string[]> = new Observable<string[]>();
	constructor (private fb: FormBuilder, private store: Store) {
		this.store.dispatch(new AuthorizationComponentOpened());
		this.loginForm = this.fb.group({
			login: [''],
			password: ['']
		});

		this.errors$ = this.store.select(AuthorizationState.errors);
	}

	public save(): void {
		this.store.dispatch(new Login(this.loginForm.value.login, this.loginForm.value.password));
	}

}
