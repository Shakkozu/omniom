import { RegisterNutritionistCommand } from "../nutritionist-rest.service"

export class RegisterNutritionist {
    static readonly type = '[Nutritionist] Register'

    constructor(public command: RegisterNutritionistCommand) {
    }
}

export class RegisterNutritionistSuccess {
    static readonly type = '[Nutritionist] Register success'
}

export class FetchNutritionistProfile {
    static readonly type = '[Nutritionist] Fetch nutritionist profile'
}

export class FetchNutritionistProfileSuccess {
    static readonly type = '[Nutritionist] Fetch nutritionist profile success'

}
