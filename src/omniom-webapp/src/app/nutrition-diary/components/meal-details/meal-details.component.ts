import { Component, OnDestroy } from '@angular/core';
import { MealType, NutritionDetailsGroupeByMeal, NutritionDiaryEntry } from '../../model';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Actions, Store, ofActionDispatched } from '@ngxs/store';
import { NutritionDiaryStore } from '../../store/nutrition-diary.store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddNutritionEntryComponent } from '../add-nutrition-entry/add-nutrition-entry.component';
import { AddNutritionEntriesSuccess } from '../../store/nutrition-diary.actions';
import { Subject, takeUntil } from 'rxjs';

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
  public detailsRowColumns: string[] = ['productName', 'calories', 'proteins', 'carbohydrates', 'fats', 'actions'];
  public data: MealViewModel[] = [];
  public expandedElements: MealViewModel[] = [];
  private addNutritionDialog: MatDialogRef<AddNutritionEntryComponent> | undefined;
  private destroy$ = new Subject<void>();
  
  constructor(private store: Store, private actions$: Actions, private matDialog: MatDialog) {
    this.store.select(NutritionDiaryStore.nutritionDayEntriesGroupedByMeal).subscribe((data) => {
      this.data = this.convertNutritionDetailsToViewModels(data);
      this.dataSource = new MatTableDataSource<MealViewModel>(this.data);
      this.expandedElements = this.data;

      this.actions$.pipe(
        ofActionDispatched(AddNutritionEntriesSuccess),
        takeUntil(this.destroy$)
      ).subscribe(() => this.addNutritionDialog?.close());
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addNutritionEntryButtonClicked(mealType: MealType): void {
    this.addNutritionDialog = this.matDialog.open(AddNutritionEntryComponent, {
      width: '70vw',
      height: '80vh',
      data: { mealType: mealType }
    });
  }

  private convertNutritionDetailsToViewModels(entries: NutritionDetailsGroupeByMeal[]): MealViewModel[] {
    const result: MealViewModel[] = Object.keys(MealType)
      .filter(key => isNaN(Number(key)))
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