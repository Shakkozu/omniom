import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NutritionistStore } from '../../store/nutritionist.store';
import { Router } from '@angular/router';
import { MealPlanConfigurationRestService } from '../../meal-plan-configuration-rest-service';
import { Observable, of } from 'rxjs';
import { MealPlanListItem } from '../../components/meal-plans-list/meal-plans-list.component';

@Component({
  selector: 'app-nutritionist-profile-page',
  templateUrl: './nutritionist-profile-page.component.html',
  styleUrl: './nutritionist-profile-page.component.scss'
})
export class NutritionistProfilePageComponent implements OnInit{
  public profile$ = this.store.select(NutritionistStore.profileDetails);
  public userIsRegisteredAsNutritionist$ = this.store.select(NutritionistStore.userIsRegisteredAsNutritionist);
  public mealPlans$: Observable<MealPlanListItem[]> = of([]);
  
  constructor (private store: Store, private route: Router,
    private mealPlansRestService: MealPlanConfigurationRestService
  ) {
    
  }

  ngOnInit(): void {
    this.mealPlans$ = this.mealPlansRestService.getMealPlans();
  }
  
  addNewMealPlan() {
    this.route.navigate(['/new-meal-plan']);
  }
}
