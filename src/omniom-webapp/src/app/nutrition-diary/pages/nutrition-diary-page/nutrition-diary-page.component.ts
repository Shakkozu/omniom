import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchProducts } from '../../../products/store/products-catalogue.actions';
import { FetchDishes } from '../../../dish-configuration/store/dish-configuration.actions';

@Component({
  selector: 'app-nutrition-diary-page',
  templateUrl: './nutrition-diary-page.component.html',
})
export class NutritionDiaryPageComponent {
  constructor (private store: Store) { 
    this.store.dispatch(new FetchProducts(''));
    this.store.dispatch(new FetchDishes(''));
  }
}
