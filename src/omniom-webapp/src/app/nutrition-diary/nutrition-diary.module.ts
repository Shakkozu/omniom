import { NgModule } from "@angular/core";
import { MaterialModule } from "../material.module";
import { CommonModule } from "@angular/common";
import { NutritionDiaryRoutingModule } from "./nutrition-diary.routing.module";
import { NutritionDiaryPageComponent } from "./pages/nutrition-diary-page/nutrition-diary-page.component";
import { DiaryDaySelectorComponent } from "./components/diary-day-selector/diary-day-selector.component";

@NgModule({
	declarations: [
		NutritionDiaryPageComponent,
		DiaryDaySelectorComponent,
	],
	imports: [
		MaterialModule,
		CommonModule,
		NutritionDiaryRoutingModule
	],
})
export class NutritionDiaryModule { }
