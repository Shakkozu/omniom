import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewDishDialogComponent, NewDishDialogConfiguration } from '../../../dish-configuration/components/new-dish-dialog/new-dish-dialog.component';
import { Dish } from '../../../dish-configuration/model';
import { MealCatalogueItem, ProductCatalogueItem } from '../../../products/model';
import { v4 as uuidv4 } from 'uuid';
import { ModifyDishDialogComponent, ModifyDishDialogConfiguration } from '../../../dish-configuration/components/modify-dish-dialog/modify-dish-dialog.component';
import { FormErrorHandler } from '../../../shared/form-error-handler';
import { DaySummary, MealPlan, MealPlanDay, MealPlanProduct, MealPlanStatus } from '../../model';
import { MealType } from '../../../nutrition-diary/model';
import { Store } from '@ngxs/store';
import { SaveMealPlanAsDraft } from '../../store/meal-plan-configuration.actions';

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

  constructor (private fb: FormBuilder,
    private store: Store,
    private formErrorHandler: FormErrorHandler,
    public dialog: MatDialog) {
    this.mealPlanForm = this.fb.group({
      mealPlanName: ['', [Validators.required, Validators.minLength(3)]],
      dailyCalories: [1500, [Validators.required, Validators.min(1500), Validators.max(3500)]]
    });
  }
  ngOnInit(): void {
    this.mealPlan = {
      name: '',
      status: MealPlanStatus.Draft,
      dailyCalories: 0,
      days: this.initializeDays(),
      guid: uuidv4()
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

  getDaySummary(day: MealPlanDay): DaySummary {
    const mealPlanDay = this.mealPlan.days.find(d => d.dayNumber === day.dayNumber);
    if (!mealPlanDay) {
      return {
        dayNumber: day.dayNumber,
        totalCalories: '0',
        totalProteins: '0',
        totalFats: '0',
        totalCarbs: '0'
      };
    }

    const totalCalories = mealPlanDay.meals.flatMap(m => m.products).reduce((acc, p) => acc + p.product.kcal, 0);
    const totalProteins = mealPlanDay.meals.flatMap(m => m.products).reduce((acc, p) => acc + p.product.proteins, 0);
    const totalFats = mealPlanDay.meals.flatMap(m => m.products).reduce((acc, p) => acc + p.product.fats, 0);
    const totalCarbs = mealPlanDay.meals.flatMap(m => m.products).reduce((acc, p) => acc + p.product.carbohydrates, 0);

    return {
      dayNumber: day.dayNumber,
      totalCalories: totalCalories.toFixed(0),
      totalProteins: totalProteins.toFixed(1),
      totalFats: totalFats.toFixed(1),
      totalCarbs: totalCarbs.toFixed(1)
    };


  }

  public getErrorMessage(formControlName: string): string {
    return this.formErrorHandler.handleError(this.mealPlanForm, formControlName);
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
      dishDetails: mealDetails.product,
      singlePortion: true
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

  public addProductToMeal(day: number, meal: any) {
    const config: NewDishDialogConfiguration = {
      products: [],
      createNewDishOnSave: false,
      singlePortion: true
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

  private addProduct(day: number, meal: MealType, result: Dish) {
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

  public removeMeal(mealGuid: string) {
    const mealDetails = this.mealPlan.days.flatMap(d => d.meals).flatMap(m => m.products).find(p => p.guid === mealGuid);
    if (!mealDetails) {
      console.error('[MealPlanConfigurator] Meal not found');
      return;
    }

    const mealPlanDay = this.mealPlan.days.find(d => d.meals.some(m => m.products.some(p => p.guid === mealGuid)));
    if (!mealPlanDay) {
      return;
    }

    const mealPlanMeal = mealPlanDay.meals.find(m => m.products.some(p => p.guid === mealGuid));
    if (!mealPlanMeal) {
      return;
    }

    const mealPlanProductIndex = mealPlanMeal.products.findIndex(p => p.guid === mealGuid);
    mealPlanMeal.products.splice(mealPlanProductIndex, 1);    
  }

  saveMealPlanAsDraft() {
    const isValid = this.validateMealPlan();
    if (!isValid) {
      console.error('[MealPlanConfigurator] Meal plan is invalid');
      return;
    }

    this.store.dispatch(new SaveMealPlanAsDraft(this.mealPlan));
  }
  
  public validateMealPlan(): boolean {
    return this.mealPlan.days.every(d => d.meals.every(m => m.products.length > 0));
  }

  public IsDayValid(day: MealPlanDay): boolean {
    return day.meals.every(m => m.products.length > 0);
  }
}



