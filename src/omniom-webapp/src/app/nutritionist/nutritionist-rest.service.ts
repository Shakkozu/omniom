import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NutritionistProfile } from "./store/nutritionist.store";
import { CreateVerificationRequest } from "./store/nutritionist.actions";


@Injectable({
	providedIn: 'root',
})
export class NutritionistRestService {
	constructor (private http: HttpClient,
	) { }

	async registerNutritionist(command: RegisterNutritionistCommand): Promise<Observable<void>> {
		const url = `${ environment.apiUrl }/api/nutritionist/register`;
		const attachments = await Promise.all(command.files.map(file => this.convertFileToAttachment(file)));
		const nutritionist: RegisterNutritionistRequest = {
			name: command.name,
			surname: command.surname,
			city: command.city,
			email: command.email,
			termsAndConditionsAccepted: command.termsAndConditionsAccepted,
			attachments: attachments
		};

		return this.http.post<void>(url, nutritionist);
	}

	async createVerificationRequest(command: CreateVerificationRequest) : Promise<Observable<void>> {
		const url = `${ environment.apiUrl }/api/nutritionist/verification-requests`;
		const attachments = await Promise.all(command.files.map(file => this.convertFileToAttachment(file)));

		return this.http.post<void>(url, {attachments: attachments});
	}

	convertFileToAttachment(file: File): Promise<Attachment> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve({
				fileName: file.name,
				fileContentBase64Encoded: reader.result as string
			});
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

export interface VerificationAttachment extends Attachment {
	id: number;
}
