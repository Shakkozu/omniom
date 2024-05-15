import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishesConfigurationRoutingModule } from './dish-configuration-routing.module';
import { NewDishDialogComponent } from './components/new-dish-dialog/new-dish-dialog.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsModule } from '../products/products.module';
import { NgxsModule } from '@ngxs/store';
import { DishConfigurationStore } from './store/dish-configuration.state';


@NgModule({
  declarations: [
    NewDishDialogComponent
  ],
  imports: [
    NgxsModule.forFeature([
      DishConfigurationStore
    ]),
    CommonModule,
    MaterialModule,
    DishesConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsModule,
  ],
  exports: [
    NewDishDialogComponent
  ]
})
export class DishesConfigurationModule { }