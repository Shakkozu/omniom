import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, forkJoin, from, map, of, switchMap } from "rxjs";
import { NutritionistProfile } from "./store/nutritionist.store";

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
			email: command.email,
			termsAndConditionsAccepted: command.termsAndConditionsAccepted,
			attachments: []
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

	fetchNutritionistProfile(): Observable<NutritionistProfile> {
		const url = `${ environment.apiUrl }/api/nutritionist/profile-details`;

		return this.http.get<NutritionistProfile>(url);
        
    }
}

export interface RegisterNutritionistCommand {
	name: string;
	surname: string;
	city: string;
	termsAndConditionsAccepted: boolean;
	email: string;
	files: File[];
}
export interface RegisterNutritionistRequest {
	name: string;
	surname: string;
	city: string;
	email: string;
	termsAndConditionsAccepted: boolean;
	attachments: Attachment[];
}

export interface Attachment {
	fileName: string;
	fileContentBase64Encoded: string;
}
