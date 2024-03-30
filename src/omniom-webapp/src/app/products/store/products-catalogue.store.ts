import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ProductDetailsDescription } from "../model";
import { Injectable } from "@angular/core";
import { ProductsRestService, SearchProductsResponse } from "../products-rest.service";
import { CatalogueSelectionChanged, FetchProducts, FetchProductsFailure, FetchProductsSuccess, SearchPhraseUpdated } from "./products-catalogue.actions";

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
	static products(state: ProductsCatalogueStateModel) {
		return state.products;
	}

	@Selector()
	static productsWithSelectedProductsOnTop(state: ProductsCatalogueStateModel) {
		const selectedProducts = state.selectedProducts;
		const products = state.products;
		const selectedProductsGuids = selectedProducts.map(product => product.guid);
		const productsWithoutSelectedProducts = products.filter(product => !selectedProductsGuids.includes(product.guid));
		const productsWithSelectedProductsOnTop = selectedProducts.concat(productsWithoutSelectedProducts);

		return productsWithSelectedProductsOnTop;

	}

	@Action(CatalogueSelectionChanged)
	catalogueSelectionChanged(ctx: StateContext<ProductsCatalogueStateModel>, action: CatalogueSelectionChanged) {
		const products = ctx.getState().products;
		const selectedProducts = products
			.filter(product => action.selectedProductsIds.includes(product.guid))
			.sort((a, b) => a.name.localeCompare(b.name));
		

		ctx.patchState({
			selectedProducts: selectedProducts,
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

