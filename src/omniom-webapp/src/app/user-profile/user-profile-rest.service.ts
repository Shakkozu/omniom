import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
import { NutritionTargetsConfiguration } from "./model";

@Injectable({
	providedIn: 'root',
})
export class UserProfileRestService {
	constructor(private http: HttpClient) {
		this.http = http;
	}
	
	updateUserMealsConfiguration(mealsConfiguration: { mealName: string, enabled: boolean }[]): Observable<any> {
		const url = `${ environment.apiUrl }/api/user-profile/meals-configuration`;
		return this.http.post(url, { configuration: mealsConfiguration });
	}
	
	getUserMealsConfiguration(): Observable<{ mealName: string, enabled: boolean }[]> {
		const url = `${environment.apiUrl}/api/user-profile/meals-configuration`;
		return this.http.get<{ mealName: string, enabled: boolean }[]>(url);
	}

	updateNutritionTargetsConfiguration(configuration: NutritionTargetsConfiguration): Observable<any> {
		const url = `${ environment.apiUrl }/api/user-profile/nutrition-targets`;
		return this.http.post(url, { 
			Calories : configuration.calories,
			ProteinsPercents : configuration.proteinsPercents,
			CarbohydratesPercents : configuration.carbohydratesPercents,
			FatsPercents : configuration.fatsPercents,
			ProteinsGrams : configuration.proteinsGrams,
			CarbohydratesGrams : configuration.carbohydratesGrams,
			FatsGrams : configuration.fatsGrams,
		 });
	}

	getNutritionTargetsConfiguration(): Observable<NutritionTargetsConfiguration> {
		const url = `${environment.apiUrl}/api/user-profile/nutrition-targets`;
		return this.http.get<NutritionTargetsConfiguration>(url);
	}
}
 