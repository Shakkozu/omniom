import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UserSettingsPageComponent } from './user-settings-page/user-settings-page.component';
import { UserSummaryPageComponent } from './user-summary-page/user-summary-page.component';

const routes: Routes = [
  { path: '', component: ProfilePageComponent },
  { path: 'settings', component: UserSettingsPageComponent },
  { path: 'summary', component: UserSummaryPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
