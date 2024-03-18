import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormErrorHandler } from "../../shared/form-error-handler";
import { AuthService } from "../auth.service";
import { Store } from "@ngxs/store";
import { Register } from "../store/authorization.actions";
import { Subject, takeUntil } from "rxjs";


@Component({
  selector: 'app-register',
  template: `
  <div class="container ms-4">
  <form mat-form [formGroup]="registrationForm" (submit)="onSubmit()">
    <div class="grid">
      <div class="row my-4">
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matinput formControlName="email" email matInput>
          <mat-error>{{getErrorMessage("email")}}</mat-error>
        </mat-form-field>
      </div>
      <div class="row my-4">
        <mat-form-field appearance="fill">
          <mat-label>Enter your password</mat-label>
          <input formControlName="password" matInput [type]="hide ? 'password' : 'text'">
          <mat-error>{{getErrorMessage("password")}}</mat-error>
        </mat-form-field>
      </div>
      <div class="row my-4">
        <mat-form-field appearance="fill">
          <mat-label>Confirm your password</mat-label>
          <input formControlName="confirmPassword" matInput [type]="hide_confirmation ? 'password' : 'text'">
          <mat-error>{{getErrorMessage("confirmPassword")}}</mat-error>
        </mat-form-field>
      </div>
    </div>
    <mat-error>{{errors}}</mat-error>
    <button mat-button mat-flat-button color="primary" type="submit">Submit</button>
  </form>
</div>
  `
})
export class RegisterComponent {
  public hide: boolean = true;
  public hide_confirmation: boolean = true;
  private destroy$: Subject<void> = new Subject();
  registrationForm: FormGroup;
  errors: string[] = [];

  passwordMatchValidator: (formGroup: FormGroup) => { passwordNotMatch: boolean; } | null;

  constructor (private formBuilder: FormBuilder, private http: HttpClient,
    private store: Store,
    private formErrorHandler: FormErrorHandler,
    private authService: AuthService) {
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
    this.store.dispatch(new Register(formData)).pipe(takeUntil(this.destroy$));

  }

  private validate() {
    if (this.registrationForm.get('password')?.value !== this.registrationForm.get('confirmPassword')?.value) {
      this.errors = ['Passwords do not match'];
    }
  }
}
