import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { MaterialModule } from '../../../material.module';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { NgxsModule, Store } from '@ngxs/store';
import { FetchDishes, DishSelected as DishSelected, DishDeselected } from '../../store/dish-configuration.actions';
import { DishConfigurationStore } from '../../store/dish-configuration.state';
import { ListChangeType, ProductListChangedEvent as CatalogueItemListChangedEvent } from '../../../products/components/products-list/products-list.component';
import { CatalogueItem, CatalogueItemType, MealCatalogueItem } from '../../../products/model';
import { MatDialog } from '@angular/material/dialog';
import { DishDetailsComponent } from '../dish-details/dish-details.component';

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
  public dishes$: Observable<CatalogueItem[]> = this.store.select(DishConfigurationStore.dishes);
  public selectedDishes$: Observable<CatalogueItem[]> = this.store.select(DishConfigurationStore.selectedDishes);
  public notSelectedDishes$: Observable<CatalogueItem[]> = this.store.select(DishConfigurationStore.dishesWithoutSelection);
  @Input() selectionList: boolean = false;
  @ViewChild(MatSelectionList) selectedDishesList!: MatSelectionList;
  @ViewChild(MatSelectionList) notSelectedDishesList!: MatSelectionList;

  @Output() dishListChanged: EventEmitter<CatalogueItemListChangedEvent> = new EventEmitter<CatalogueItemListChangedEvent>();
  
  public displayedColumns: string[] = ['name', 'kcalPer100g', 'fats', 'carbs', 'proteins'];
  constructor (private store: Store,
    private matDialog: MatDialog) {
    this.store.dispatch(new FetchDishes(''));
  }

  searchPhraseUpdated(searchPhrase: string) {
    this.store.dispatch(new FetchDishes(searchPhrase));
  }

  dishSelected($event: MatSelectionListChange) {
    const dishId = $event.options[0].value;
    const selected = $event.options[0].selected;
    if (!selected)
      return;

    this.store.dispatch(new DishSelected(dishId));
    this.dishListChanged.emit({ type: 'selected', catalogueItemId: dishId, itemType: CatalogueItemType.Meal});
  }

  dishDeselected($event: MatSelectionListChange) {
    const dishId = $event.options[0].value;
    const selected = $event.options[0].selected;
    if (selected)
      return;

    this.store.dispatch(new DishDeselected(dishId));
    this.dishListChanged.emit({ type: 'deselected', catalogueItemId: dishId, itemType: CatalogueItemType.Meal});
  }

  addDish(_t7: any) {
    throw new Error('Method not implemented.');
  }

  showDishDetails(dish: any) {
    this.matDialog.open(DishDetailsComponent, {
      width: '70vw',
      height: '80vh',
      data: { dishId: dish.guid }
    });
    
  }
}