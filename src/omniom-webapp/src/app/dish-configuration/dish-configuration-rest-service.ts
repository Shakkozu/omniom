import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Dish } from "./model";

@Injectable({providedIn: 'root'})
export class DishConfigurationRestService {
	constructor (private http: HttpClient) { }
	
	createDish(dish: Dish) {
		const url = `${ environment.apiUrl }/api/dishes`;
		return this.http.post(url, dish);
	}
}