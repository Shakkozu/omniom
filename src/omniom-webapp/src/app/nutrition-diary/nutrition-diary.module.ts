import { NgModule } from "@angular/core";
import { MaterialModule } from "../material.module";
import { CommonModule } from "@angular/common";
import { NutritionDiaryRoutingModule } from "./nutrition-diary.routing.module";
import { NutritionDiaryPageComponent } from "./pages/nutrition-diary-page/nutrition-diary-page.component";
import { DiaryDaySelectorComponent } from "./components/diary-day-selector/diary-day-selector.component";
import { NutritionDiaryStore } from "./store/nutrition-diary.store";
import { NgxsModule } from "@ngxs/store";
import { DiaryDaySummaryComponent } from "./components/diary-day-selector/diary-day-summary/diary-day-summary.component";
import { MealDetailsComponent } from "./components/meal-details/meal-details.component";

@NgModule({
	declarations: [
		NutritionDiaryPageComponent,
		DiaryDaySelectorComponent,
		DiaryDaySummaryComponent,
		MealDetailsComponent,
	],
	imports: [
		NgxsModule.forFeature([
			NutritionDiaryStore
		]),
		MaterialModule,
		CommonModule,
		NutritionDiaryRoutingModule,
	],
})
export class NutritionDiaryModule { }
