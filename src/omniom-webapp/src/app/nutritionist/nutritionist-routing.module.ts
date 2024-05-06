import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { NutritionistProfilePageComponent } from './pages/nutritionist-profile-page/nutritionist-profile-page.component';

const routes: Routes = [
  { path: '', component:  NutritionistProfilePageComponent },
  { path: 'profile', component:  NutritionistProfilePageComponent },
  { path: 'register', component: RegistrationPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionistRoutingModule { }
