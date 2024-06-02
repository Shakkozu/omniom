import { Injectable } from "@angular/core";
import { CatalogueItem, MealCatalogueItem } from "../products/model";
import { MealPlanDto, MealPlan, MealPlanProductDto, MealPlanProduct } from "./model";


@Injectable({
	providedIn: 'root',
})
export class MealPlanMapper {
	// mappign MealPlanDto to MealPlan is required, because MealPlan is an object for which getters are defined, and does not work correctly when not initialized by constructor
	public mapMealPlanDtoToMealPlan(mealPlanDto: MealPlanDto): MealPlan {
		console.log(mealPlanDto);
		return {
			name: mealPlanDto.name,
			status: mealPlanDto.status,
			dailyCalories: mealPlanDto.dailyCalories,
			days: mealPlanDto.days.map(day => {
				return {
					dayNumber: day.dayNumber,
					meals: day.meals.map(meal => {
						return {
							mealType: meal.mealType,
							products: meal.products.map(product => this.mapProductDtoToProduct(product))
						};
					})
				};
			}),
			guid: mealPlanDto.guid
		};
	}

	private mapProductDtoToProduct(productDto: MealPlanProductDto): MealPlanProduct {
		const product = productDto.product;
		const ingredients = product.ingredients.map(ingredient => CatalogueItem.fromDto(ingredient));
		return {
			product: new MealCatalogueItem(product.name,
				product.guid,
				product.portionInGrams,
				product.kcalPer100G,
				product.proteinsPer100G,
				product.fatsPer100G,
				product.carbohydratesPer100G,
				product.description,
				product.recipe,
				product.portions,
				ingredients
			),
			guid: productDto.guid
		};
	}

}
