import { CatalogueItemDto, ProductCatalogueItem } from "../products/model";

export interface Dish {
	name: string;
	guid: string;
	description: string;
	recipe: string;
	portions: number;
	ingredients: ProductCatalogueItem[];
}

export interface DishViewModel extends Dish {
	kcalPerPortion: number;
	fatsGramsPerPortion: number;
	carbsGramsPerPortion: number;
	proteinsGramsPerPortion: number;
}

export interface MealCatalogueItemDto extends CatalogueItemDto {
	description: string;
	recipe: string;
	portions: number;
	ingredients: CatalogueItemDto[];
}