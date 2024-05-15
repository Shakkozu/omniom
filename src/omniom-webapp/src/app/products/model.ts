export interface ProductDetailsDescription {
	guid: string;
	name: string;
	kcalPer100G: number;
	fatPer100G: number;
	carbsPer100G: number;
	proteinsPer100G: number;
	suggestedPortionSizeG: number;
	code?: string;
	quantityG?: number;
	sugarsPer100G?: number;
	fiberPer100G?: number;
	saltPer100G?: number;
	saturatedFatPer100G?: number;
	brands?: string;
	categoriesTags?: string;
}

export class MealEntry {
	constructor (public name: string, public guid: string,
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