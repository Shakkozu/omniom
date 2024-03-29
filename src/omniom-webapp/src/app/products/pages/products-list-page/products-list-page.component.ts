import { Component, OnInit } from '@angular/core';
import { Observable, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { ProductsRestService, SearchProductsResponse } from '../../products-rest.service';
import { ProductDetailsDescription } from '../../model';

@Component({
  selector: 'app-products-list-page',
  template: `
<div class="container w-1/4">
	<app-products-catalogue></app-products-catalogue>
</div>`,
})
export class ProductsListPageComponent implements OnInit {
  public productsList$: Observable<ProductDetailsDescription[]> = of([]);
  public filteredProducts$: Observable<ProductDetailsDescription[]> = of([]);

  constructor (private productsRestService: ProductsRestService) { }

  onSearchPhraseUpdated(searchPhrase: string) {
    this.filteredProducts$ = this.productsList$.pipe(
      debounceTime(300),
      switchMap(() => this.productsRestService.getProducts(searchPhrase))
    ).pipe(
      map((response: SearchProductsResponse) => {
        return response.products;
      })
    );
  }

  ngOnInit(): void {
    this.filteredProducts$ = this.productsRestService.getProducts('').pipe(
      map((response: SearchProductsResponse) => {
        return response.products;
      })
    );
  }
}
