import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { NutritionistStore } from '../../store/nutritionist.store';
import { tap } from 'rxjs';

@Component({
  selector: 'app-profile-details',
  template: `<mat-card class="profile-card" *ngIf="profile$ | async as profile">
			<mat-card-header>
				<mat-card-title>Profil dietetyka</mat-card-title>
				<mat-card-subtitle>
          <span>{{ profile.name }} {{ profile.surname }} <mat-icon *ngIf="profile.verificationStatus === 'Approved'" color="primary" class="text-body-large pt-1">verified</mat-icon></span>
          </mat-card-subtitle>
			</mat-card-header>
			<mat-card-content class="mt-4">
        <p class="text-body-medium">{{ profile.email }}</p>
				<p class="text-body-medium">Miasto: <span class="text-body-medium">{{ profile.city }}</span></p>
			</mat-card-content>
		</mat-card>`,
})
export class ProfileDetailsComponent {
  public profile$ = this.store.select(NutritionistStore.profileDetails);

  constructor (private store: Store) { }

}
