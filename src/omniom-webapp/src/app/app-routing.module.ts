import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './starter/components/start/start.component';
import { MatDashboardComponent } from './starter/components/mat-dashboard/mat-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: MatDashboardComponent },
  { path: 'weather', component: StartComponent },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)}
]
  ;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }