import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'products', canActivate: [AuthGuard], loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'diary', canActivate: [AuthGuard], loadChildren: () => import('./nutrition-diary/nutrition-diary.module').then(m => m.NutritionDiaryModule) },
  { path: 'account', canActivate: [AuthGuard], loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule) },
  { path: 'nutritionist', canActivate: [AuthGuard], loadChildren: () => import('./nutritionist/nutritionist.module').then(m => m.NutritionistModule) },
]
  ;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
