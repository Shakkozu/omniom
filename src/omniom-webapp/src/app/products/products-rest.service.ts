import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogueItemDto } from './model';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProductsRestService {

	constructor (private http: HttpClient) { }

	getProducts(search: string, pageSize: number = 40, page: number = 1): Observable<SearchProductsResponse> {
		const url = `${environment.apiUrl}/api/products?search=${search}&pageSize=${pageSize}&page=${page}`;
		return this.http.get<SearchProductsResponse>(url);
	}
}

export interface SearchProductsResponse {
	products: CatalogueItemDto[];
	page: number;
	pageSize: number;
	totalCount: number;
}