import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DaySummary } from '../../model';
import { Store } from '@ngxs/store';
import { FetchNutritionSummaries, SummaryDaySelected } from '../../store/nutrition-diary.actions';
import { Observable } from 'rxjs';
import { NutritionDiaryStore } from '../../store/nutrition-diary.store';

@Component({
  selector: 'app-diary-day-selector',
  templateUrl: './diary-day-selector.component.html',
  styleUrl: './diary-day-selector.component.scss'
})
export class DiaryDaySelectorComponent {
  public summariesFromRange$: Observable<DaySummary[]> = this.store.select(NutritionDiaryStore.daySummaries);
  public isLoading$: Observable<boolean> = this.store.select(state => state.nutritionDiary.loading);
  public selectedNutritionDay$: Observable<Date | null> = this.store.select(NutritionDiaryStore.selectedNutritionDay);

  public startDate: Date | null;
  public endDate: Date | null;
  private defaultDaysHistoryLoaded = 14;
  
  constructor (private store: Store) {
    this.startDate = new Date(new Date().setDate(new Date().getDate() - this.defaultDaysHistoryLoaded));
    this.endDate = new Date();
    this.store.dispatch(new FetchNutritionSummaries(this.startDate, this.endDate)).subscribe(_ => {
      const summaries = this.store.selectSnapshot(NutritionDiaryStore.daySummaries);
      if (summaries.length === 0) {
        console.error('No summaries found in store');
        return
      };
      const todaySumary = summaries[0];
      if (!todaySumary) {
        console.error('Today summary not found in summaries list');
        return
      };

      this.store.dispatch(new SummaryDaySelected(todaySumary.nutritionDay));
    });
  }

  dateChanged(date: Date | null, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = date;
      this.endDate = null;
    } else {
      this.endDate = date;
    }

    if (this.startDate && this.endDate) {
      this.store.dispatch(new FetchNutritionSummaries(this.startDate, this.endDate))
    }
  }
}

