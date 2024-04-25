import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, forkJoin, from, map, of, switchMap } from "rxjs";

@Injectable({
	providedIn: 'root',
})
export class NutritionistRestService {
	constructor (private http: HttpClient,
	) { }

	async registerNutritionist(command: RegisterNutritionistCommand): Promise<Observable<void>> {
		const url = `${ environment.apiUrl }/api/nutritionist/register`;
		const filesBase64Encoded = await Promise.all(command.files.map(file => this.convertFileToBase64(file)));
		const nutritionist: RegisterNutritionistRequest = {
			name: command.name,
			surname: command.surname,
			city: command.city,
			termsAndConditionsAccepted: command.termsAndConditionsAccepted,
			filesBase64Encoded: filesBase64Encoded
		};

		return this.http.post<void>(url, nutritionist);
	}

	convertFileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = error => reject(error);
		});
	}
}

export interface RegisterNutritionistCommand {
	name: string;
	surname: string;
	city: string;
	termsAndConditionsAccepted: boolean;
	files: File[];
}
export interface RegisterNutritionistRequest {
	name: string;
	surname: string;
	city: string;
	termsAndConditionsAccepted: boolean;
	filesBase64Encoded: string[];
}
