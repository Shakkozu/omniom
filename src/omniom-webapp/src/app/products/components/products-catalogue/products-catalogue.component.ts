import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of, debounceTime, Subject } from 'rxjs';
import { ProductDetailsDescription } from '../../model';
import { Store } from '@ngxs/store';
import { FetchProducts } from '../../store/products-catalogue.actions';

@Component({
  selector: 'app-products-catalogue',
  template: `
	<app-search-bar (searchPhraseUpdated)="onSearchPhraseUpdated($event)"></app-search-bar>
	<app-products-list
   [addButtonEnabled]="addButtonEnabled"
   (addProductButtonClicked)="addProductButtonClicked.emit($event)"
   [selectionList]="selectionList"
   ></app-products-list>`,
})
export class ProductsCatalogueComponent implements OnInit {
  public productsList$: Observable<ProductDetailsDescription[]> = of([]);
  public filteredProducts$: Observable<ProductDetailsDescription[]> = of([]);

  private searchUpdated: Subject<string> = new Subject<string>();
  @Input() addButtonEnabled: boolean = false;
  @Input() selectionList: boolean = false;  
  @Output() addProductButtonClicked: EventEmitter<ProductDetailsDescription> = new EventEmitter<ProductDetailsDescription>();

  constructor (private store: Store) {
    this.store.dispatch(new FetchProducts(''));
    this.searchUpdated.pipe(
      debounceTime(200),
    ).subscribe((phrase) => {
      this.store.dispatch(new FetchProducts(phrase));
    });
   }

  onSearchPhraseUpdated(searchPhrase: string) {
    this.searchUpdated.next(searchPhrase);
  }

  ngOnInit(): void {
  }
}
