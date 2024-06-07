import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Dish, DishViewModel, MealCatalogueItemDto } from "./model";
import { Observable } from "rxjs";
import { MealCatalogueItem } from "../products/model";

@Injectable({providedIn: 'root'})
export class DishConfigurationRestService {
	constructor (private http: HttpClient) { }
	
	createDish(dish: Dish) {
		const url = `${ environment.apiUrl }/api/dishes`;
		return this.http.post(url, dish);
	}

	fetchDishes(searchPhrase: string): Observable<MealCatalogueItemDto[]> {
		const url = `${ environment.apiUrl }/api/dishes?search=${searchPhrase}`;
		return this.http.get<MealCatalogueItemDto[]>(url);
	}
}