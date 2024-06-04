import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewDishDialogComponent, NewDishDialogConfiguration } from '../../../dish-configuration/components/new-dish-dialog/new-dish-dialog.component';
import { Dish } from '../../../dish-configuration/model';
import { MealCatalogueItem } from '../../../products/model';
import { v4 as uuidv4 } from 'uuid';
import { ModifyDishDialogComponent, ModifyDishDialogConfiguration } from '../../../dish-configuration/components/modify-dish-dialog/modify-dish-dialog.component';
import { FormErrorHandler } from '../../../shared/form-error-handler';
import { DaySummary, MealPlan, MealPlanDay, MealPlanProduct, MealPlanStatus } from '../../model';
import { MealType } from '../../../nutrition-diary/model';
import { Store } from '@ngxs/store';
import { PublishMealPlan, SaveMealPlanAsDraft } from '../../store/meal-plan-configuration.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { MealPlanConfigurationRestService } from '../../meal-plan-configuration-rest-service';
import { SelectDishDialogComponent } from '../select-dish-dialog/select-dish-dialog.component';

@Component({
  selector: 'app-meal-plan-configurator',
  templateUrl: './meal-plan-configurator.component.html',
  styleUrl: './meal-plan-configurator.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MealPlanConfiguratorComponent implements OnInit {

  mealPlanForm: FormGroup;
  public mealPlan!: MealPlan;
  public productsListModified: boolean = false;
  days: number[] = [1, 2, 3, 4, 5, 6, 7];
  public meals: any[] = [MealType.Breakfast, MealType.Dinner, MealType.Snack, MealType.Supper]; // todo allow nutritionist to configure daily meals

  public get isReadonly(): boolean {
    return this.mealPlan.status === MealPlanStatus.Active;
  }

  constructor (private fb: FormBuilder,
    private store: Store,
    private formErrorHandler: FormErrorHandler,
    private route: ActivatedRoute,
    private router: Router,
    private mealPlanService: MealPlanConfigurationRestService,
    public dialog: MatDialog) {
    this.mealPlanForm = this.fb.group({
      mealPlanName: ['', [Validators.required, Validators.minLength(3)]],
      dailyCalories: [1500, [Validators.required, Validators.min(1500), Validators.max(3500)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const mealPlanGuid = params.get('id');

      if (mealPlanGuid) {
        this.mealPlanService.getMealPlanDetails(mealPlanGuid).subscribe(mealPlan => {
          this.mealPlan = mealPlan;
          this.mealPlanForm.patchValue({
            mealPlanName: mealPlan.name,
            dailyCalories: mealPlan.dailyCalories
          });
          if (this.isReadonly)
            this.mealPlanForm.disable();
        });
        return;
      }


    });
    this.mealPlan = {
      name: '',
      status: MealPlanStatus.Draft,
      dailyCalories: 0,
      days: this.initializeDays(),
      guid: uuidv4()
    };
  }

  public hasNotSavedChanges(): boolean {
    return this.mealPlanForm.dirty;
  }

  public navigateBack() {
    this.router.navigate(['/nutritionist'], { relativeTo: this.route });
  }


  private initializeDays(): MealPlanDay[] {
    const days: MealPlanDay[] = [];
    this.days.forEach(day => {
      days.push({
        dayNumber: day,
        meals: [
          {
            mealType: MealType.Breakfast,
            products: [
            ]
          },
          {
            mealType: MealType.Dinner,
            products: []
          },
          {
            mealType: MealType.Snack,
            products: [
            ]
          },
          {
            mealType: MealType.Supper,
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

    const mealPlanMeal = mealPlanDay.meals.find(m => m.mealType === meal);
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
      this.productsListModified = true;
    });

  }

  public addProductToMeal(day: number, meal: any) {
    const config: NewDishDialogConfiguration = {
      products: [],
      createNewDishOnSave: true,
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

  addExistingDishToMeal(dayNumber: number, mealType: any) {
    const dialogRef = this.dialog.open(SelectDishDialogComponent, {
      width: '40vw',
      height: '60vh',
    });
    
    dialogRef.afterClosed().subscribe(mealDetails => {
      if (mealDetails) {
        const mealDetailsWithSinglePortion = mealDetails.toMealCatalogueItemWithSinglePortion();
        const config: NewDishDialogConfiguration = {
          createNewDishOnSave: false,
          singlePortion: true,
          sourceMeal: mealDetailsWithSinglePortion
        };
        const addMealRef = this.dialog.open(NewDishDialogComponent, {
          width: '70vw',
          height: '80vh',
          data: config
        });
        addMealRef.afterClosed().subscribe(result => {
          if (result) {
            this.addProduct(dayNumber, mealType, result);
          }
        }
        )
      }
    });
  }

  private addProduct(day: number, meal: MealType, result: Dish) {
    this.productsListModified = true;
    const mealPlanDay = this.mealPlan.days.find(d => d.dayNumber === day);
    if (!mealPlanDay) {
      return;
    }

    const mealPlanMeal = mealPlanDay.meals.find(m => m.mealType === meal);
    const mealPlanProduct: MealPlanProduct = {
      product: MealCatalogueItem.fromDish(result),
      guid: uuidv4()
    }
    if (!mealPlanMeal) {
      mealPlanDay.meals.push({
        mealType: meal,
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
    this.productsListModified = true;
  }

  saveMealPlanAsDraft() {
    const mealPlan = {
      ...this.mealPlan,
      name: this.mealPlanForm.value.mealPlanName,
      dailyCalories: this.mealPlanForm.value.dailyCalories
    };
    this.store.dispatch(new SaveMealPlanAsDraft(mealPlan)).subscribe(
      () => {
        this.productsListModified = false;
      }
    );
  }

  public publishMealPlan() {
    this.store.dispatch(new PublishMealPlan(this.mealPlan));

    
  }

  public validateMealPlan(): boolean {
    return this.mealPlan.days.every(d => d.meals.every(m => m.products.length > 0));
  }

  public IsDayValid(day: MealPlanDay): boolean {
    return day.meals.every(m => m.products.length > 0);
  }
}



