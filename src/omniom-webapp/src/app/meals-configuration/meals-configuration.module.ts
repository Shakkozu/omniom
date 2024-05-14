import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealsConfigurationRoutingModule } from './meals-configuration-routing.module';
import { NewMealDialogComponent } from './components/new-meal-dialog/new-meal-dialog.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsModule } from '../products/products.module';


@NgModule({
  declarations: [
    NewMealDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MealsConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsModule
  ],
  exports: [
    NewMealDialogComponent
  ]
})
export class MealsConfigurationModule { }
