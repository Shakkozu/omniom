import { RouterModule, Routes } from "@angular/router";
import { NutritionDiaryPageComponent } from "./pages/nutrition-diary-page/nutrition-diary-page.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'list' },
	{ path: 'diary', component: NutritionDiaryPageComponent },
]

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		RouterModule.forChild(routes)
	],
	exports: [RouterModule]
})
export class NutritionDiaryRoutingModule { }
