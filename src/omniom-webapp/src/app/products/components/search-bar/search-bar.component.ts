import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-search-bar',
  template: `
  <mat-form-field class="w-full">
	  <input matInput placeholder="Wpisz nazwę produktu" type="text" #inputField (input)="searchPhraseModified(inputField.value)">
	  <button matSuffix mat-icon-button aria-label="Clear" (click)="clearSearchPhrase()">
		  <mat-icon>close</mat-icon>
	  </button>
  </mat-form-field>`
})
export class SearchBarComponent {
  @Output() searchPhraseUpdated: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('inputField', { static: true }) inputField!: ElementRef;

  searchPhraseModified(phrase: string) {
    this.searchPhraseUpdated.emit(phrase);
  }

  clearSearchPhrase() {
    this.inputField.nativeElement.value = '';
    this.searchPhraseUpdated.emit('');
  }
}
