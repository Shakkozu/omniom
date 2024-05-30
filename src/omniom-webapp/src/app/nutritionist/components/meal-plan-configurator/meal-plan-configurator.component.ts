import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewDishDialogComponent, NewDishDialogConfiguration } from '../../../dish-configuration/components/new-dish-dialog/new-dish-dialog.component';
import { Dish } from '../../../dish-configuration/model';
import { MealType } from '../../../nutrition-diary/model';
import { MealCatalogueItem, ProductCatalogueItem } from '../../../products/model';
import { v4 as uuidv4 } from 'uuid';
import { ModifyDishDialogComponent, ModifyDishDialogConfiguration } from '../../../dish-configuration/components/modify-dish-dialog/modify-dish-dialog.component';

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

  private AMealCatalogueItem(): MealCatalogueItem {
    const productCatalogueItems = [
      new ProductCatalogueItem('Owsianka', uuidv4(), 120, 100, 0.5, 10, 0.5),
      new ProductCatalogueItem('Mleko', uuidv4(), 120, 100, 0.5, 10, 0.5),
      new ProductCatalogueItem('Kakao', uuidv4(), 120, 100, 0.5, 10, 0.5),
    ];
    return new MealCatalogueItem('Owsianka Oreo', uuidv4(), 100, 100, 100, 0.5, 10, 'opis', 'recipe', 1, productCatalogueItems);
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
              {
                product: this.AMealCatalogueItem(),
                guid: uuidv4()
              },

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
            products: [
              {
                product: this.AMealCatalogueItem(),
                guid: uuidv4()
              }
            ]
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

  public modifyMeal(mealProductGuid: string) {
    const mealDetails = this.mealPlan.days.flatMap(d => d.meals).flatMap(m => m.products).find(p => p.guid === mealProductGuid);
    if (!mealDetails) {
      console.error('[MealPlanConfigurator] Meal not found');
      return;
    }

    const config: ModifyDishDialogConfiguration = {
      dishDetails: mealDetails.product
    };
    const modifyRef = this.dialog.open(ModifyDishDialogComponent, {
      width: '70vw',
      height: '80vh',
      data: config
    })
    modifyRef.afterClosed().subscribe((result: Dish) => {
      if (!result) return;

      const mealPlanDay = this.mealPlan.days.find(d => d.meals.some(m => m.products.some(p => p.guid === mealProductGuid)));
      if (!mealPlanDay) {
        return;
      }
      
      const mealPlanMeal = mealPlanDay.meals.find(m => m.products.some(p => p.guid === mealProductGuid));
      if (!mealPlanMeal) {
        return;
      }
      
      const mealPlanProduct = mealPlanMeal.products.find(p => p.guid === mealProductGuid);
      if (!mealPlanProduct) {
        return;
      }
      
      const meal = MealCatalogueItem.fromDish(result);
      mealPlanProduct.product = meal;
    });

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
    const mealPlanProduct: MealPlanProduct = {
      product: MealCatalogueItem.fromDish(result),
      guid: uuidv4()
    }
    if (!mealPlanMeal) {
      mealPlanDay.meals.push({
        meal: meal,
        products: [mealPlanProduct]
      });
    } else {
      mealPlanMeal.products.push(mealPlanProduct);
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
  products: MealPlanProduct[];
}

export interface MealPlanProduct {
  product: MealCatalogueItem;
  guid: string;
}
