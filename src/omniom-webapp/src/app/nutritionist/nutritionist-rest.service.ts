import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root',
})
export class NutritionistRestService {
	constructor (private http: HttpClient) { 	
	}

	registerNutritionist(nutritionist: any): Observable<void> {
		const url = `${environment.apiUrl}/api/nutritionist/register`;
		return this.http.post<void>(url, nutritionist);
	}
}