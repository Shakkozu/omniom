import { Component } from '@angular/core';
import { MealType, NutritionDetailsGroupeByMeal, NutritionDiaryEntry } from '../../model';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngxs/store';
import { NutritionDiaryStore } from '../../store/nutrition-diary.store';

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
export class MealDetailsComponent {
  public dataSource = new MatTableDataSource<MealViewModel>();
  public displayedColumns: string[] = ['mealName', 'totalCalories', 'totalProteins', 'totalCarbohydrates', 'totalFats', 'actions'];
  public detailsRowColumns: string[] = ['productName', 'calories', 'proteins', 'carbohydrates', 'fats', 'actions'];
  public data: MealViewModel[] = [];
  public expandedElements: MealViewModel[] = [];
  
  constructor (private store: Store) {
    this.store.select(NutritionDiaryStore.nutritionDayEntriesGroupedByMeal).subscribe((data) => {
      this.data = this.convertNutritionDetailsToViewModels(data);
      this.dataSource = new MatTableDataSource<MealViewModel>(this.data);
    });
  }

  private convertNutritionDetailsToViewModels(entries: NutritionDetailsGroupeByMeal[]): MealViewModel[] {
    return entries.map(entry => {
      return {
        meal: this.translateMealType(entry.key.toString()),
        entries: entry.entries,
        summary: {
          kcal: entry.entries.reduce((acc, curr) => acc + curr.calories, 0),
          proteins: entry.entries.reduce((acc, curr) => acc + curr.proteins, 0),
          carbohydrates: entry.entries.reduce((acc, curr) => acc + curr.carbohydrates, 0),
          fats: entry.entries.reduce((acc, curr) => acc + curr.fats, 0),
        },
      };
    });
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
  entries: NutritionDiaryEntry[];
  summary: MealSummary;
}

export interface MealSummary {
  kcal: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
}