import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { NutritionistStore } from '../../store/nutritionist.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nutritionist-profile-page',
  templateUrl: './nutritionist-profile-page.component.html',
  styleUrl: './nutritionist-profile-page.component.scss'
})
export class NutritionistProfilePageComponent {
  public profile$ = this.store.select(NutritionistStore.profileDetails);
  public userIsRegisteredAsNutritionist$ = this.store.select(NutritionistStore.userIsRegisteredAsNutritionist);
  
  constructor (private store: Store, private route: Router
  ) {
    
  }
  
  addNewMealPlan() {
    this.route.navigate(['/new-meal-plan']);
  }
}
