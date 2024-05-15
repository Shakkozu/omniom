import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class DishConfigurationRestService {
	constructor (private http: HttpClient) { }
	
	createDish(dish: any) {
		const url = `${ environment.apiUrl }/api/dishes`;
		return this.http.post(url, dish);
	}
}