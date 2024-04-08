import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { MaterialModule } from '../material.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UserSettingsPageComponent } from './user-settings-page/user-settings-page.component';
import { UserSummaryPageComponent } from './user-summary-page/user-summary-page.component';
import { MealsConfigurationComponent } from './components/meals-configuration/meals-configuration.component';
import { UserProfileStore } from './store/user-profile.store';
import { NgxsModule } from '@ngxs/store';


@NgModule({
  declarations: [
    ProfilePageComponent,
    UserSettingsPageComponent,
    UserSummaryPageComponent,
    MealsConfigurationComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UserProfileRoutingModule,
    NgxsModule.forFeature([
      UserProfileStore
    ]),
  ]
})
export class UserProfileModule { }