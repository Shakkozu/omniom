import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-list-page',
  template: `
<div class="container w-1/4">
	<app-products-catalogue [addNewDishButtonEnabled]="true"></app-products-catalogue>
</div>`,
})
export class ProductsListPageComponent implements OnInit {

  constructor () { }

  ngOnInit(): void {
    
  }
}
