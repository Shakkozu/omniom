import { Component, EventEmitter, Output } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { DaySummary } from '../../model';

@Component({
  selector: 'app-diary-day-selector',
  templateUrl: './diary-day-selector.component.html',
  styleUrl: './diary-day-selector.component.scss'
})
export class DiaryDaySelectorComponent {
  public daySummaries: DaySummary[] = [];
  public selectedDayId: string = '';
  public selectedElement: string = '';
  public isLoading = true;
  private showDays = 40;
  private loadingTimeInMsMock = 200;
  @Output() daySelected: EventEmitter<string> = new EventEmitter<string>();
  public startDate: Date | null;
  public endDate: Date | null;

  constructor () {
    this.startDate = new Date();
    this.endDate = new Date(new Date().setDate(new Date().getDate() - this.showDays));
    setTimeout(() => {
      this.isLoading = false;
    }, this.loadingTimeInMsMock);

    for (let i = 0; i < 50; i++) {
      this.daySummaries.push({
        guid: uuidv4(),
        date: new Date(new Date().setDate(new Date().getDate() + i)),
        totalCalories: Math.floor(Math.random() * 1000),
        totalProtein: Math.floor(Math.random() * 100),
        totalCarbs: Math.floor(Math.random() * 100),
        totalFat: Math.floor(Math.random() * 100),
      });
      this.summarySelected(this.getDaySummaries()[0]);
    }
  }

  selectElement(element: string): void {
    this.selectedElement = element;
    this.daySelected.emit(element);
  }

  public getDaySummaries(): DaySummary[] {
    return this.daySummaries.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  dateChanged(date: Date | null, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = date;
      this.endDate = null;
    } else {
      this.endDate = date;
    }

    if (this.startDate && this.endDate) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, this.loadingTimeInMsMock)
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

