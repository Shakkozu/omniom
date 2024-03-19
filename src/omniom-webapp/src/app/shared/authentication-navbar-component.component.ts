import { state } from '@angular/animations';
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthorizationState } from '../auth/store/authorization.state';
import { Logout } from '../auth/store/authorization.actions';

@Component({
  selector: 'app-authentication-navbar-component',
  template: `
  <div *ngIf='!(authenticated$ | async)'>
    <button routerLink="/auth/register" mat-button>Register</button>
    <button routerLink="/auth/login" mat-button>Login</button>
  </div>
  <div *ngIf='(authenticated$ | async)'>
    <span class="text-sm me-4">Welcome, {{username$ | async}}</span>
    <button (click)="logout()" mat-button>Logout</button>
  </div>
  `,
})
export class AuthenticationNavbarComponentComponent {
  username$: Observable<string>;
  authenticated$: Observable<boolean>;
  constructor(private store: Store) {
    this.authenticated$ = this.store.select(AuthorizationState.isAuthenticated);
    this.username$ = this.store.select(AuthorizationState.username);
  }


  public logState() {
    this.store.select(x => x.userSession).subscribe(x => console.log(x));
    this.store.selectSnapshot(x => x.userSession.isAuthenticated);
  }

  public logout() {
    this.store.dispatch(new Logout());
  }
  
}
