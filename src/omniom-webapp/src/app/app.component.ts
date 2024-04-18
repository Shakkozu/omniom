import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchUserProfileConfiguration } from './user-profile/store/user-profile.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor (private store: Store) { 
  }
  
  title = 'omniom-webapp';
}
