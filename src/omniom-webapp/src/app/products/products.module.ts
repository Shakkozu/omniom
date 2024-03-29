import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsListPageComponent } from './pages/products-list-page/products-list-page.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsListPageComponent,
    SearchBarComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    ProductsRoutingModule,
  ]
})
export class ProductsModule { }
