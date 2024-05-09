import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Attachment, VerificationAttachment } from "./nutritionist-rest.service";

@Injectable({
	providedIn: 'root',
})
export class NutritionistAdministrationRestService {
	constructor (private http: HttpClient,
	) { }

	fetchPendingVerificationRequests(): Observable<PendingVerificationListItem[]> {
		const url = `${ environment.apiUrl }/api/nutritionist/pending-verification-requests`;

		return this.http.get<PendingVerificationListItem[]>(url);
	}

	processVerificationRequest(userId: string, command: ProcessVerificationRequestCommand): Observable<void> {
		const url = `${ environment.apiUrl }/api/nutritionist/${ userId }/verify-qualifications`;

		return this.http.post<void>(url, command);
	}

	fetchVerificationRequestDetails(userId: string): Observable<VerificationRequestDetails> {
		const url = `${ environment.apiUrl }/api/nutritionist/${ userId }/verification-requests`;

		return this.http.get<VerificationRequestDetails>(url, { params: { userId } });
	}

	openPdf(requestId: string, attachmentId: number): void {
		const url = `${ environment.apiUrl }/api/nutritionist/pending-verification-requests/${ requestId }/attachments/${ attachmentId }`;
		this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
			const blobUrl = URL.createObjectURL(blob);
			window.open(blobUrl, '_blank', 'noopener,noreferrer');
		});
	}
}

export interface ProcessVerificationRequestCommand {
	responseStatus: NutritionistVerificationStatus;
	message: string;
}

export enum NutritionistVerificationStatus {
	Approved = 'Approved',
	Rejected = 'Rejected'
}


export interface PendingVerificationListItem {
	name: string;
	surname: string;
	email: string;
	userId: string;
	createdAt: string;
	guid: string;
}

export interface VerificationRequestDetails {
	name: string;
	surname: string;
	email: string;
	city: string;
	userId: string;
	guid: string;
	createdAt: string;
	attachments: RequestAttachment[];
}

export interface RequestAttachment {
	attachment: VerificationAttachment;
	id: number;
	requestGuid: string;
}