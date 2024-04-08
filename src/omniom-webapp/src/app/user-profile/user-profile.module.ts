import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { MaterialModule } from '../material.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UserSettingsPageComponent } from './user-settings-page/user-settings-page.component';
import { UserSummaryPageComponent } from './user-summary-page/user-summary-page.component';


@NgModule({
  declarations: [
    ProfilePageComponent,
    UserSettingsPageComponent,
    UserSummaryPageComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UserProfileRoutingModule
  ]
})
export class UserProfileModule { }
