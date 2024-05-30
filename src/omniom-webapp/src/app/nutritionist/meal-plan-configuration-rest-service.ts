import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { MealPlan } from "./model";
import { Observable } from "rxjs";



@Injectable({
	providedIn: 'root',
})
export class MealPlanConfigurationRestService {
	baseUrl: string;
	constructor (private http: HttpClient) { 
		this.baseUrl = `${ environment.apiUrl }/api/nutritionist/meal-plan-configuration`;

	}

	saveMealPlan(mealPlan: MealPlan): Observable<void> {
		const url = `${ this.baseUrl }/meal-plan`;
		return this.http.post<void>(url, mealPlan);
	}
}
