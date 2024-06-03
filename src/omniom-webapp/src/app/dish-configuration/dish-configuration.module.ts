import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishesConfigurationRoutingModule } from './dish-configuration-routing.module';
import { NewDishDialogComponent } from './components/new-dish-dialog/new-dish-dialog.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsModule } from '../products/products.module';
import { ModifyDishDialogComponent } from './components/modify-dish-dialog/modify-dish-dialog.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { DishProductsSelectorComponent } from './components/dish-products-selector/dish-products-selector.component';
import { DishesListComponent } from './components/dishes-list/dishes-list.component';


@NgModule({
  declarations: [
    NewDishDialogComponent,
    ModifyDishDialogComponent,
    DishFormComponent,
    DishProductsSelectorComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DishesConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsModule,
  ],
  exports: [
    NewDishDialogComponent,
    DishesListComponent
  ]
})
export class DishesConfigurationModule { }
