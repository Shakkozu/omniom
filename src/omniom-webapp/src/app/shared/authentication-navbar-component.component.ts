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
    <button routerLink="/auth/register" mat-button>Rejestracja</button>
    <button routerLink="/auth/login" mat-button>Zaloguj</button>
  </div>
  <div *ngIf='(authenticated$ | async)'>
    <span class="text-sm me-4">Witaj, {{username$ | async}}</span>
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

  public logout() {
    this.store.dispatch(new Logout());
  }
  
}
