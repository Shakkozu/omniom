import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CatalogueItem } from "../model";
import { Injectable } from "@angular/core";
import { ProductsRestService, SearchProductsResponse } from "../products-rest.service";
import { CleanupExcludedList, ClearProductsSelection, FetchProducts, FetchProductsFailure, FetchProductsSuccess, ProductAddedToExcludedList, ProductDeselected, ProductRemovedFromExcludedList, ProductSelected, SelectMultipleProducts } from "./products-catalogue.actions";

export interface ProductsCatalogueStateModel {
	selectedProducts: CatalogueItem[];
	products: CatalogueItem[];
	excludedProducts: CatalogueItem[];
	loading: boolean;
}

export const initialProductsCatalogueState: ProductsCatalogueStateModel = {
	selectedProducts: [],
	excludedProducts: [],
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
	static selectedProducts(state: ProductsCatalogueStateModel): CatalogueItem[] {
		return state.selectedProducts;
	}

	@Selector()
	static productsWithoutSelectedProducts(state: ProductsCatalogueStateModel): CatalogueItem[] {
		const selectedProductsIds = state.selectedProducts.map(p => p.guid);
		return state.products.filter(p => !selectedProductsIds.includes(p.guid));
	}

	@Selector()
	static products(state: ProductsCatalogueStateModel) {
		const excludedProductsIds = state.excludedProducts.map(p => p.guid);
		return state.products.filter(p => !excludedProductsIds.includes(p.guid));
	}

	@Action(ProductAddedToExcludedList)
	productAddedToExcludedList(ctx: StateContext<ProductsCatalogueStateModel>, action: ProductAddedToExcludedList) {
		const excludedProductsIds = ctx.getState().excludedProducts.map(p => p.guid);
		const productsToAddIds = action.productGuids.filter(productGuid => !excludedProductsIds.includes(productGuid));
		const productsToAdd = ctx.getState().products.filter(p => productsToAddIds.includes(p.guid));

		ctx.patchState({
			excludedProducts: [...ctx.getState().excludedProducts, ...productsToAdd]
		});
	}

	@Action(ProductRemovedFromExcludedList)
	productRemovedFromExcludedList(ctx: StateContext<ProductsCatalogueStateModel>, action: ProductRemovedFromExcludedList) {
		const excludedProducts = ctx.getState().excludedProducts.filter(p => p.guid !== action.productId);
		ctx.patchState({
			excludedProducts: excludedProducts
		});
	}
	
	@Action(CleanupExcludedList)
	cleanupExcludedList(ctx: StateContext<ProductsCatalogueStateModel>) {
		ctx.patchState({
			excludedProducts: []
		});
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

	@Action(SelectMultipleProducts)
	selectMultipleProductsproductSelected(ctx: StateContext<ProductsCatalogueStateModel>, action: SelectMultipleProducts) {
		const selectedProducts = ctx.getState().products.filter(p => action.productIds.find(pid => pid === p.guid)) ?? [];
		ctx.patchState({
			selectedProducts: selectedProducts
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
		const catalogueItems = action.products.map(p => CatalogueItem.fromDto(p));
		ctx.patchState({
			loading: false,
			products: catalogueItems,
		});
	}

	@Action(FetchProductsFailure)
	fetchProductsFailure(ctx: StateContext<ProductsCatalogueStateModel>, action: FetchProductsFailure) {
		ctx.patchState({
			loading: false,
		});
	}
}

