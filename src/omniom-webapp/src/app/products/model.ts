import { Dish, DishViewModel, MealCatalogueItemDto } from "../dish-configuration/model";
import { NutritionDiaryEntry } from "../nutrition-diary/model";


export class MealEntry {
	constructor (public name: string,
		public type: CatalogueItemType,
		public guid: string,
		public portionInGrams: number,
		private kcalPer100g: number,
		private proteinsPer100g: number,
		private fatsPer100g: number,
		private carbohydratesPer100g: number) {
		this.name = name;
		this.portionInGrams = portionInGrams;
		this.guid = guid;
		this.kcalPer100g = kcalPer100g;
		this.proteinsPer100g = proteinsPer100g;
		this.fatsPer100g = fatsPer100g;
		this.carbohydratesPer100g = carbohydratesPer100g;
	}

	get kcal(): number {
		return +(this.kcalPer100g * this.portionInGrams / 100).toFixed(2);
	}

	get proteins(): number {
		return +(this.proteinsPer100g * this.portionInGrams / 100).toFixed(2);
	}

	get fats(): number {
		return +(this.fatsPer100g * this.portionInGrams / 100).toFixed(2);
	}

	get carbohydrates(): number {
		return +(this.carbohydratesPer100g * this.portionInGrams / 100).toFixed(2);
	}
}

export class CatalogueItem {
	constructor (public name: string,
		public type: CatalogueItemType,
		public guid: string,
		public portionInGrams: number,
		public kcalPer100g: number,
		public proteinsPer100g: number,
		public fatsPer100g: number,
		public carbohydratesPer100g: number) {
		this.name = name;
		this.portionInGrams = portionInGrams;
		this.guid = guid;
		this.kcalPer100g = kcalPer100g;
		this.proteinsPer100g = proteinsPer100g;
		this.fatsPer100g = fatsPer100g;
		this.carbohydratesPer100g = carbohydratesPer100g;
	}

	static fromDto(dto: CatalogueItemDto): CatalogueItem {
		return new CatalogueItem(dto.name, dto.type, dto.guid, dto.portionInGrams, dto.kcalPer100G, dto.proteinsPer100G, dto.fatsPer100G, dto.carbohydratesPer100G);
	}

	static fromNutritionDiaryEntry(product: NutritionDiaryEntry): CatalogueItem {
		return new CatalogueItem(product.productName, CatalogueItemType.Product, product.productId, product.portionInGrams, product.calories, product.proteins, product.fats, product.carbohydrates);
	}

	toProductCatalogueItem(): ProductCatalogueItem {
		return new ProductCatalogueItem(this.name, this.guid, this.portionInGrams, this.kcalPer100g, this.proteinsPer100g, this.fatsPer100g, this.carbohydratesPer100g);
	}

	toMealEntry(): MealEntry {
		return new MealEntry(this.name, this.type, this.guid, this.portionInGrams, this.kcalPer100g, this.proteinsPer100g, this.fatsPer100g, this.carbohydratesPer100g);
	}

	static fromDish(dish: DishViewModel): CatalogueItem {
		return new CatalogueItem(dish.name,
			CatalogueItemType.Meal,
			dish.guid,
			dish.portions,
			dish.kcalPerPortion,
			dish.proteinsGramsPerPortion,
			dish.fatsGramsPerPortion,
			dish.carbsGramsPerPortion);
	}

	get kcal(): number {
		return +(this.kcalPer100g * this.portionInGrams / 100).toFixed(2);
	}

	get proteins(): number {
		return +(this.proteinsPer100g * this.portionInGrams / 100).toFixed(2);
	}

	get fats(): number {
		return +(this.fatsPer100g * this.portionInGrams / 100).toFixed(2);
	}

	get carbohydrates(): number {
		return +(this.carbohydratesPer100g * this.portionInGrams / 100).toFixed(2);
	}
}

export class ProductCatalogueItem extends CatalogueItem {
	constructor (name: string, guid: string, portionInGrams: number, kcalPer100g: number, proteinsPer100g: number, fatsPer100g: number, carbohydratesPer100g: number) {
		super(name, CatalogueItemType.Product, guid, portionInGrams, kcalPer100g, proteinsPer100g, fatsPer100g, carbohydratesPer100g);
	}

	static override fromDto(dto: CatalogueItemDto): ProductCatalogueItem {
		return new ProductCatalogueItem(dto.name, dto.guid, dto.portionInGrams, dto.kcalPer100G, dto.proteinsPer100G, dto.fatsPer100G, dto.carbohydratesPer100G);
	}
}

export class MealCatalogueItem extends CatalogueItem {
	
	constructor (name: string,
		guid: string,
		portionInGrams: number,
		kcalPer100g: number,
		proteinsPer100g: number,
		fatsPer100g: number,
		carbohydratesPer100g: number,
		public description: string,
		public recipe: string,
		public portions: number,
		public ingredients: ProductCatalogueItem[],
	) {
		super(name, CatalogueItemType.Meal, guid, portionInGrams, kcalPer100g, proteinsPer100g, fatsPer100g, carbohydratesPer100g);
	}

	static override fromDish(dish: Dish): MealCatalogueItem {
		const allIngredientsProteinsPer100g = dish.ingredients.reduce((acc, curr) => acc + curr.proteinsPer100g, 0);
		const allIngredientsFatsPer100g = dish.ingredients.reduce((acc, curr) => acc + curr.fatsPer100g, 0);
		const allIngredientsCarbsPer100g = dish.ingredients.reduce((acc, curr) => acc + curr.carbohydratesPer100g, 0);
		const allIngredientsKcalPer100g = dish.ingredients.reduce((acc, curr) => acc + curr.kcalPer100g, 0);
		const allIngredientsTotalWeight = dish.ingredients.reduce((acc, curr) => acc + curr.portionInGrams, 0);
		const portionInGrams = allIngredientsTotalWeight / dish.portions;
		
		return new MealCatalogueItem(dish.name, dish.guid, portionInGrams, allIngredientsKcalPer100g, allIngredientsProteinsPer100g,
			allIngredientsFatsPer100g, allIngredientsCarbsPer100g,
			dish.description, dish.recipe, dish.portions, dish.ingredients);
	}

	static fromMealDto(dish: MealCatalogueItemDto): MealCatalogueItem {
		const ingredients = dish.ingredients.map(p => ProductCatalogueItem.fromDto(p));
		// const ingredients = dish.ingredients.map(i => new ProductCatalogueItem(i.name, i.guid, i.portionInGrams, i.kcalPer100G, i.proteinsPer100G, i.fatsPer100G, i.carbohydratesPer100G));
		return new MealCatalogueItem(dish.name, dish.guid, dish.portionInGrams, dish.kcalPer100G, dish.proteinsPer100G, dish.fatsPer100G, dish.carbohydratesPer100G, dish.description, dish.recipe, dish.portions, ingredients);

		
	}
}

export enum CatalogueItemType {
	Product = 'Product',
	Meal = 'Meal'
}

export interface CatalogueItemDto {
	guid: string;
	name: string;
	type: CatalogueItemType;
	portionInGrams: number;
	kcalPer100G: number;
	proteinsPer100G: number;
	fatsPer100G: number;
	carbohydratesPer100G: number;
	kcalPerPortion: number;
	proteinsPerPortion: number;
	fatsPerPortion: number;
	carbohydratesPerPortion: number;
}