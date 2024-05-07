import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { NutritionistProfilePageComponent } from './pages/nutritionist-profile-page/nutritionist-profile-page.component';
import { PendingVerificationRequestsComponent } from './components/pending-verification-requests/pending-verification-requests.component';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

const routes: Routes = [
  { path: '', component:  NutritionistProfilePageComponent },
  { path: 'profile', component:  NutritionistProfilePageComponent, pathMatch: 'full'},
  { path: 'register', component: RegistrationPageComponent, pathMatch: 'full'},
  { path: 'pending-verification-requests', component: PendingVerificationRequestsComponent, pathMatch: 'full', canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionistRoutingModule { }
