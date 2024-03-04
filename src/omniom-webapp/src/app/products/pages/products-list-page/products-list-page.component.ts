import { Component } from '@angular/core';
import { Product } from '../../model';

@Component({
  selector: 'app-products-list-page',
  templateUrl: './products-list-page.component.html'
})
export class ProductsListPageComponent {
  public productsList: Product[] = PRODUCTS;
  
  onAddButtonClicked(product: Product) {
    console.log(product);
  }
}

export const PRODUCTS: Product[] = [
  {
    name: "Apple",
    guid: "1a2b3c",
    defaultPortionSize: "1 medium apple",
    defaultPortionKcal: 95
  },
  {
    name: "Banana",
    guid: "4d5e6f",
    defaultPortionSize: "1 medium banana",
    defaultPortionKcal: 105
  },
  {
    name: "Spinach",
    guid: "7g8h9i",
    defaultPortionSize: "1 cup",
    defaultPortionKcal: 7
  },
  {
    name: "Chicken Breast",
    guid: "10j11k12l",
    defaultPortionSize: "3 oz",
    defaultPortionKcal: 142
  },
  {
    name: "Brown Rice",
    guid: "13m14n15o",
    defaultPortionSize: "1 cup cooked",
    defaultPortionKcal: 216
  },
  {
    name: "Broccoli",
    guid: "16p17q18r",
    defaultPortionSize: "1 cup chopped",
    defaultPortionKcal: 55
  },
  {
    name: "Salmon",
    guid: "19s20t21u",
    defaultPortionSize: "3 oz cooked",
    defaultPortionKcal: 155
  },
  {
    name: "Oatmeal",
    guid: "22v23w24x",
    defaultPortionSize: "1 cup cooked",
    defaultPortionKcal: 147
  },
  {
    name: "Eggs",
    guid: "25y26z27a",
    defaultPortionSize: "2 large eggs",
    defaultPortionKcal: 140
  },
  {
    name: "Carrot",
    guid: "28b29c30d",
    defaultPortionSize: "1 medium carrot",
    defaultPortionKcal: 25
  },
  {
    name: "Almonds",
    guid: "31e32f33g",
    defaultPortionSize: "1 oz (23 almonds)",
    defaultPortionKcal: 164
  },
  {
    name: "Greek Yogurt",
    guid: "34h35i36j",
    defaultPortionSize: "1 cup",
    defaultPortionKcal: 130
  },
  {
    name: "Tomato",
    guid: "37k38l39m",
    defaultPortionSize: "1 medium tomato",
    defaultPortionKcal: 22
  },
  {
    name: "Tuna",
    guid: "40n41o42p",
    defaultPortionSize: "3 oz canned",
    defaultPortionKcal: 99
  },
  {
    name: "Cucumber",
    guid: "43q44r45s",
    defaultPortionSize: "1/2 cucumber",
    defaultPortionKcal: 8
  },
  {
    name: "Quinoa",
    guid: "46t47u48v",
    defaultPortionSize: "1 cup cooked",
    defaultPortionKcal: 222
  },
  {
    name: "Avocado",
    guid: "49w50x51y",
    defaultPortionSize: "1/2 avocado",
    defaultPortionKcal: 160
  },
  // Add more products as needed
];
