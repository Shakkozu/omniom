import { ProductDetailsDescription } from "../model";

export enum ProductsCatalogueActionTypes {
	CatalogueSelectionChanged = '[Products Catalogue] Catalogue selection changed',
	FetchProducts = '[Products Catalogue] Fetch products',
	FetchProductsSuccess = '[Products Catalogue] Fetch products success',
	FetchProductsFailure = '[Products Catalogue] Fetch products failure',
}

export class CatalogueSelectionChanged {
	static readonly type = ProductsCatalogueActionTypes.CatalogueSelectionChanged;

	constructor (public selectedProductsIds: string[]) { }
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
