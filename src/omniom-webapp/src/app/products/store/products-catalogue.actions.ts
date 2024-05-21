import { CatalogueItemDto } from "../model";

export enum ProductsCatalogueActionTypes {
	FetchProducts = '[Products Catalogue] Fetch products',
	FetchProductsSuccess = '[Products Catalogue] Fetch products success',
	FetchProductsFailure = '[Products Catalogue] Fetch products failure',
	ProductSelected = '[Products Catalogue] Product selected',
	SelectMultipleProducts = '[Products Catalogue] Product Select multiple products',
	ClearProductsSelection = '[Products Catalogue] Product selection cleared',
	ProductDeselected = '[Products Catalogue] Product deselected',
	ProductAddedToExcludedList = '[Products Catalogue] Product added to excluded list',
	ProductRemovedFromExcludedList = '[Products Catalogue] Product removed from excluded list',
	CleanupExcludedList = '[Products Catalogue] Cleanup excluded list',
}

export class ProductSelected {
	static readonly type = ProductsCatalogueActionTypes.ProductSelected;

	constructor(public productId: string) {}
}
export class SelectMultipleProducts {
	static readonly type = ProductsCatalogueActionTypes.SelectMultipleProducts;

	constructor(public productIds: string[]) {}
}

export class ClearProductsSelection {
	static readonly type = ProductsCatalogueActionTypes.ClearProductsSelection;

	constructor() {}
}

export class ProductDeselected {
	static readonly type = ProductsCatalogueActionTypes.ProductDeselected;

	constructor(public productId: string) {}
}

export class FetchProducts {
	static readonly type = ProductsCatalogueActionTypes.FetchProducts;

	constructor (public searchPhrase: string) { }
}

export class FetchProductsSuccess {
	static readonly type = ProductsCatalogueActionTypes.FetchProductsSuccess;

	constructor (public products: CatalogueItemDto[]) { }
}

export class FetchProductsFailure {
	static readonly type = ProductsCatalogueActionTypes.FetchProductsFailure;

	constructor (public error: string) { }
}

export class ProductAddedToExcludedList {
	static readonly type = ProductsCatalogueActionTypes.ProductAddedToExcludedList;

	constructor (public productGuids: string[]) { }
}

export class ProductRemovedFromExcludedList {
	static readonly type = ProductsCatalogueActionTypes.ProductRemovedFromExcludedList;

	constructor (public productId: string) { }
}

export class CleanupExcludedList {
	static readonly type = ProductsCatalogueActionTypes.CleanupExcludedList;

	constructor () { }
}
