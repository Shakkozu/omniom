import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishesConfigurationRoutingModule } from './dish-configuration-routing.module';
import { NewDishDialogComponent } from './components/new-dish-dialog/new-dish-dialog.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsModule } from '../products/products.module';
import { DishDetailsComponent } from './components/dish-details/dish-details.component';


@NgModule({
  declarations: [
    NewDishDialogComponent,
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
  ]
})
export class DishesConfigurationModule { }
