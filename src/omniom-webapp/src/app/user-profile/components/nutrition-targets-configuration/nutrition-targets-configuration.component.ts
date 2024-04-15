import { Component, OnInit } from '@angular/core';
import { UserProfileStore } from '../../store/user-profile.store';
import { Store } from '@ngxs/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { UpdateNutritionTargetsConfiguration } from '../../store/user-profile.actions';

@Component({
  selector: 'app-nutrition-targets-configuration',
  providers: [DecimalPipe],
  template: `<div class="dashboard-card">
    <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
    <mat-card>
      <mat-card-header class="bg-slate-200">
        <mat-card-title class="p-4">
          Konfiguracja celów dietetycznych
        </mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-4 mx-4">
        <form [formGroup]="form" class="grid grid-cols-2 gap-4 auto-rows-max hover:auto-rows-min">
          <div class="col-span-2">
            <mat-form-field class="w-full">
              <mat-label>Zapotrzebowanie kaloryczne</mat-label>
              <input matInput type="number" placeholder="Kcal" formControlName="totalKcal">
              <span matTextSuffix="">Kcal</span>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Białko g</mat-label>
              <input matInput type="number" formControlName="proteinsG">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Białko %</mat-label>
              <input matInput type="number" formControlName="proteinsPercent">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-1 col-span-1">
            <mat-form-field class="w-full">
              <mat-label>Węglowodany g</mat-label>
              <input matInput type="number" formControlName="carbohydratesG">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Węglowodany %</mat-label>
              <input matInput type="number" formControlName="carbohydratesPercent">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-1 col-span-1">
            <mat-form-field class="w-full">
              <mat-label>Tłuszcze g</mat-label>
              <input matInput type="number" formControlName="fatsG">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Tłuszcze %</mat-label>
              <input matInput type="number" formControlName="fatsPercent">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-2">
            <mat-form-field class="w-full">
              <mat-label>Łącznie %</mat-label>
              <input [disabled]="loading$ | async" readonly matInput type="number" [value]="getTotalPercents()">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
        </form>
        <mat-error *ngIf="formTotalPercentsHasInvalidValue" class="my-4 text-lg">Suma % makroskładników musi wynosić 100%</mat-error>
        <div class="row mt-8 pe-4 flex flex-row-reverse">
          <button [disabled]="(loading$ | async) || !isFormValid" (click)="onSaveButtonClicked()" mat-raised-button color="primary">Zapisz</button>
        </div>
      </mat-card-content>
    </mat-card>
  </div>`,
  styleUrl: './nutrition-targets-configuration.component.scss'
})
export class NutritionTargetsConfigurationComponent implements OnInit {
  public loading$ = this.store.select(UserProfileStore.loading);
  public form: FormGroup<any> = new FormGroup({});
  constructor (private store: Store, private decimalPipe: DecimalPipe) { 
    this.loading$.subscribe(loading => {
      if (loading)
        this.form.disable();
      else
        this.form.enable();
    });
  }

  ngOnInit(): void {    
    this.initializeForm();
  }

  public get isFormValid(): boolean {
    return this.form.valid && !this.formTotalPercentsHasInvalidValue;
  }

  private getFormControl(controlName: string): any {
    return this.form.get(controlName);
  }

  public get formTotalPercentsHasInvalidValue(): boolean {
    return this.getTotalPercents() !== 100;
  }

  public getTotalPercents(): number {
    const proteinsPercent = +this.getFormControl('proteinsPercent').value || 0;
    const carbohydratesPercent = +this.getFormControl('carbohydratesPercent').value || 0;
    const fatsPercent = +this.getFormControl('fatsPercent').value || 0;

    return proteinsPercent + carbohydratesPercent + fatsPercent;
  }

  private initializeForm() {
    this.initliazeFormDefaultValues();
    this.initializeFormValueChangesActions();
    this.form.controls['totalKcal'].setValue(2500);
  }

