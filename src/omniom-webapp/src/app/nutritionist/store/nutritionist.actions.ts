import { PendingVerificationListItem, VerificationRequestDetails } from "../nutritionist-administration-rest.service"
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

export class FetchPendingVerificationRequests {
    static readonly type = '[Nutritionist] Fetch pending verification requests'
}

export class FetchPendingVerificationRequestsSuccess {
    static readonly type = '[Nutritionist] Fetch pending verification requests success'

    constructor (public requests: PendingVerificationListItem[]) {
    }
}

export class FetchPendingVerificationRequestsFailure {
    static readonly type = '[Nutritionist] Fetch pending verification requests failure'
}


export class ProcessVerificationRequest {
    static readonly type = '[Nutritionist] Process verification request'

    constructor(public requestId: string) {
    }
}

export class ProcessVerificationRequestSuccess {
    static readonly type = '[Nutritionist] Process verification request success'
}

export class ProcessVerificationRequestFailure {
    static readonly type = '[Nutritionist] Process verification request failure'
}

export class FetchVerificationRequestDetails {
    static readonly type = '[Nutritionist] Fetch verification request details'

    constructor(public requestId: string) {
    }
}

export class FetchVerificationRequestDetailsSuccess {
    static readonly type = '[Nutritionist] Fetch verification request details success'
    constructor (public requestDetails: VerificationRequestDetails) {
    }
}

export class FetchVerificationRequestDetailsFailure {
    static readonly type = '[Nutritionist] Fetch verification request details failure'
}




