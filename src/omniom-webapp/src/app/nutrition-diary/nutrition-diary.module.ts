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
import { ModifyMealNutritionEntriesComponent } from "./components/modify-meal-nutrition-entries/modify-meal-nutrition-entries.component";
import { ProductsModule } from "../products/products.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DailyNutritionGoalComponent } from "./components/daily-nutrition-goal/daily-nutrition-goal.component";
import { DishesConfigurationModule } from "../dish-configuration/dish-configuration.module";

@NgModule({
	declarations: [
		NutritionDiaryPageComponent,
		DiaryDaySelectorComponent,
		DiaryDaySummaryComponent,
		MealDetailsComponent,
		ModifyMealNutritionEntriesComponent,
		DailyNutritionGoalComponent,
	],
	imports: [
		NgxsModule.forFeature([
			NutritionDiaryStore
		]),
		MaterialModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NutritionDiaryRoutingModule,
		ProductsModule,
		DishesConfigurationModule
	],
	exports: [
		ModifyMealNutritionEntriesComponent
	]
})
export class NutritionDiaryModule { }
