import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchUserProfileConfiguration } from './user-profile/store/user-profile.actions';
import { AuthorizationState } from './auth/store/authorization.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor (private store: Store) { 
    if(store.selectSnapshot(AuthorizationState.isAuthenticated))
      this.store.dispatch(new FetchUserProfileConfiguration());
  }
  
  title = 'omniom-webapp';
}
