using System.Net.Http.Json;

namespace Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;

public static class NutritionistRoutes
{
    public const string RegisterNutritionist = "/api/nutritionist/register";

    public const string PendingVerificationRequests = "/api/nutritionist/pending-verification-requests";

    public const string UserVerificationRequestDetails = "/api/nutritionist/{userId}/verification-requests";

    public const string ProfileInformationDetails = "/api/nutritionist/profile-details";

    public const string VerifyPendingQualificationsConfirmationRequest = "/api/nutritionist/{userId}/verify-qualifications";

    public const string GetAttachmentDetails = "/api/nutritionist/pending-verification-requests/{requestId}/attachments/{attachmentId}";
}