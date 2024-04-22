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
			return 'Pole jest wymagane';
		}

		if (formControl.hasError('minlength')) {
			return `Minimalna długość to: ${ formControl?.errors?.['minlength'].requiredLength }`;
		}

		if (formControl.hasError('maxlength')) {
			return `Maksymalna długość to ${ formControl?.errors?.['maxlength'].requiredLength }`;
		}

		if (formControl.hasError('email')) {
			return `Wprowadź poprawny adres email`;
		}

		if (formControl.hasError('pattern')) {
			return `Niepoprawny format danych`;
		}

		if (formControl.hasError('passwordNotMatch')) {
			return `Hasła nie są takie same`;
		}

		return 'Niepoprawne dane';
	}
}
