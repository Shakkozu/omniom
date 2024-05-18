import { Component } from '@angular/core';
import { Dish } from '../../model';
import { Observable, map, of } from 'rxjs';
import { MaterialModule } from '../../../material.module';
import { MatSelectionListChange } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { NgxsModule, Store } from '@ngxs/store';
import { FetchDishes } from '../../store/dish-configuration.actions';
import { DishConfigurationStore } from '../../store/dish-configuration.state';

@Component({
  selector: 'app-dishes-list',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule
  ],
  templateUrl: './dishes-list.component.html',
  styleUrl: './dishes-list.component.scss'
})
export class DishesListComponent {
addButtonEnabled: any;
public selectedDishes$: Observable<ViewModel[]> = of([]);
  public notSelectedDishes$: Observable<ViewModel[]> = of([]);
  public displayedColumns: string[] = ['name', 'kcalPer100g', 'fats', 'carbs', 'proteins'];
  public selectionList: boolean = false;
  public dishes$: Observable<ViewModel[]> = this.store.select(DishConfigurationStore.dishes)
    .pipe(
      map(
        dishes => dishes.map(dish => new ViewModel(dish))
      ));
  constructor (private store: Store) {
    console.log('dispatching')
    this.store.dispatch(new FetchDishes(''));
  }

  searchPhraseUpdated(searchPhrase: string) {
    this.store.dispatch(new FetchDishes(searchPhrase));
  }

  dishSelected($event: MatSelectionListChange) {
    throw new Error('Method not implemented.');
  }
  dishDeselected($event: MatSelectionListChange) {
    throw new Error('Method not implemented.');
  }
  addDish(_t7: any) {
    throw new Error('Method not implemented.');
  }


}


export class ViewModel {
  name: string;
  guid: string;
  portion: number;
  kcalPerPortion: number;
  fatsPerPortion: number;
  carbsPerPortion: number;
  proteinsPerPortion: number;

  constructor (dish: Dish) {
    this.name = dish.name;
    this.guid = dish.guid;
    this.kcalPerPortion = 0; // todo
    this.fatsPerPortion = dish.ingredients.reduce((acc, ingredient) => acc + ingredient.fats, 0);
    this.carbsPerPortion = dish.ingredients.reduce((acc, ingredient) => acc + ingredient.carbohydrates, 0);
    this.proteinsPerPortion = dish.ingredients.reduce((acc, ingredient) => acc + ingredient.proteins, 0);
    this.portion = dish.portions;
  }

  

}