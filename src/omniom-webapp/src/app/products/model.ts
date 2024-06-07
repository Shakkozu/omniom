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
		const isProduct = product.productId !== null && product.productId !== undefined;
		const type = isProduct ? CatalogueItemType.Product : CatalogueItemType.Meal;
		const guid = isProduct ? product.productId : product.userMealId;
		const name = isProduct ? product.productName : product.userMealName;
		return new CatalogueItem(name, type, guid, product.portionInGrams, product.calories, product.proteins, product.fats, product.carbohydrates);
	}

	toProductCatalogueItem(): ProductCatalogueItem {
		return new ProductCatalogueItem(this.name, this.guid, this.portionInGrams, this.kcalPer100g, this.proteinsPer100g, this.fatsPer100g, this.carbohydratesPer100g);
	}

	toMealEntry(): MealEntry {
		return new MealEntry(this.name, this.type, this.guid, this.portionInGrams, this.kcalPer100g, this.proteinsPer100g, this.fatsPer100g, this.carbohydratesPer100g);
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

	static fromDish(dish: Dish): MealCatalogueItem {
		let totalKcal = 0;
		let totalProteins = 0;
		let totalFats = 0;
		let totalCarbs = 0;
		let totalPortionInGrams = 0;
		dish.ingredients.forEach(p => {
			totalKcal += p.kcal;
			totalProteins += p.proteins;
			totalFats += p.fats;
			totalCarbs += p.carbohydrates;
			totalPortionInGrams += p.portionInGrams;
		});

		const kcalPer100G = (totalKcal / totalPortionInGrams) * 100;
		const proteinsPer100G = (totalProteins / totalPortionInGrams) * 100;
		const fatsPer100G = (totalFats / totalPortionInGrams) * 100;
		const carbohydratesPer100G = (totalCarbs / totalPortionInGrams) * 100;
		const portionInGrams = totalPortionInGrams / dish.portions;
		
		return new MealCatalogueItem(dish.name, dish.guid, portionInGrams, kcalPer100G, proteinsPer100G, fatsPer100G, carbohydratesPer100G, dish.description, dish.recipe, dish.portions, dish.ingredients);
	}

	static fromMealDto(dish: MealCatalogueItemDto): MealCatalogueItem {
		const ingredients = dish.ingredients.map(p => ProductCatalogueItem.fromDto(p));
		return new MealCatalogueItem(dish.name, dish.guid, dish.portionInGrams, dish.kcalPer100G, dish.proteinsPer100G, dish.fatsPer100G, dish.carbohydratesPer100G, dish.description, dish.recipe, dish.portions, ingredients);
	}

	toMealCatalogueItemWithSinglePortion(): MealCatalogueItem {
		const ingredients = this.ingredients.map(p => {
			const portionInGrams = Math.round(p.portionInGrams / this.portions);
			return new ProductCatalogueItem(p.name, p.guid, portionInGrams, p.kcalPer100g, p.proteinsPer100g, p.fatsPer100g, p.carbohydratesPer100g);
		});
		const totalPortionInGrams = ingredients.reduce((acc, p) => acc + p.portionInGrams, 0);
		return new MealCatalogueItem(this.name, this.guid, totalPortionInGrams, this.kcalPer100g, this.proteinsPer100g, this.fatsPer100g, this.carbohydratesPer100g, this.description, this.recipe, 1, ingredients);
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