  private initializeFormValueChangesActions() {
    const totalKcal = this.form.controls['totalKcal'].value;
    this.form.controls['proteinsPercent'].valueChanges.subscribe(value => {
      const grams = ((value / 100) * totalKcal / 4);
      this.form.controls['proteinsG'].setValue(this.decimalPipe.transform(grams, '1.0-0'), { emitEvent: false });
    });
    this.form.controls['proteinsG'].valueChanges.subscribe(value => {
      const percent = ((value * 4 / totalKcal) * 100);
      this.form.controls['proteinsPercent'].setValue(this.decimalPipe.transform(percent, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['carbohydratesPercent'].valueChanges.subscribe(value => {
      const grams = ((value / 100) * totalKcal / 4);
      this.form.controls['carbohydratesG'].setValue(this.decimalPipe.transform(grams, '1.0-0'), { emitEvent: false });
    });
    this.form.controls['carbohydratesG'].valueChanges.subscribe(value => {
      const percent = ((value * 4 / totalKcal) * 100);
      this.form.controls['carbohydratesPercent'].setValue(this.decimalPipe.transform(percent, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['fatsPercent'].valueChanges.subscribe(value => {
      const grams = ((value / 100) * totalKcal / 9);
      this.form.controls['fatsG'].setValue(this.decimalPipe.transform(grams, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['fatsG'].valueChanges.subscribe(value => {
      const percent = ((value * 9 / totalKcal) * 100);
      this.form.controls['fatsPercent'].setValue(this.decimalPipe.transform(percent, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['totalKcal'].valueChanges.subscribe(value => {
      const proteinsPercent = this.form.controls['proteinsPercent'].value;
      const proteinsGrams = ((proteinsPercent / 100) * value / 4);
      this.form.controls['proteinsG'].setValue(this.decimalPipe.transform(proteinsGrams, '1.0-0'), { emitEvent: false });

      const carbohydratesPercent = this.form.controls['carbohydratesPercent'].value;
      const carbohydratesGrams = ((carbohydratesPercent / 100) * value / 4);
      this.form.controls['carbohydratesG'].setValue(this.decimalPipe.transform(carbohydratesGrams, '1.0-0'), { emitEvent: false });

      const fatsPercent = this.form.controls['fatsPercent'].value;
      const fatsGrams = ((fatsPercent / 100) * value / 9);
      this.form.controls['fatsG'].setValue(this.decimalPipe.transform(fatsGrams, '1.0-0'), { emitEvent: false });
    });
  }

  private initliazeFormDefaultValues() {
    const nutritionTargets = this.store.selectSnapshot(UserProfileStore.nutritionTargets);
    const totalKcal = nutritionTargets?.totalKcal || 2500;
    const proteinsPercent = nutritionTargets?.proteinsPercent || 25;
    const proteinsG = nutritionTargets?.proteinsG || 0;
    const carbohydratesG = nutritionTargets?.carbohydratesG || 0;
    const carbohydratesPercent = nutritionTargets?.carbohydratesPercent || 60;
    const fatsG = nutritionTargets?.fatsG || 0;
    const fatsPercent = nutritionTargets?.fatsPercent || 15;
      
    this.form = new FormGroup({
      totalKcal: new FormControl(totalKcal, [Validators.required]),
      proteinsPercent: new FormControl(proteinsPercent, [Validators.required]),
      proteinsG: new FormControl(proteinsG, [Validators.required]),
      carbohydratesG: new FormControl(carbohydratesG, [Validators.required]),
      carbohydratesPercent: new FormControl(carbohydratesPercent, [Validators.required]),
      fatsG: new FormControl(fatsG, [Validators.required]),
      fatsPercent: new FormControl(fatsPercent, [Validators.required]),
    });
  }

  onSaveButtonClicked() {
    if (!this.isFormValid)
      return;

    this.store.dispatch(new UpdateNutritionTargetsConfiguration(this.form.value));
  }
}