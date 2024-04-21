import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionistRoutingModule } from './nutritionist-routing.module';
import { MaterialModule } from '../material.module';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';


@NgModule({
  declarations: [
    RegistrationPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NutritionistRoutingModule
  ]
})
export class NutritionistModule { }
