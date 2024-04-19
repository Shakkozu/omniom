import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UserSettingsPageComponent } from './user-settings-page/user-settings-page.component';

const routes: Routes = [
  { path: '', component: ProfilePageComponent },
  { path: 'settings', component: UserSettingsPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
