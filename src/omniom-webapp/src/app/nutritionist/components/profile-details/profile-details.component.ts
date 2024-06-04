import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { NutritionistStore } from '../../store/nutritionist.store';
import { MatDialog } from '@angular/material/dialog';
import { CreateVerificationRequestComponent } from '../create-verification-request/create-verification-request.component';

@Component({
	selector: 'app-profile-details',
	template: `<mat-card class="profile-card" *ngIf="profile$ | async as profile">
			<mat-card-header>
				<mat-card-title>Profil dietetyka</mat-card-title>
				<mat-card-subtitle>
          <span>{{ profile.name }} {{ profile.surname }} <mat-icon *ngIf="profileVerified$ | async" color="primary" class="text-body-large pt-1">verified</mat-icon></span>
		  <div class="mt-4" *ngIf="!(hasActiveVerificationRequest$ | async)">
		<button mat-raised-button color="primary" (click)="verifyProfile()">Złóż wniosek o weryfikację</button>
	</div>
		</mat-card-subtitle>
	</mat-card-header>
	<mat-card-content class="mt-4">
		<div *ngIf="hasPendingVerificationRequest$ | async">
			<p class="text-body-medium">Weryfikacja kwalifikacji: Oczekuje na rozpatrzenie</p>
		</div>
		<div class="p-4 bg-red-200 rounded-xl shadow-lg w-96 mb-4" *ngIf="hasRejectedVerificationRequest$ | async">
			<p class="text-body-large">Weryfikacja kwalifikacji: <span class="font-bold">Odrzucony</span></p>
			<p class="text-body-medium">Powód: {{(verificationState$ | async)?.message}}</p>
		</div>
		<p class="text-body-medium">{{ profile.email }}</p>
		<p class="text-body-medium">Miasto: <span class="text-body-medium">{{ profile.city }}</span></p>
	</mat-card-content>
	</mat-card>
`,
})
export class ProfileDetailsComponent {
	public profile$ = this.store.select(NutritionistStore.profileDetails);
	public profileVerified$ = this.store.select(NutritionistStore.isVerified);
	public hasActiveVerificationRequest$ = this.store.select(NutritionistStore.hasActiveVerificationRequest);
	public hasPendingVerificationRequest$ = this.store.select(NutritionistStore.hasPendingVerificationRequest);
	public hasRejectedVerificationRequest$ = this.store.select(NutritionistStore.hasRejectedVerificationRequest);
	public verificationState$ = this.store.select(NutritionistStore.verificationState);

	constructor (private store: Store,
		private matDialog: MatDialog
	) { }

	verifyProfile() {
		this.matDialog.open(CreateVerificationRequestComponent, {
			width: '600px',
			height: '500px'
		});
	}
}
