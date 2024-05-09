import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchUserProfileConfiguration } from './user-profile/store/user-profile.actions';
import { AuthorizationState } from './auth/store/authorization.state';
import { FetchNutritionistProfile } from './nutritionist/store/nutritionist.actions';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  isAdmin$: Observable<boolean> = of(false);
  constructor (private store: Store) { 
    this.isAdmin$ = this.store.select(AuthorizationState.isAdmin);
    this.store.dispatch(new FetchUserProfileConfiguration());
    this.store.dispatch(new FetchNutritionistProfile());
  }
  
  title = 'omniom-webapp';
}
