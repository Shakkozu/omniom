import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { NutritionistRestService } from "../nutritionist-rest.service";
import { FetchNutritionistProfile, RegisterNutritionist, RegisterNutritionistSuccess } from "./nutritionist.actions";
import { _countGroupLabelsBeforeOption } from "@angular/material/core";
import { Router } from "@angular/router";

export interface NutritionistStateModel {
    profile: NutritionistProfile | undefined;
    profileExists: boolean;
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
        profileExists: false
    }
})
@Injectable()
export class NutritionistStore {
    constructor(private nutritionistService: NutritionistRestService,
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


