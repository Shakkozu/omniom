import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsListPageComponent } from './pages/products-list-page/products-list-page.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ProductsCatalogueComponent } from './components/products-catalogue/products-catalogue.component';
import { ProductsCatalogueStore } from './store/products-catalogue.store';
import { NgxsModule } from '@ngxs/store';
import { ProductListItemComponent as ProductPresentationListItemComponent } from './components/product-list-item/product-list-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent as ProductPresentationListComponent } from './components/product-list/product-list.component';
import { DishesListComponent } from '../dish-configuration/components/dishes-list/dishes-list.component';


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsListPageComponent,
    SearchBarComponent,
    ProductsCatalogueComponent,
    ProductPresentationListItemComponent,
    ProductPresentationListComponent
  ],
  imports: [
    NgxsModule.forFeature([
      ProductsCatalogueStore
    ]),
    MaterialModule,
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DishesListComponent
  ],
  exports: [
    ProductsListComponent,
    ProductsListPageComponent,
    SearchBarComponent,
    ProductsCatalogueComponent,
    ProductPresentationListItemComponent,
    ProductPresentationListComponent
  ]
})
export class ProductsModule { }
