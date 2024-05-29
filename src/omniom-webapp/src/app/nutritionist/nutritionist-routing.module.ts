import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { NutritionistProfilePageComponent } from './pages/nutritionist-profile-page/nutritionist-profile-page.component';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminVerificationPage } from './pages/admin-verification-page/admin-verification-page.component';
import { MealPlanConfiguratorComponent } from './components/meal-plan-configurator/meal-plan-configurator.component';

const routes: Routes = [
  { path: '', component:  NutritionistProfilePageComponent },
  { path: 'profile', component:  NutritionistProfilePageComponent, pathMatch: 'full'},
  { path: 'new-meal-plan', component:  MealPlanConfiguratorComponent, pathMatch: 'full'},
  { path: 'pending-verification-requests', component: AdminVerificationPage, pathMatch: 'full', canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionistRoutingModule { }
