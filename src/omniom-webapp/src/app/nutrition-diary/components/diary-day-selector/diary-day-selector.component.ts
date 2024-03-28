import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DaySummary } from '../../model';
import { Store } from '@ngxs/store';
import { FetchNutritionSummaries } from '../../store/nutrition-diary.actions';
import { Observable } from 'rxjs';
import { NutritionDiaryStore } from '../../store/nutrition-diary.store';

@Component({
  selector: 'app-diary-day-selector',
  templateUrl: './diary-day-selector.component.html',
  styleUrl: './diary-day-selector.component.scss'
})
export class DiaryDaySelectorComponent implements OnInit {
  public summariesFromRange$: Observable<DaySummary[]> = this.store.select(NutritionDiaryStore.daySummaries);
  public isLoading$: Observable<boolean> = this.store.select(state => state.nutritionDiary.loading);
  public selectedDayId$: Observable<DaySummary | null>;

  public startDate: Date | null;
  public endDate: Date | null;
  private defaultDaysHistoryLoaded = 40;
  
  constructor (private store: Store) {
    this.startDate = new Date(new Date().setDate(new Date().getDate() - this.defaultDaysHistoryLoaded));
    this.endDate = new Date();
    this.store.dispatch(new FetchNutritionSummaries(this.startDate, this.endDate));
    this.selectedDayId$ = this.store.select(NutritionDiaryStore.selectedSummary);
  }

  public ngOnInit(): void {
    this.summariesFromRange$ = this.store.select(state => state.nutritionDiary.daySummaries);
    this.isLoading$ = this.store.select(NutritionDiaryStore.loading);
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

