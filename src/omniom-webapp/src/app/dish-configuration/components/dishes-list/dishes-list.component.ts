import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../material.module';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { FetchDishes, DishSelected as DishSelected, DishDeselected } from '../../store/dish-configuration.actions';
import { DishConfigurationStore } from '../../store/dish-configuration.state';
import { ProductListChangedEvent as CatalogueItemListChangedEvent } from '../../../products/components/products-list/products-list.component';
import { CatalogueItem, CatalogueItemType, MealCatalogueItem } from '../../../products/model';
import { MatDialog } from '@angular/material/dialog';
import { DishDetailsComponent } from '../dish-details/dish-details.component';
import { NewDishDialogComponent, NewDishDialogConfiguration } from '../new-dish-dialog/new-dish-dialog.component';

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
  @Input() singleSelectButtonEnabled: boolean = false;
  @Input() addNewDishButtonEnabled: boolean = false;
  @Output() singleMealCatalogueItemSelected: EventEmitter<MealCatalogueItem> = new EventEmitter<MealCatalogueItem>();
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
    this.dishListChanged.emit({ type: 'selected', catalogueItemId: dishId, itemType: CatalogueItemType.Meal });
  }

  public onDishSelectedButtonClicked(selectedDish: CatalogueItem) {
    this.store.select(DishConfigurationStore.dishDetailsById(selectedDish.guid))
      .subscribe((dish) => {
        if (dish) {
          this.singleMealCatalogueItemSelected.emit(dish);
        };
      })

  }

  onAddNewDishButtonClicked() {
    const config: NewDishDialogConfiguration = {
      products: [],
      createNewDishOnSave: true
    };
    this.matDialog.open(NewDishDialogComponent, {
      width: '70vw',
      height: '80vh',
      data: config
    });
  }

  dishDeselected($event: MatSelectionListChange) {
    const dishId = $event.options[0].value;
    const selected = $event.options[0].selected;
    if (selected)
      return;

    this.store.dispatch(new DishDeselected(dishId));
    this.dishListChanged.emit({ type: 'deselected', catalogueItemId: dishId, itemType: CatalogueItemType.Meal });
  }

  showDishDetails(dish: any) {
    this.matDialog.open(DishDetailsComponent, {
      width: '70vw',
      height: '80vh',
      data: { dishId: dish.guid }
    });
  }
}