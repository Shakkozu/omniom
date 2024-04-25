import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	
	constructor(private http: HttpClient) { }
	
	login(email: string, password: string): Observable<LoginResponse> {
		const loginData = { email, password };
		return this.http.post<LoginResponse>(`${ environment.apiUrl}/api/accounts/login`, loginData);
	}

	logout(): Observable<any> {
		return this.http.post(`${ environment.apiUrl }/api/accounts/logout`, null );
	}

	register(email: string, password: string, confirmPassword: string): Observable<RegisterResponse>{
		const registerData = { email, password, confirmPassword };
		return this.http.post<RegisterResponse>(`${environment.apiUrl}/api/accounts/register`, registerData);
	}
}

export interface RegisterResponse {
	success: boolean;
	errors: string[];
}

export interface LoginResponse {
	success: boolean;
	token: string;
	userId: string;
	errors: string[];
}