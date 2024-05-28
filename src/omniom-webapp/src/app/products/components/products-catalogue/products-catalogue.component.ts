import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, of, debounceTime, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { FetchProducts } from '../../store/products-catalogue.actions';
import { ProductListChangedEvent, ProductsListComponent } from '../products-list/products-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FetchDishes } from '../../../dish-configuration/store/dish-configuration.actions';
import { CatalogueItem } from '../../model';

@Component({
  selector: 'app-products-catalogue',
  template: `
	<app-search-bar #searchBar (searchPhraseUpdated)="onSearchPhraseUpdated($event)"></app-search-bar>
  <mat-button-toggle-group *ngIf="!onlyProducts" name="searchType" aria-label="search type" (change)="selectedProductType = $event.value">
        <mat-button-toggle checked value="Product">Produkty</mat-button-toggle>
        <mat-button-toggle value="Dish">Dania</mat-button-toggle>
      </mat-button-toggle-group>
	<app-products-list *ngIf="selectedProductType === 'Product'"
   [addButtonEnabled]="addButtonEnabled"
   (addProductButtonClicked)="addProductButtonClicked.emit($event)"
   (productListChanged)="productListChanged.emit($event)"
   [selectionList]="selectionList">
  </app-products-list>
  <app-dishes-list *ngIf="!onlyProducts && selectedProductType === 'Dish'"
  [selectionList]="selectionList"
  [addNewDishButtonEnabled]="addNewDishButtonEnabled"
  (dishListChanged)="dishListChanged.emit($event)"
  >
</app-dishes-list>
   `,
})
export class ProductsCatalogueComponent implements OnInit {
  private searchUpdated: Subject<string> = new Subject<string>();
  @ViewChild('searchBar') searchBar!: SearchBarComponent;
  @Input() addButtonEnabled: boolean = false;
  @Input() addNewDishButtonEnabled: boolean = false;
  @Input() onlyProducts: boolean = false;
  @Input() selectionList: boolean = false;  
  @Output() addProductButtonClicked: EventEmitter<CatalogueItem> = new EventEmitter<CatalogueItem>();
  @Output() productListChanged: EventEmitter<ProductListChangedEvent> = new EventEmitter<ProductListChangedEvent>();
  @Output() dishListChanged: EventEmitter<ProductListChangedEvent> = new EventEmitter<ProductListChangedEvent>();
  public selectedProductType: SelectedProductType = SelectedProductType.Product;


  constructor (private store: Store) {
  }

  onSearchTypeUpdated(event: any) {
  }

  public clearSearchPhrase() {
    this.searchBar.clearSearchPhrase();
    
  }

  onSearchPhraseUpdated(searchPhrase: string) {
    this.searchUpdated.next(searchPhrase);
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchProducts(''));
    this.store.dispatch(new FetchDishes(''));
    this.searchUpdated.pipe(
      debounceTime(200),
    ).subscribe((phrase) => {
      this.store.dispatch(new FetchProducts(phrase));
    });
  }
}


export enum SelectedProductType {
  Product = 'Product',
  Dish = 'Dish'
}