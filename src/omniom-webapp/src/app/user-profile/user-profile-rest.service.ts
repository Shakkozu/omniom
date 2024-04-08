import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

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
	constructor(private http: HttpClient) {
		this.http = http;
	}
}


export interface IUserProfileService {


}
