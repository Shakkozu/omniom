import { Component, OnDestroy } from '@angular/core';
import { MealType, NutritionDetailsGroupeByMeal, NutritionDiaryEntry } from '../../model';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Actions, Store, ofActionDispatched } from '@ngxs/store';
import { NutritionDiaryStore } from '../../store/nutrition-diary.store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModifyMealNutritionEntriesComponent } from '../modify-meal-nutrition-entries/modify-meal-nutrition-entries.component';
import { ModifyNutritionEntriesSuccess, RemoveNutritionEntry } from '../../store/nutrition-diary.actions';
import { Subject, takeUntil } from 'rxjs';
import { UserProfileStore } from '../../../user-profile/store/user-profile.store';
import { NewDishDialogComponent, NewDishDialogConfiguration } from '../../../dish-configuration/components/new-dish-dialog/new-dish-dialog.component';
import { ProductsCatalogueStore } from '../../../products/store/products-catalogue.store';

@Component({
  selector: 'app-meal-details',
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MealDetailsComponent implements OnDestroy {
  public dataSource = new MatTableDataSource<MealViewModel>();
  public displayedColumns: string[] = ['mealName', 'totalCalories', 'totalProteins', 'totalCarbohydrates', 'totalFats', 'actions'];
  public footerColumns: string[] = ['mealName', 'totalCalories', 'totalProteins', 'totalCarbohydrates', 'totalFats'];
  public detailsRowColumns: string[] = ['productName', 'calories', 'proteins', 'carbohydrates', 'fats', 'actions'];
  public data: MealViewModel[] = [];
  public expandedElements: MealViewModel[] = [];
  private addNutritionDialog: MatDialogRef<ModifyMealNutritionEntriesComponent> | undefined;
  private destroy$ = new Subject<void>();

  constructor (private store: Store, private actions$: Actions, private matDialog: MatDialog) {
    this.store.select(NutritionDiaryStore.nutritionDayEntriesGroupedByMeal).subscribe((data) => {
      this.data = this.convertNutritionDetailsToViewModels(data);
      this.dataSource = new MatTableDataSource<MealViewModel>(this.data);
      this.expandedElements = this.data;
      this.actions$.pipe(
        ofActionDispatched(ModifyNutritionEntriesSuccess),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.addNutritionDialog?.close();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public modifyNutritionEntries(mealType: MealType) {
    const productOfSelectedMeal = this.data.find(meal => meal.mealType === mealType)?.entries ?? [];
    this.addNutritionDialog = this.matDialog.open(ModifyMealNutritionEntriesComponent, {
      width: '70vw',
      height: '80vh',
      data: { mealType: mealType, initialSelection: productOfSelectedMeal }
    });
  }

  public removeProductFromMeal(element: NutritionDiaryEntry) {
    this.store.dispatch(new RemoveNutritionEntry(element.guid, element.meal));
  }

  private convertNutritionDetailsToViewModels(entries: NutritionDetailsGroupeByMeal[]): MealViewModel[] {
    const enabledMeals = this.store.selectSnapshot(UserProfileStore.mealsConfiguration)
      .filter(m => m.enabled === true)
      .map(m => MealType[m.key]);
    const result: MealViewModel[] = Object.keys(MealType)
      .filter(key => isNaN(Number(key)))
      .filter(key => enabledMeals.includes(key))
      .map(key => ({
        meal: this.translateMealType(key),
        mealType: key as unknown as MealType,
        entries: [],
        summary: {
          kcal: 0,
          proteins: 0,
          carbohydrates: 0,
          fats: 0,
        },
      }));

    const groupedEntries = entries.map(entry => ({
      meal: this.translateMealType(entry.key.toString()),
      mealType: entry.key,
      entries: entry.entries,
      summary: {
        kcal: entry.entries.reduce((acc, curr) => acc + curr.calories, 0),
        proteins: entry.entries.reduce((acc, curr) => acc + curr.proteins, 0),
        carbohydrates: entry.entries.reduce((acc, curr) => acc + curr.carbohydrates, 0),
        fats: entry.entries.reduce((acc, curr) => acc + curr.fats, 0),
      },
    }));

    result.forEach(r => {
      const entries = groupedEntries.find(e => e.meal === r.meal);
      if (entries) {
        r.entries = entries.entries;
        r.summary = entries.summary;
      }
    });

    return result;
  }

  private translateMealType(mealType: string): string {
    switch (mealType) {
      case 'Breakfast':
        return 'Śniadanie';
      case 'SecondBreakfast':
        return 'Drugie Śniadanie';
      case 'Dinner':
        return 'Obiad';
      case 'Snack':
        return 'Przekąska';
      case 'Supper':
        return 'Kolacja';
      default:
        return 'Unknown';
    }
  }


  public onElementClicked(element: MealViewModel): void {
    if (this.isElementExpanded(element)) {
      this.expandedElements = this.expandedElements.filter(el => el !== element);
      return;
    }

    this.expandedElements.push(element);
  }

  public isElementExpanded(element: MealViewModel): boolean {
    return this.expandedElements.includes(element);
  }

  public toDataSource(vm: MealViewModel): MatTableDataSource<NutritionDiaryEntry> {
    return new MatTableDataSource<NutritionDiaryEntry>(vm.entries);
  }

  public getTotals(): MealSummary {
    return this.data.reduce((acc, curr) => {
      acc.kcal += curr.summary.kcal;
      acc.proteins += curr.summary.proteins;
      acc.carbohydrates += curr.summary.carbohydrates;
      acc.fats += curr.summary.fats;
      return acc;
    }, { kcal: 0, proteins: 0, carbohydrates: 0, fats: 0 });
  }

  public createNewDish(mealEntries: NutritionDiaryEntry[]) {
    const productsIds = mealEntries.filter(entry => entry.productId !== null && entry.productId !== undefined)
      .map(p => p.productId);
    const products = this.store.selectSnapshot(ProductsCatalogueStore.products).filter(p => productsIds.includes(p.guid));
    const config: NewDishDialogConfiguration = {
      products: products,
      createNewDishOnSave: true
    };
    this.matDialog.open(NewDishDialogComponent, {
      width: '70vw',
      height: '80vh',
      data: config
    });
  };
}


export interface MealViewModel {
  meal: string;
  mealType: MealType;
  entries: NutritionDiaryEntry[];
  summary: MealSummary;
}

export interface MealSummary {
  kcal: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}