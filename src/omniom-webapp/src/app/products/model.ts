export interface ProductDetailsDescription {
	guid: string;
	code: string;
	name: string;
	kcalPer100G: number;
	fatPer100G: number;
	carbsPer100G: number;
	proteinsPer100G: number;
	suggestedPortionSizeG: number;
	quantityG?: number;
	sugarsPer100G?: number;
	fiberPer100G?: number;
	saltPer100G?: number;
	saturatedFatPer100G?: number;
	brands?: string;
	categoriesTags?: string;
}
