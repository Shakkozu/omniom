import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	
	constructor(private http: HttpClient) { }
	
	login(username: string, password: string): Observable<LoginResponse> {
		const loginData = { username, password };
		return this.http.post<LoginResponse>(`${ environment.apiUrl}/api/accounts/login`, loginData);
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