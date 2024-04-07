import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DaySummaryDto, MealProductEntry, MealType, NutritionDayDetails } from './model';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class NutritionDiaryService {
	constructor(private http: HttpClient, private datePipe: DatePipe) { }
	fetchDaySummaries(startDate: Date, endDate: Date): Observable<DaySummaryDto[]> {
		const start = this.datePipe.transform(startDate, 'yyyy-MM-dd');
		const end = this.datePipe.transform(endDate, 'yyyy-MM-dd');
		const url = `${ environment.apiUrl }/api/nutrition-diary/summary?dateFrom=${ start }&dateTo=${ end }`;
		return this.http.get<DaySummaryDto[]>(url);
	}
	
	removeNutritionEntry(entryId: string): Observable<void> {
		const url = `${ environment.apiUrl }/api/nutrition-diary/entries/${entryId}`;
		return this.http.delete<void>(url);
	}

	fetchDayDetails(nutritionDay: Date): Observable<NutritionDayDetails[]> {
		const url = `${ environment.apiUrl }/api/nutrition-diary/details?nutritionDay=${ this.datePipe.transform(nutritionDay, 'yyyy-MM-dd') }`;
		return this.http.get<NutritionDayDetails[]>(url);
	}

	addNutritionEntries(products: MealProductEntry[], mealType: MealType, selectedDay: Date): Observable<void> {
		const url = `${ environment.apiUrl }/api/nutrition-diary/entries`;
		return this.http.post<void>(url, {
			products: products,
			mealType: mealType,
			selectedDay: selectedDay
		});
	}
}