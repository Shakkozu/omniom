import { Component } from '@angular/core';

@Component({
  selector: 'app-daily-nutrition-goal',
  template: `
  <div class="w-full mt-8 mx-4 h-24 bg-slate-100 text-center flex flex-row">
    <div class="nutrition-goal-progress-container mx-4 w-1/3">
      <h4>Białko</h4>
    <mat-progress-bar  style="background-color: yellow;" class="mb-4" mode="determinate" value="40"></mat-progress-bar>
    <span>20 g / 100g</span>
  </div>
  <div class="nutrition-goal-progress-container mx-4 w-1/3">
    <h4>Węglowodany</h4>
    <mat-progress-bar class="mb-4" mode="determinate" value="40"></mat-progress-bar>
    <span>20 g / 100g</span>

  </div>
  <div class="nutrition-goal-progress-container mx-4 w-1/3">
    <h4>Tłuszcze</h4>
    <mat-progress-bar class="mb-4" mode="determinate" value="40"></mat-progress-bar>
    <span>20 g / 100g</span>
  </div>
</div>
  
  `,
  styleUrl: './daily-nutrition-goal.component.scss'
})
export class DailyNutritionGoalComponent {

}
