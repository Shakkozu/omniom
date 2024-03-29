import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsListPageComponent } from './pages/products-list-page/products-list-page.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ProductsCatalogueComponent } from './components/products-catalogue/products-catalogue.component';


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsListPageComponent,
    SearchBarComponent,
    ProductsCatalogueComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    ProductsRoutingModule,
  ],
  exports: [
    ProductsListComponent,
    ProductsListPageComponent,
    SearchBarComponent,
    ProductsCatalogueComponent,
  ]
})
export class ProductsModule { }
