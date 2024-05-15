import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, of, debounceTime, Subject } from 'rxjs';
import { ProductDetailsDescription } from '../../model';
import { Store } from '@ngxs/store';
import { FetchProducts } from '../../store/products-catalogue.actions';
import { ProductListChangedEvent, ProductsListComponent } from '../products-list/products-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-products-catalogue',
  template: `
	<app-search-bar #searchBar (searchPhraseUpdated)="onSearchPhraseUpdated($event)"></app-search-bar>
	<app-products-list 
   [addButtonEnabled]="addButtonEnabled"
   (addProductButtonClicked)="addProductButtonClicked.emit($event)"
   (productListChanged)="productListChanged.emit($event)"
   [selectionList]="selectionList"
   ></app-products-list>`,
})
export class ProductsCatalogueComponent implements OnInit {
  private searchUpdated: Subject<string> = new Subject<string>();
  @ViewChild('searchBar') searchBar!: SearchBarComponent;
  @Input() addButtonEnabled: boolean = false;
  @Input() selectionList: boolean = false;  
  @Output() addProductButtonClicked: EventEmitter<ProductDetailsDescription> = new EventEmitter<ProductDetailsDescription>();
  @Output() productListChanged: EventEmitter<ProductListChangedEvent> = new EventEmitter<ProductListChangedEvent>();

  constructor (private store: Store) {
    this.store.dispatch(new FetchProducts(''));
    this.searchUpdated.pipe(
      debounceTime(200),
    ).subscribe((phrase) => {
      this.store.dispatch(new FetchProducts(phrase));
    });
  }

  public clearSearchPhrase() {
    this.searchBar.clearSearchPhrase();
    
  }

  onSearchPhraseUpdated(searchPhrase: string) {
    this.searchUpdated.next(searchPhrase);
  }

  ngOnInit(): void {
  }
}
