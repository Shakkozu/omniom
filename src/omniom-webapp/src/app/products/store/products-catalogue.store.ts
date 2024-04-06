import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ProductDetailsDescription } from "../model";
import { Injectable } from "@angular/core";
import { ProductsRestService, SearchProductsResponse } from "../products-rest.service";
import { ClearProductsSelection, FetchProducts, FetchProductsFailure, FetchProductsSuccess, ProductDeselected, ProductSelected } from "./products-catalogue.actions";

export interface ProductsCatalogueStateModel {
	selectedProducts: ProductDetailsDescription[];
	products: ProductDetailsDescription[];
	loading: boolean;
}

export const initialProductsCatalogueState: ProductsCatalogueStateModel = {
	selectedProducts: [],
	products: [],
	loading: false,
};

@State<ProductsCatalogueStateModel>({
	name: 'productsCatalogue',
	defaults: initialProductsCatalogueState,
})
@Injectable()
export class ProductsCatalogueStore {
	constructor (private productsRestService: ProductsRestService) { }

	
	@Selector()
	static selectedProducts(state: ProductsCatalogueStateModel): ProductDetailsDescription[] {
		return state.selectedProducts;
	}

	@Selector()
	static productsWithoutSelectedProducts(state: ProductsCatalogueStateModel): ProductDetailsDescription[] {
		const selectedProductsIds = state.selectedProducts.map(p => p.guid);
		return state.products.filter(p => !selectedProductsIds.includes(p.guid));
	}

	@Selector()
	static products(state: ProductsCatalogueStateModel) {
		return state.products;
	}


	@Action(ProductSelected)
	productSelected(ctx: StateContext<ProductsCatalogueStateModel>, action: ProductSelected) {
		const selectedProduct = ctx.getState().products.find(p => p.guid == action.productId);
		if(!selectedProduct)
			return;
		ctx.patchState({
			selectedProducts: [...ctx.getState().selectedProducts, selectedProduct]
		});
	}

	@Action(ProductDeselected)
	productDeselected(ctx: StateContext<ProductsCatalogueStateModel>, action: ProductSelected) {
		const selectedProducts = ctx.getState().selectedProducts.filter(p => p.guid !== action.productId);
		ctx.patchState({
			selectedProducts: selectedProducts
		});
	}
	
	@Action(ClearProductsSelection)
	clearProductsSelection(ctx: StateContext<ProductsCatalogueStateModel>, action: ClearProductsSelection) {
		ctx.patchState({
			selectedProducts: []
		});
	}

	@Action(FetchProducts)
	fetchProducts(ctx: StateContext<ProductsCatalogueStateModel>, action: FetchProducts) {
		ctx.patchState({
			loading: true,
		});

		this.productsRestService.getProducts(action.searchPhrase).subscribe(
			(response: SearchProductsResponse) => {
				ctx.dispatch(new FetchProductsSuccess(response.products));
			},
			(error: string) => {
				ctx.dispatch(new FetchProductsFailure(error));
			}
		);
	}

	@Action(FetchProductsSuccess)
	fetchProductsSuccess(ctx: StateContext<ProductsCatalogueStateModel>, action: FetchProductsSuccess) {
		ctx.patchState({
			loading: false,
			products: action.products,
		});
	}

	@Action(FetchProductsFailure)
	fetchProductsFailure(ctx: StateContext<ProductsCatalogueStateModel>, action: FetchProductsFailure) {
		ctx.patchState({
			loading: false,
		});
	}
}

