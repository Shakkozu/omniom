import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of, debounceTime, switchMap, map } from 'rxjs';
import { ProductDetailsDescription } from '../../model';
import { ProductsRestService, SearchProductsResponse } from '../../products-rest.service';

@Component({
  selector: 'app-products-catalogue',
  template: `
	<app-search-bar (searchPhraseUpdated)="onSearchPhraseUpdated($event)"></app-search-bar>
	<app-products-list
   [addButtonEnabled]="addButtonEnabled"
   (addProductButtonClicked)="addProductButtonClicked.emit($event)"
   [products$]="filteredProducts$"
   [selectionList]="selectionList"
   (catalogueSelectionChanged)="catalogueSelectionChanged.emit($event)"
   ></app-products-list>`,
})
export class ProductsCatalogueComponent implements OnInit {
  public productsList$: Observable<ProductDetailsDescription[]> = of([]);
  public filteredProducts$: Observable<ProductDetailsDescription[]> = of([]);
  @Input() addButtonEnabled: boolean = false;
  @Input() selectionList: boolean = false;  
  @Output() addProductButtonClicked: EventEmitter<ProductDetailsDescription> = new EventEmitter<ProductDetailsDescription>();
  @Output() catalogueSelectionChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

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
