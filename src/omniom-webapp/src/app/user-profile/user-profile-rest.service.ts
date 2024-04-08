import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
	providedIn: 'root',
})
export class UserProfileRestService implements IUserProfileService {
	constructor(private http: HttpClient) {
		this.http = http;
	}
}

@Injectable({
	providedIn: 'root',
})
export class FakeUserProfileService implements IUserProfileService {

	updateUserMealsConfiguration(mealsConfiguration: { mealName: string, enabled: boolean}[]): Observable<any> {
		return of({})
	}
}


export interface IUserProfileService {


}
