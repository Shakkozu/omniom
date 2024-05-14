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
import { MealsConfigurationModule } from '../meals-configuration/meals-configuration.module';
import { ProductListItemComponent } from './components/product-list-item/product-list-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsListPageComponent,
    SearchBarComponent,
    ProductsCatalogueComponent,
    ProductListItemComponent
  ],
  imports: [
    NgxsModule.forFeature([
      ProductsCatalogueStore
    ]),
    MaterialModule,
    MealsConfigurationModule,
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ProductsListComponent,
    ProductsListPageComponent,
    SearchBarComponent,
    ProductsCatalogueComponent,
    ProductListItemComponent
  ]
})
export class ProductsModule { }
