import { Component, Input } from '@angular/core';
import { Dish, DishViewModel } from '../../model';
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
  public dishes$: Observable<DishViewModel[]> = this.store.select(DishConfigurationStore.dishes);
  public selectedDishes$: Observable<DishViewModel[]> = of([]);
  public notSelectedDishes$: Observable<DishViewModel[]> = of([]);
  @Input() selectionList: boolean = false;
  public displayedColumns: string[] = ['name', 'kcalPer100g', 'fats', 'carbs', 'proteins'];
  constructor (private store: Store) {
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
