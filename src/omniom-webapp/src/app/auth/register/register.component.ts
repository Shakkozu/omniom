import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormErrorHandler } from "../../shared/form-error-handler";
import { Store } from "@ngxs/store";
import { Register } from "../store/authorization.actions";
import { Observable, of } from "rxjs";
import { AuthorizationState } from "../store/authorization.state";


@Component({
  selector: 'app-register',
  template: `
  <div class="container">
  <form mat-form [formGroup]="registrationForm" (submit)="onSubmit()" autocomplete="on">
      <div class="row my-4">
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matinput formControlName="email" autocomplete="email" email matInput>
          <mat-error>{{getErrorMessage("email")}}</mat-error>
        </mat-form-field>
      </div>
      <div class="row my-4">
        <mat-form-field appearance="fill">
          <mat-label>Enter your password</mat-label>
          <input formControlName="password" autocomplete="new-password" matInput [type]="hide ? 'password' : 'text'">
          <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'"
						  [attr.aria-pressed]="hide" type="button">
						  <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
					</button>
          <mat-error>{{getErrorMessage("password")}}</mat-error>
        </mat-form-field>
      </div>
      <div class="row my-4">
        <mat-form-field appearance="fill">
          <mat-label>Confirm your password</mat-label>
          <input formControlName="confirmPassword" autocomplete="new-password" matInput [type]="hide ? 'password' : 'text'">
          <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'"
						  [attr.aria-pressed]="hide" type="button">
						  <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error>{{getErrorMessage("confirmPassword")}}</mat-error>
        </mat-form-field>
      </div>
    <div class="formErrors text-md my-2">
      <mat-error *ngFor="let error of errors$ | async">{{error}}</mat-error>
    </div>
    <button mat-button mat-flat-button color="primary" class="my-4" type="submit">Submit</button>
  </form>
</div>
  `
})
export class RegisterComponent {
  public hide: boolean = true;
  registrationForm: FormGroup;
  errors$!: Observable<string[]>;

  passwordMatchValidator: (formGroup: FormGroup) => { passwordNotMatch: boolean; } | null;

  constructor (private formBuilder: FormBuilder, private http: HttpClient,
    private store: Store,
    private formErrorHandler: FormErrorHandler) {
    this.passwordMatchValidator = (formGroup: FormGroup) => {
      const { value: password } = formGroup.get('password')!;
      const { value: confirmPassword } = formGroup.get('confirmPassword')!;
      return password === confirmPassword ? null : { passwordNotMatch: true };
    };
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
    this.errors$ = this.store.select(AuthorizationState.errors);
  }

  public getErrorMessage(formControlName: string): string {
    return this.formErrorHandler.handleError(this.registrationForm, formControlName);
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.validate();
      return;
    }

    const formData = this.registrationForm.value;
    this.store.dispatch(new Register({ email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword}));
  }

  private validate() {
    if (this.registrationForm.get('password')?.value !== this.registrationForm.get('confirmPassword')?.value) {
      this.errors$ = of(['Passwords do not match']);
    }
  }
}
