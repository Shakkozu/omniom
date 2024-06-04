import { MealPlan } from "../model";

export class SaveMealPlanAsDraft {
	static readonly type = '[Nutritionist Meal Configuration] Save meal plan as draft'
	constructor (public mealPlan: MealPlan) { 

	}
}
export class PublishMealPlan {
	static readonly type = '[Nutritionist Meal Configuration] Publish meal plan'
	constructor (public mealPlan: MealPlan) { 

	}
}

export class SaveMealPlanAsDraftSuccess {
	static readonly type = '[Nutritionist Meal Configuration] Save meal plan as draft success'
	constructor (public mealPlan: MealPlan) { 

	}
}
