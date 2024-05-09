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


export class RejectVerificationRequest {
    static readonly type = '[Nutritionist] Reject verification request'

    constructor(public requestId: string, public rejectionReason: string, public userId: string) {
    }
}

export class ConfirmVerificationRequest {
    static readonly type = '[Nutritionist] Confirm verification request'

    constructor(public userId: string) {
    }

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




