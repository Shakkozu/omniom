import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
	providedIn: 'root',
})
export class CollaborationsRestService {
	baseUrl: string;
	constructor (private http: HttpClient,
	) { 
		this.baseUrl = `${ environment.apiUrl }/api/nutritionist/collaborations`;
		
	}

	attachMealPlanToCollaboration(collaborationId: string, mealPlanGuid: string): Observable<void> {
		return this.http.put<void>(`${ this.baseUrl }/${ collaborationId }/attach-meal-plan/${ mealPlanGuid }`, {});
	}
}