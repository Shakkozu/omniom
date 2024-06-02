import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { MealPlan } from "./model";
import { Observable } from "rxjs";
import { MealPlanListItem } from "./components/meal-plans-list/meal-plans-list.component";



@Injectable({
	providedIn: 'root',
})
export class MealPlanConfigurationRestService {
	baseUrl: string;
	constructor (private http: HttpClient) { 
		this.baseUrl = `${ environment.apiUrl }/api/nutritionist/meal-plans`;

	}

	saveMealPlan(mealPlan: MealPlan): Observable<void> {
		const url = `${ this.baseUrl }`;
		return this.http.post<void>(url, mealPlan);
	}
	
	getMealPlanDetails(guid: string): Observable<MealPlan> {
		const url = `${ this.baseUrl }/${ guid }`;
		return this.http.get<MealPlan>(url);
	}

	getMealPlans(): Observable<MealPlanListItem[]> {
		return this.http.get<MealPlanListItem[]>(this.baseUrl);
	}
}
