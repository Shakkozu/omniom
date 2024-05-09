import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchNutritionistProfile } from '../../store/nutritionist.actions';
import { NutritionistStore } from '../../store/nutritionist.store';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-nutritionist-profile-page',
  templateUrl: './nutritionist-profile-page.component.html',
  styleUrl: './nutritionist-profile-page.component.scss'
})
export class NutritionistProfilePageComponent {
  public profile$ = this.store.select(NutritionistStore.profileDetails);
  public userIsRegisteredAsNutritionist$ = this.store.select(NutritionistStore.userIsRegisteredAsNutritionist);

  constructor(private store: Store, private route: Router) {
    
  }

}
