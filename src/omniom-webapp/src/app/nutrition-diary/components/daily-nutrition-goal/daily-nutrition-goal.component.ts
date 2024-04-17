import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserProfileStore } from '../../../user-profile/store/user-profile.store';
import { NutritionDiaryStore } from '../../store/nutrition-diary.store';
import { Observable, async, combineLatest, exhaustMap, forkJoin, map, merge, mergeMap, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-daily-nutrition-goal',
  template: `
  <div class="w-full mt-8 mx-4 h-24 bg-slate-100 text-center flex flex-row">
    <div class="nutrition-goal-progress-container mx-4 w-1/3">
      <h4>Białko</h4>
    <mat-progress-bar  class="mb-4" mode="determinate" [value]="getPercentProteins() | async"></mat-progress-bar>
    <span>{{(nutritionDaySummary$ | async)?.totalProteins?.toFixed(2)}}g / {{(nutritionGoals$ | async)?.proteinsGrams}}g</span>
  </div>
  <div class="nutrition-goal-progress-container mx-4 w-1/3">
    <h4>Węglowodany</h4>
    <mat-progress-bar class="mb-4" mode="determinate" [value]="getPercentsCarbs() | async"></mat-progress-bar>
    <span>{{(nutritionDaySummary$ | async)?.totalCarbohydrates?.toFixed(2)}}g / {{(nutritionGoals$ | async)?.carbohydratesGrams}}g</span>

  </div>
  <div class="nutrition-goal-progress-container mx-4 w-1/3">
    <h4>Tłuszcze</h4>
    <mat-progress-bar class="mb-4" mode="determinate" [value]="getPercentFats() | async"></mat-progress-bar>
    <span>{{(nutritionDaySummary$ | async)?.totalFats?.toFixed(2)}}g / {{(nutritionGoals$ | async)?.proteinsGrams}}g</span>
  </div>
</div>
  
  `,
  styleUrl: './daily-nutrition-goal.component.scss'
})
export class DailyNutritionGoalComponent {
  public nutritionGoals$ = this.store.select(UserProfileStore.nutritionTargets);
  public nutritionDaySummary$ = this.store.select(NutritionDiaryStore.selectedNutritionDaySummary);
  constructor(private store: Store) {
    
  }

  public getPercentProteins() : Observable<number> {
      return combineLatest([this.nutritionGoals$, this.nutritionDaySummary$]).pipe(
        map(([goals, summary]) => {
          if (goals && summary) {
            return summary.totalProteins / goals.proteinsGrams * 100;
          }
          return 0;
        })
      );
  }
  
  public getPercentsCarbs() : Observable<number> {
      return combineLatest([this.nutritionGoals$, this.nutritionDaySummary$]).pipe(
        map(([goals, summary]) => {
          if (goals && summary) {
            return summary.totalCarbohydrates / goals.carbohydratesGrams * 100;
          }
          return 0;
        })
      );
  }
  
  public getPercentFats() : Observable<number> {
      return combineLatest([this.nutritionGoals$, this.nutritionDaySummary$]).pipe(
        map(([goals, summary]) => {
          if (goals && summary) {
            return summary.totalFats / goals.fatsGrams * 100;
          }
          return 0;
        })
      );
  }
  
}
