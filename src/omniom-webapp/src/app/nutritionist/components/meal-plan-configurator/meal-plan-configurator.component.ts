import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewDishDialogComponent, NewDishDialogConfiguration } from '../../../dish-configuration/components/new-dish-dialog/new-dish-dialog.component';
import { Dish } from '../../../dish-configuration/model';
import { MealType } from '../../../nutrition-diary/model';
import { CatalogueItem, CatalogueItemType, MealCatalogueItem } from '../../../products/model';

@Component({
  selector: 'app-meal-plan-configurator',
  templateUrl: './meal-plan-configurator.component.html',
  styleUrl: './meal-plan-configurator.component.scss'
})
export class MealPlanConfiguratorComponent implements OnInit {
  mealPlanForm: FormGroup;
  public mealPlan!: MealPlan;
  days: number[] = [1, 2, 3, 4, 5, 6, 7];
  public meals: any[] = [MealType.Breakfast, MealType.Dinner, MealType.Snack, MealType.Supper]; // todo allow nutritionist to configure daily meals
  public products: any[] = [{ name: 'Jabłko' }, { name: 'Banana' }, { name: 'Kurczak' }, { name: 'Ryż' }];
  selectedProduct: any;
  productQuantity: number = 0;

  constructor (private fb: FormBuilder, public dialog: MatDialog) {
    this.mealPlanForm = this.fb.group({
      mealPlanName: [''],
      dailyCalories: [0]
    });
  }
  ngOnInit(): void {
    this.mealPlan = {
      name: '',
      dailyCalories: 0,
      days: this.initializeDays()
    };
  }

  private initializeDays(): MealPlanDay[] {
    const days: MealPlanDay[] = [];
    this.days.forEach(day => {
      days.push({
        dayNumber: day,
        meals: [
          {
            meal: MealType.Breakfast,
            products: [
              new CatalogueItem('Jabłko', CatalogueItemType.Product, 'guid1', 100, 0.5, 10, 0.5, 50),
              new CatalogueItem('Czekolada', CatalogueItemType.Product, 'guid2', 100, 0.5, 10, 0.5, 50),

            ]
          },
          {
            meal: MealType.SecondBreakfast,
            products: []
          },
          {
            meal: MealType.Dinner,
            products: []
          },
          {
            meal: MealType.Snack,
            products: []
          },
          {
            meal: MealType.Supper,
            products: []
          }
        ]
      });
    });
    return days;

  }

  getProductsForMeal(day: number, meal: any) {
    const mealPlanDay = this.mealPlan.days.find(d => d.dayNumber === day);
    if (!mealPlanDay) {
      return [];
    }

    const mealPlanMeal = mealPlanDay.meals.find(m => m.meal === meal);
    if (!mealPlanMeal) {
      return [];
    }

    return mealPlanMeal.products;
  }

  public getMealTypeTranslation(mealType: MealType): string {
    switch (mealType) {
      case MealType.Breakfast:
        return 'Śniadanie';
      case MealType.SecondBreakfast:
        return 'Drugie Śniadanie';
      case MealType.Dinner:
        return 'Obiad';
      case MealType.Snack:
        return 'Przekąski';
      case MealType.Supper:
        return 'Kolacja';
      default:
        return '';
    }

  }

  openProductDialog(day: number, meal: any) {
    const config: NewDishDialogConfiguration = {
      products: [],
      createNewDishOnSave: false
    };
    const dialogRef = this.dialog.open(NewDishDialogComponent, {
      width: '70vw',
      height: '80vh',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addProduct(day, meal, result);
      }
    });
  }

  addProduct(day: number, meal: MealType, result: Dish) {
    const mealPlanDay = this.mealPlan.days.find(d => d.dayNumber === day);
    if (!mealPlanDay) {
      return;
    }

    const mealPlanMeal = mealPlanDay.meals.find(m => m.meal === meal);
    if (!mealPlanMeal) {
      mealPlanDay.meals.push({
        meal: meal,
        products: [MealCatalogueItem.fromDish(result)]
      });
    } else {
      mealPlanMeal.products.push(MealCatalogueItem.fromDish(result));
    }


  }

  saveMealPlan() {
    // Logic to save the meal plan configuration
  }
}



export interface MealPlan {
  name: string;
  dailyCalories: number;
  days: MealPlanDay[];
}

export interface MealPlanDay {
  dayNumber: number;
  meals: MealPlanMeal[];
}

export interface MealPlanMeal {
  meal: MealType;
  products: CatalogueItem[];
}