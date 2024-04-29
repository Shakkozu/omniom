using System.Net.Http.Json;

namespace Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;

public static class NutritionistRoutes
{
    public const string RegisterNutritionist = "/api/nutritionist/register";

    public const string PendingVerificationRequests = "/api/nutritionist/pending-verification-requests";

    public const string UserVerificationRequest = "/api/nutritionist/{{userId}}/verification-requests";
}
