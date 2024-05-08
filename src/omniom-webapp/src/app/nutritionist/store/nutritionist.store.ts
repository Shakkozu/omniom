import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { NutritionistRestService } from "../nutritionist-rest.service";
import { FetchNutritionistProfile, RegisterNutritionist, RegisterNutritionistSuccess, FetchVerificationRequestDetails, FetchVerificationRequestDetailsFailure, FetchVerificationRequestDetailsSuccess, FetchPendingVerificationRequests, FetchPendingVerificationRequestsFailure, FetchPendingVerificationRequestsSuccess } from "./nutritionist.actions";
import { _countGroupLabelsBeforeOption } from "@angular/material/core";
import { Router } from "@angular/router";
import { NutritionistAdministrationRestService, PendingVerificationListItem, VerificationRequestDetails } from "../nutritionist-administration-rest.service";

export interface NutritionistStateModel {
    profile: NutritionistProfile | undefined;
    profileExists: boolean;
    pendingVerificationRequests: PendingVerificationListItem[];
    selectedVerificationRequestDetails: VerificationRequestDetails | undefined;
}

export interface NutritionistProfile {
    name: string;
    surname: string;
    email: string;
    city: string;
    verificationStatus: string;
    verificationMessage: string;
}

@State<NutritionistStateModel>({
    name: 'nutritionist',
    defaults: {
        profile: undefined,
        profileExists: false,
        pendingVerificationRequests: [],
        selectedVerificationRequestDetails: undefined
    }
})
@Injectable()
export class NutritionistStore {
    constructor (private nutritionistService: NutritionistRestService,
        private adminService: NutritionistAdministrationRestService,
        private router: Router
    ) {

    }

    @Selector()
    static userIsRegisteredAsNutritionist(state: NutritionistStateModel) {
        return state.profile !== undefined;
    }
    @Selector()
    static profileDetails(state: NutritionistStateModel) {
        return state.profile;
    }

    @Selector()
    static pendingVerificationRequests(state: NutritionistStateModel) {
        return state.pendingVerificationRequests;
    }

    @Selector()
    static selectedVerificationRequestDetails(state: NutritionistStateModel) {
        return state.selectedVerificationRequestDetails;
    }

    @Action(FetchPendingVerificationRequests)
    fetchPendingVerificationRequests(ctx: StateContext<NutritionistStateModel>, action: FetchPendingVerificationRequests) {
        this.adminService.fetchPendingVerificationRequests().subscribe({
            next: requests => {
                ctx.dispatch(new FetchPendingVerificationRequestsSuccess(requests));
            },
            error: _ => {
                ctx.dispatch(new FetchPendingVerificationRequestsFailure());
            }
        });
    }

    @Action(FetchPendingVerificationRequestsSuccess)
    fetchPendingVerificationRequestsSuccess(ctx: StateContext<NutritionistStateModel>, action: FetchPendingVerificationRequestsSuccess) {
        ctx.patchState({
            pendingVerificationRequests: action.requests
        });
    }

    @Action(FetchPendingVerificationRequestsFailure)
    fetchPendingVerificationRequestsFailure(ctx: StateContext<NutritionistStateModel>, action: FetchPendingVerificationRequestsFailure) {
        ctx.patchState({
            pendingVerificationRequests: []
        });
        console.error('Failed to fetch pending verification requests');
    }
        

    @Action(FetchVerificationRequestDetails)
    fetchVerificationRequestDetails(ctx: StateContext<NutritionistStateModel>, action: FetchVerificationRequestDetails) {
        this.adminService.fetchVerificationRequestDetails(action.requestId).subscribe({
            next: requestDetails => {
                ctx.dispatch(new FetchVerificationRequestDetailsSuccess(requestDetails));
            },
            error: _ => {
                ctx.dispatch(new FetchVerificationRequestDetailsFailure());
            }
        });
    }

    @Action(FetchVerificationRequestDetailsSuccess)
    fetchVerificationRequestDetailsSuccess(ctx: StateContext<NutritionistStateModel>, action: FetchVerificationRequestDetailsSuccess) {
        ctx.patchState({
            selectedVerificationRequestDetails: action.requestDetails
        });

    }

    @Action(FetchVerificationRequestDetailsFailure)
    fetchVerificationRequestDetailsFailure(ctx: StateContext<NutritionistStateModel>, action: FetchVerificationRequestDetailsFailure) {
        ctx.patchState({
            selectedVerificationRequestDetails: undefined
        });
        console.error('Failed to fetch verification request details');

    }







    @Action(RegisterNutritionist)
    async registerNutritionist(ctx: StateContext<NutritionistStateModel>, action: RegisterNutritionist) {
        (await this.nutritionistService.registerNutritionist(action.command)).subscribe(_ => {
          });
    }

    @Action(RegisterNutritionistSuccess)
    registerNutritionistSuccess(ctx: StateContext<NutritionistStateModel>) {
        ctx.patchState({
            profileExists: true
        });
        ctx.dispatch(new FetchNutritionistProfile());
        this.router.navigate(['profile']);
    }

    @Action(FetchNutritionistProfile)
    fetchNutritionistProfile(ctx: StateContext<NutritionistStateModel>, action: FetchNutritionistProfile) {
        this.nutritionistService.fetchNutritionistProfile().subscribe({
            next: _profile => {
                    ctx.patchState({
                    profile: _profile,
                    profileExists: true,
                })
            },
            error: err => {
                if(err.status === 404){
                    ctx.patchState({
                        profileExists: false
                    })
                }
                console.error(err);
            }
        })
    }

}


