import { Component } from '@angular/core';
import { UserProfileStore } from '../../store/user-profile.store';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-nutrition-targets-configuration',
  template: `<div class="dashboard-card">
    <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
    <mat-card>
      <mat-card-header class="bg-slate-200">
        <mat-card-title class="p-4">
          Konfiguracja celów dietetycznych
        </mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-4 mx-4">
        <div *ngIf="!(loading$ | async)" class="grid grid-cols-2 gap-4 auto-rows-max hover:auto-rows-min">
          <div class="col-span-2">
            <mat-form-field class="w-full">
              <mat-label>Zapotrzebowanie kaloryczne</mat-label>
              <input matInput type="number" placeholder="Kcal" [(ngModel)]="viewModel.kcal">
              <span matTextSuffix="">Kcal</span>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Białko g</mat-label>
              <input matInput type="number" [(ngModel)]="viewModel.proteinsG">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Białko %</mat-label>
              <input matInput type="number" [(ngModel)]="viewModel.proteinsPercent">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-1 col-span-1">
            <mat-form-field class="w-full">
              <mat-label>Węglowodany g</mat-label>
              <input matInput type="number" [(ngModel)]="viewModel.carbohydratesG">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Węglowodany %</mat-label>
              <input matInput type="number" [(ngModel)]="viewModel.carbohydratesPercent">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-1 col-span-1">
            <mat-form-field class="w-full">
              <mat-label>Tłuszcze g</mat-label>
              <input matInput type="number" [(ngModel)]="viewModel.fatsG">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Tłuszcze %</mat-label>
              <input matInput type="number" [(ngModel)]="viewModel.fatsPercent">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-2">
            <mat-form-field class="w-full">
              <mat-label>Łącznie %</mat-label>
              <input readonly matInput type="number" [(ngModel)]="viewModel.totalPercents">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
        </div>
        <mat-error class="my-4 text-lg">Suma % makroskładników musi wynosić 100%</mat-error>
        <div class="row mt-8 pe-4 flex flex-row-reverse">
          <button [disabled]="loading$ | async" (click)="onSaveButtonClicked()" mat-raised-button color="primary">Zapisz</button>
        </div>
      </mat-card-content>
    </mat-card>
  </div>`,
  styleUrl: './nutrition-targets-configuration.component.scss'
})
export class NutritionTargetsConfigurationComponent {
  public loading$ = this.store.select(UserProfileStore.loading);
  public viewModel: any = {
    kcal : 0,
    proteinsPercent : 0,
    proteinsG : 0,
    carbohydratesG : 0,
    carbohydratesPercent : 0,
    fatsG : 0,
    fatsPercent : 0,
    totalPercents : 100,
  };

  
  constructor(private store: Store) { }
  
  onSaveButtonClicked() {
  }
}
