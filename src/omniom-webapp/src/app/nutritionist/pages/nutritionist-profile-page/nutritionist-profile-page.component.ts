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

  constructor(private store: Store, private route: Router) {
    const userIsRegisteredAsNutritionist = store.selectSnapshot(NutritionistStore.userIsRegisteredAsNutritionist);
    if(!userIsRegisteredAsNutritionist) {
      this.route.navigate(['register']);
    }
  }

}
