import { Component, OnDestroy } from '@angular/core';
import { MealType } from '../../../nutrition-diary/model';
import { Store } from '@ngxs/store';
import { UpdateUserMealsConfiguration } from '../../store/user-profile.actions';
import { UserProfileStore } from '../../store/user-profile.store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-meals-configuration',
  template: `
  <div class="dashboard-card">
    <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
    <mat-card>
      <mat-card-header class="bg-slate-200">
        <mat-card-title class="p-4">
          Konfiguracja posiłków
        </mat-card-title>
      </mat-card-header>
      <mat-card-content class="text-left mt-4">
        <h3>Wybierz posiłki które chcesz uwzględnić w swoim dzienniku</h3>
        <mat-error class="text-yellow-500" *ngIf="!canDisableMoreMeals">Co najmniej {{MINIMUM_MEALS_COUNT}} posiłki muszą zostać wybrane</mat-error>
        <div class="row">
          <mat-selection-list>
            <mat-list-option
            *ngFor="let meal of viewModel.availableMeals"
            [value]="meal.key"
            [selected]="meal.enabled"
            [disabled]="isOptionDisabled(meal)"
            (selectedChange)="onSelectionChanged(meal.key, $event)">
            {{ meal.value }}
          </mat-list-option>
        </mat-selection-list>
      </div>
      <div class="row mt-8 pe-4 flex flex-row-reverse">
        <button [disabled]="loading$ | async" (click)="onSaveButtonClicked()" mat-raised-button color="primary">Zapisz</button>
      </div>
    </mat-card-content>
  </mat-card>
</div>
  `,
  styles: `.dashboard-card { position: absolute; top: 1rem; left: 1rem; right: 1rem; bottom: 1rem;}`
})
export class MealsConfigurationComponent implements OnDestroy {
  public readonly MINIMUM_MEALS_COUNT = 3;
  public loading$ = this.store.select(UserProfileStore.loading);
  private destroy$ = new Subject<void>();
  private mealsTranslations = {
    [MealType.Breakfast]: 'Śniadanie',
    [MealType.SecondBreakfast]: 'Drugie śniadanie',
    [MealType.Dinner]: 'Obiad',
    [MealType.Snack]: 'Przekąska',
    [MealType.Supper]: 'Kolacja'
  };
  public viewModel: MealConfiguraitonViewModel;
  constructor (private store: Store) {
    this.viewModel = this.defaultMealConfigurationViewModel();
    this.store.select(UserProfileStore.mealsConfiguration).subscribe(config => {
      if (!config) {
        return;
      }

      this.viewModel.availableMeals = config.map(m => ({ key: m.key, value: this.mealsTranslations[m.key], enabled: m.enabled }));
    });
  }

  


  public get canDisableMoreMeals() {
    return this.viewModel.availableMeals.filter(m => m.enabled).length > this.MINIMUM_MEALS_COUNT;
  }

  public isOptionDisabled(key: { key: MealType; value: string; enabled: boolean; }): boolean {
    return key.enabled && !this.canDisableMoreMeals;
  }

  public onSaveButtonClicked() {
    const config = this.viewModel.availableMeals.map(m => ({ mealName: MealType[m.key], enabled: m.enabled }));
    this.store.dispatch(new UpdateUserMealsConfiguration(config));
  }

  public onSelectionChanged(selectedMeal: MealType, selectionValue: boolean) {
    const modifiedMeal = this.viewModel.availableMeals.find(m => m.key === selectedMeal);
    if (!modifiedMeal) {
      return;
    }
    modifiedMeal.enabled = selectionValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private defaultMealConfigurationViewModel(): MealConfiguraitonViewModel {
    return {
      availableMeals: [
        { key: MealType.Breakfast, value: 'Śniadanie', enabled: true },
        { key: MealType.SecondBreakfast, value: 'Drugie śniadanie', enabled: true },
        { key: MealType.Dinner, value: 'Obiad', enabled: true },
        { key: MealType.Snack, value: 'Przekąska', enabled: true },
        { key: MealType.Supper, value: 'Kolacja', enabled: true }
      ],
    };
  }
}


interface MealConfiguraitonViewModel {
  availableMeals: { key: MealType, value: string, enabled: boolean }[];
}


