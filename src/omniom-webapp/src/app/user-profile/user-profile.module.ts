import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { MaterialModule } from '../material.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';


@NgModule({
  declarations: [
    ProfilePageComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    UserProfileRoutingModule
  ]
})
export class UserProfileModule { }
