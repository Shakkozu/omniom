import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionistRoutingModule } from './nutritionist-routing.module';
import { MaterialModule } from '../material.module';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';
import { TermsAndConditionsDialogComponent } from './pages/registration-page/terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { NutritionistProfilePageComponent } from './pages/nutritionist-profile-page/nutritionist-profile-page.component';
import { NgxsModule } from '@ngxs/store';
import { NutritionistStore } from './store/nutritionist.store';


@NgModule({
  declarations: [
    RegistrationPageComponent,
    TermsAndConditionsDialogComponent,
    NutritionistProfilePageComponent
  ],
  imports: [
    NgxsModule.forFeature([
      NutritionistStore
    ]),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NutritionistRoutingModule
  ]
})
export class NutritionistModule { }
