import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './starter/components/start/start.component';
import { MatDashboardComponent } from './starter/components/mat-dashboard/mat-dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'start', component: MatDashboardComponent },
  { path: 'weather', component: StartComponent },
  { path: 'products', canActivate: [AuthGuard], loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
  { path: 'diary', canActivate: [AuthGuard], loadChildren: () => import('./nutrition-diary/nutrition-diary.module').then(m => m.NutritionDiaryModule)},
]
  ;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
