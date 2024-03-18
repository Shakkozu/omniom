import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Injectable({ providedIn: 'root' })
export class FormErrorHandler {
	public handleError(formGroup: FormGroup, formControlName: string) {
		if (formGroup.touched === false || formGroup.get(formControlName)?.touched === false) {
			return '';
		}
		const formControl = formGroup.get(formControlName) as FormControl;
		if (!formControl || !formControl.invalid)
			return '';

		if (formControl.hasError('required')) {
			return 'Field is required';
		}

		if (formControl.hasError('minlength')) {
			return `Minimum length is ${ formControl?.errors?.['minlength'].requiredLength }`;
		}

		if (formControl.hasError('maxlength')) {
			return `Maximum length is ${ formControl?.errors?.['maxlength'].requiredLength }`;
		}

		if (formControl.hasError('email')) {
			return `Please enter a valid email`;
		}

		if (formControl.hasError('pattern')) {
			return `Invalid format`;
		}

		if (formControl.hasError('passwordNotMatch')) {
			return `Password does not match`;
		}

		return 'Validation error';
	}
}
