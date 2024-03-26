import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DaySummary } from '../../model';
import { Store } from '@ngxs/store';
import { FetchNutritionSummaries } from '../../store/nutrition-diary.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-diary-day-selector',
  templateUrl: './diary-day-selector.component.html',
  styleUrl: './diary-day-selector.component.scss'
})
export class DiaryDaySelectorComponent implements OnInit {
  public summariesFromRange$: Observable<DaySummary[]> = this.store.select(state => state.nutritionDiary.daySummaries);
  public isLoading$: Observable<boolean> = this.store.select(state => state.nutritionDiary.loading);
  public selectedDayId: string = '';
  private defaultDaysHistoryLoaded = 40;
  public startDate: Date | null;
  public endDate: Date | null;
  
  constructor (private store: Store) {
    this.startDate = new Date(new Date().setDate(new Date().getDate() - this.defaultDaysHistoryLoaded));
    this.endDate = new Date();
    this.store.dispatch(new FetchNutritionSummaries(this.startDate, this.endDate))
    .subscribe(() => {
    });
  }
  
  onSummarySelected($event: DaySummary) {
    this.selectedDayId = $event.guid;
  }

  public ngOnInit(): void {
    this.summariesFromRange$ = this.store.select(state => state.nutritionDiary.daySummaries);
    this.isLoading$ = this.store.select(state => state.nutritionDiary.loading);
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

