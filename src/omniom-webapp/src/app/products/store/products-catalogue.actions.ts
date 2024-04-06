import { ProductDetailsDescription } from "../model";

export enum ProductsCatalogueActionTypes {
	FetchProducts = '[Products Catalogue] Fetch products',
	FetchProductsSuccess = '[Products Catalogue] Fetch products success',
	FetchProductsFailure = '[Products Catalogue] Fetch products failure',
	ProductSelected = '[Products Catalogue] Product selected',
	ClearProductsSelection = '[Products Catalogue] Product selection cleared',
	ProductDeselected = '[Products Catalogue] Product deselected',
}

export class ProductSelected {
	static readonly type = ProductsCatalogueActionTypes.ProductSelected;

	constructor(public productId: string) {}
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

	constructor (public products: ProductDetailsDescription[]) { }
}

export class FetchProductsFailure {
	static readonly type = ProductsCatalogueActionTypes.FetchProductsFailure;

	constructor (public error: string) { }
}
