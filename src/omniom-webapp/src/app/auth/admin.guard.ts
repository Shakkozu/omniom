import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthorizationState } from "./store/authorization.state";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class AdminGuard implements CanActivate {
	constructor (private store: Store, private router: Router) { }

	canActivate(
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.store.selectSnapshot(AuthorizationState.isAdmin);
	}
}