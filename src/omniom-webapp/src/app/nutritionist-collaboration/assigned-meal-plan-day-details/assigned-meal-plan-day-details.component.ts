import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MealPlanMeal, MealPlanProduct } from '../../nutritionist/model';
import { MealType } from '../../nutrition-diary/model';
import { CatalogueItem, CatalogueItemDto, CatalogueItemType, MealCatalogueItem, ProductCatalogueItem } from '../../products/model';
import { MealCatalogueItemDto } from '../../dish-configuration/model';

@Component({
  selector: 'app-assigned-meal-plan-day-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './assigned-meal-plan-day-details.component.html',
  styleUrl: './assigned-meal-plan-day-details.component.scss'
})
export class AssignedMealPlanDayDetailsComponent implements OnInit {
  meal!: MealCatalogueItem[];
  mapped!: MealCatalogueItem[];
  public meals: AssignedMeal[] = [];
  public mealPlans: MealPlanMeal[] = [];
  ngOnInit(): void {
    this.mapped = this.getMealDto().map(ing => MealCatalogueItem.fromMealDto(ing));
    this.mealPlans = [{
      mealType: MealType.Breakfast,
      products: [ { product: this.mapped[0], guid: '123' } ]
    }, {
      mealType: MealType.SecondBreakfast,
      products: [ { product: this.mapped[0], guid: '123' } ]
    }, {
      mealType: MealType.Dinner,
      products: [ { product: this.mapped[0], guid: '123' } ]
    }, {
      mealType: MealType.Supper,
      products: [ { product: this.mapped[0], guid: '123' } ]
    
    }];
    this.meals = [
      {
        nutritionistGuid: '123', userGuid: '123', mealPlanGuid: '123', mealPlanDayGuid: '123',
        meals: [ { mealType: MealType.Breakfast, products: [ { product: this.mapped[0], guid: '123' } ] } ]
      },      {
        nutritionistGuid: '123', userGuid: '123', mealPlanGuid: '123', mealPlanDayGuid: '234',
        meals: [ { mealType: MealType.SecondBreakfast, products: [ { product: this.mapped[0], guid: '123' } ] } ]
      },      {
        nutritionistGuid: '123', userGuid: '123', mealPlanGuid: '123', mealPlanDayGuid: '345',
        meals: [ { mealType: MealType.Dinner, products: [ { product: this.mapped[0], guid: '123' } ] } ]
      },      {
        nutritionistGuid: '123', userGuid: '123', mealPlanGuid: '123', mealPlanDayGuid: '456',
        meals: [ { mealType: MealType.Supper, products: [ { product: this.mapped[0], guid: '123' } ] } ]
      },
    ]

    
  }
  private getMealDto(): MealCatalogueItemDto[] {
    return [
      {
        portions: 1,
        description: "789",
        recipe: "456",
        type: CatalogueItemType.Meal,
        ingredients: [
          {
            name: "8 Tortilli [Carrefour]",
            guid: "54853807-64e2-431f-9674-4e4e6f1fe38d",
            portionInGrams: 80,
            kcalPer100G: 326,
            proteinsPer100G: 9.4,
            carbohydratesPer100G: 55,
            fatsPer100G: 7.3,
            kcalPerPortion: 260.8,
            proteinsPerPortion: 7.52,
            carbohydratesPerPortion: 44,
            fatsPerPortion: 5.84,
            type: CatalogueItemType.Product
          },
          {
            type: CatalogueItemType.Product,
            name: "Ciecierzyca Gotowana [Freshona,Lidl,Cistér]",
            guid: "b4c2381d-1152-4b4d-8a81-efe27cde70cf",
            portionInGrams: 100,
            kcalPer100G: 112,
            proteinsPer100G: 6.7,
            carbohydratesPer100G: 12,
            fatsPer100G: 2.4,
            kcalPerPortion: 112,
            proteinsPerPortion: 6.7,
            carbohydratesPerPortion: 12,
            fatsPerPortion: 2.4
          },
          {
            type: CatalogueItemType.Product,
            name: "Czekolada do picia / Hot chocolate []",
            guid: "99e3639c-fd9d-46df-9c01-d26c216eb885",
            portionInGrams: 100,
            kcalPer100G: 360,
            proteinsPer100G: 11,
            carbohydratesPer100G: 62,
            fatsPer100G: 4.4,
            kcalPerPortion: 360,
            proteinsPerPortion: 11,
            carbohydratesPerPortion: 62,
            fatsPerPortion: 4.4
          }
        ],
        guid: "230bcbb7-fdeb-47fa-a0d9-5293bac3d03f",
        name: "123",
        portionInGrams: 280,
        kcalPer100G: 261.7,
        proteinsPer100G: 9,
        fatsPer100G: 4.5,
        carbohydratesPer100G: 42.1,
        kcalPerPortion: 732.8,
        proteinsPerPortion: 25.2,
        fatsPerPortion: 12.6,
        carbohydratesPerPortion: 118
      }
    ]
  }



  
}


export interface AssignedMeal {
  nutritionistGuid: string;
  userGuid: string;
  mealPlanGuid: string;
  mealPlanDayGuid: string;
  meals: MealPlanMeal[]
}

