import { Component, OnInit } from '@angular/core';
import { UserProfileStore } from '../../store/user-profile.store';
import { Store } from '@ngxs/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { UpdateNutritionTargetsConfiguration } from '../../store/user-profile.actions';
import { NutritionTargetsConfiguration } from '../../model';

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
              <input matInput type="number" placeholder="Kcal" formControlName="calories">
              <span matTextSuffix="">Kcal</span>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Białko g</mat-label>
              <input matInput type="number" formControlName="proteinsGrams">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Białko %</mat-label>
              <input matInput type="number" formControlName="proteinsPercents">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-1 col-span-1">
            <mat-form-field class="w-full">
              <mat-label>Węglowodany g</mat-label>
              <input matInput type="number" formControlName="carbohydratesGrams">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Węglowodany %</mat-label>
              <input matInput type="number" formControlName="carbohydratesPercents">
              <label matTextSuffix>%</label>
            </mat-form-field>
          </div>
          <div class="col-start-1 col-span-1">
            <mat-form-field class="w-full">
              <mat-label>Tłuszcze g</mat-label>
              <input matInput type="number" formControlName="fatsGrams">
              <label matTextSuffix>g</label>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field class="w-full">
              <mat-label>Tłuszcze %</mat-label>
              <input matInput type="number" formControlName="fatsPercents">
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
    const proteinsPercent = +this.getFormControl('proteinsPercents').value || 0;
    const carbohydratesPercent = +this.getFormControl('carbohydratesPercents').value || 0;
    const fatsPercent = +this.getFormControl('fatsPercents').value || 0;

    return proteinsPercent + carbohydratesPercent + fatsPercent;
  }

  private initializeForm() {
    const nutritionTargets = this.store.selectSnapshot(UserProfileStore.nutritionTargets);
    this.initliazeFormDefaultValues(nutritionTargets);
    this.initializeFormValueChangesActions();
  }

  private initializeFormValueChangesActions() {
    const totalKcal = this.form.controls['calories'].value;
    this.form.controls['proteinsPercents'].valueChanges.subscribe(value => {
      const grams = ((value / 100) * totalKcal / 4);
      this.form.controls['proteinsGrams'].setValue(this.decimalPipe.transform(grams, '1.0-0'), { emitEvent: false });
    });
    this.form.controls['proteinsGrams'].valueChanges.subscribe(value => {
      const percent = ((value * 4 / totalKcal) * 100);
      this.form.controls['proteinsPercents'].setValue(this.decimalPipe.transform(percent, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['carbohydratesPercents'].valueChanges.subscribe(value => {
      const grams = ((value / 100) * totalKcal / 4);
      this.form.controls['carbohydratesGrams'].setValue(this.decimalPipe.transform(grams, '1.0-0'), { emitEvent: false });
    });
    this.form.controls['carbohydratesGrams'].valueChanges.subscribe(value => {
      const percent = ((value * 4 / totalKcal) * 100);
      this.form.controls['carbohydratesPercents'].setValue(this.decimalPipe.transform(percent, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['fatsPercents'].valueChanges.subscribe(value => {
      const grams = ((value / 100) * totalKcal / 9);
      this.form.controls['fatsGrams'].setValue(this.decimalPipe.transform(grams, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['fatsGrams'].valueChanges.subscribe(value => {
      const percent = ((value * 9 / totalKcal) * 100);
      this.form.controls['fatsPercents'].setValue(this.decimalPipe.transform(percent, '1.0-0'), { emitEvent: false });
    });

    this.form.controls['calories'].valueChanges.subscribe(value => {
      const proteinsPercent = this.form.controls['proteinsPercents'].value;
      const proteinsGrams = ((proteinsPercent / 100) * value / 4);
      this.form.controls['proteinsGrams'].setValue(this.decimalPipe.transform(proteinsGrams, '1.0-0'), { emitEvent: false });

      const carbohydratesPercent = this.form.controls['carbohydratesPercents'].value;
      const carbohydratesGrams = ((carbohydratesPercent / 100) * value / 4);
      this.form.controls['carbohydratesGrams'].setValue(this.decimalPipe.transform(carbohydratesGrams, '1.0-0'), { emitEvent: false });

      const fatsPercent = this.form.controls['fatsPercents'].value;
      const fatsGrams = ((fatsPercent / 100) * value / 9);
      this.form.controls['fatsGrams'].setValue(this.decimalPipe.transform(fatsGrams, '1.0-0'), { emitEvent: false });
    });
  }

  private initliazeFormDefaultValues(nutritionTargets: NutritionTargetsConfiguration | null) {
    const totalKcal = nutritionTargets?.calories ?? 2500;
    const proteinsPercent = nutritionTargets?.proteinsPercents ?? 25;
    const proteinsG = nutritionTargets?.proteinsGrams ?? 0;
    const carbohydratesG = nutritionTargets?.carbohydratesGrams ?? 0;
    const carbohydratesPercent = nutritionTargets?.carbohydratesPercents ?? 60;
    const fatsG = nutritionTargets?.fatsGrams ?? 0;
    const fatsPercent = nutritionTargets?.fatsPercents ?? 15;
      
    this.form = new FormGroup({
      calories: new FormControl(totalKcal, [Validators.required]),
      proteinsPercents: new FormControl(proteinsPercent, [Validators.required]),
      proteinsGrams: new FormControl(proteinsG, [Validators.required]),
      carbohydratesGrams: new FormControl(carbohydratesG, [Validators.required]),
      carbohydratesPercents: new FormControl(carbohydratesPercent, [Validators.required]),
      fatsGrams: new FormControl(fatsG, [Validators.required]),
      fatsPercents: new FormControl(fatsPercent, [Validators.required]),
    });
  }

  onSaveButtonClicked() {
    if (!this.isFormValid)
      return;

    const formValue = this.form.value;
    this.store.dispatch(new UpdateNutritionTargetsConfiguration(formValue));
    this.initliazeFormDefaultValues(formValue);
    this.initializeFormValueChangesActions();
  }
}