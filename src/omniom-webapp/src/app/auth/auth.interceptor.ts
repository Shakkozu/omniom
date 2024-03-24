import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthorizationState } from './store/authorization.state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private store: Store) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// get the token from the state
		const token = this.store.selectSnapshot(AuthorizationState.userSessionId);

		if (token) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}

		return next.handle(request);
	}
}