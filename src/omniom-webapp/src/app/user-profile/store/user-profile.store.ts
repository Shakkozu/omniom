import { Injectable } from "@angular/core";
import { State } from "@ngxs/store";

export interface UserProfileStateModel {

}

@State<UserProfileStateModel>({
	name: 'userProfile',
	defaults: {
	}
})
@Injectable()
export class UserProfileStore {
	constructor () { 
		
	}
}