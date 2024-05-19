import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Dish, DishViewModel } from "./model";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class DishConfigurationRestService {
	constructor (private http: HttpClient) { }
	
	createDish(dish: Dish) {
		const url = `${ environment.apiUrl }/api/dishes`;
		return this.http.post(url, dish);
	}

	fetchDishes(): Observable<DishViewModel[]> {
		const url = `${ environment.apiUrl }/api/dishes`;
		return this.http.get<DishViewModel[]>(url);
	}
}