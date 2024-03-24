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
  public daySummaries: DaySummary[] = [];
  public selectedDayId: string = '';
  public selectedElement: string = '';
  public isLoading = true;
  private showDays = 40;
  private loadingTimeInMsMock = 200;
  @Output() daySelected: EventEmitter<string> = new EventEmitter<string>();
  public startDate: Date | null;
  public endDate: Date | null;
  public summary$: Observable<DaySummary[]> = this.store.select(state => state.nutritionDiary.daySummaries);
  public isLoading$: Observable<boolean> = this.store.select(state => state.nutritionDiary.loading);

  constructor (private store: Store) {
    this.startDate = new Date(new Date().setDate(new Date().getDate() - this.showDays));
    this.endDate = new Date();
    this.store.dispatch(new FetchNutritionSummaries(this.startDate, this.endDate))
      .subscribe(() => {
      });
  }

  public ngOnInit(): void {
    this.summary$ = this.store.select(state => state.nutritionDiary.daySummaries);
    this.isLoading$ = this.store.select(state => state.nutritionDiary.loading);
  }

  selectElement(element: string): void {
    this.selectedElement = element;
    this.daySelected.emit(element);
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

  selectDate(date: any): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, this.loadingTimeInMsMock)
  }

  public meals: any[] = [];
  selectedRange: any;


  public summarySelected(summary: DaySummary): void {
    this.selectedDayId = summary.guid;
    this.daySelected.emit(summary.guid);
  }
}

