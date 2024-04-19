import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { MaterialModule } from '../material.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UserSettingsPageComponent } from './user-settings-page/user-settings-page.component';
import { MealsConfigurationComponent } from './components/meals-configuration/meals-configuration.component';
import { UserProfileStore } from './store/user-profile.store';
import { NgxsModule } from '@ngxs/store';
import { NutritionTargetsConfigurationComponent } from './components/nutrition-targets-configuration/nutrition-targets-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfilePageComponent,
    UserSettingsPageComponent,
    MealsConfigurationComponent,
    NutritionTargetsConfigurationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UserProfileRoutingModule,
    NgxsModule.forFeature([
      UserProfileStore
    ]),
  ]
})
export class UserProfileModule { }
