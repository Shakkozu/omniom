import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionistRoutingModule } from './nutritionist-routing.module';
import { MaterialModule } from '../material.module';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsAndConditionsDialogComponent } from './pages/registration-page/terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { NutritionistProfilePageComponent } from './pages/nutritionist-profile-page/nutritionist-profile-page.component';
import { NgxsModule } from '@ngxs/store';
import { NutritionistStore } from './store/nutritionist.store';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { PendingVerificationRequestsComponent } from './components/pending-verification-requests/pending-verification-requests.component';
import { AdminVerificationPage } from './pages/admin-verification-page/admin-verification-page.component';
import { VerificationRequestDetailsComponent } from './components/verification-request-details/verification-request-details.component';
import { RejectVerificationRequestDialogComponent } from './components/reject-verification-request-dialog/reject-verification-request-dialog.component';
import { CreateVerificationRequestComponent } from './components/create-verification-request/create-verification-request.component';
import { MealPlanConfiguratorComponent } from './components/meal-plan-configurator/meal-plan-configurator.component';
import { MealPlansListComponent } from './components/meal-plans-list/meal-plans-list.component';
import { MealPlanConfigurationStore } from './store/meal-plan-configuration.store';
import { SelectDishDialogComponent } from './components/select-dish-dialog/select-dish-dialog.component';
import { DishesConfigurationModule } from '../dish-configuration/dish-configuration.module';
import { ActiveCollaborationsListComponent } from '../nutritionist-collaboration/active-collaborations-list/active-collaborations-list.component';


@NgModule({
  declarations: [
    RegistrationPageComponent,
    TermsAndConditionsDialogComponent,
    NutritionistProfilePageComponent,
    ProfileDetailsComponent,
    PendingVerificationRequestsComponent,
    AdminVerificationPage,
    VerificationRequestDetailsComponent,
    RejectVerificationRequestDialogComponent,
    CreateVerificationRequestComponent,
    MealPlanConfiguratorComponent,
    MealPlansListComponent,
    SelectDishDialogComponent
  ],
  imports: [
    NgxsModule.forFeature([
      NutritionistStore,
      MealPlanConfigurationStore
    ]),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NutritionistRoutingModule,
    DishesConfigurationModule,
    ActiveCollaborationsListComponent
  ]
})
export class NutritionistModule { }
