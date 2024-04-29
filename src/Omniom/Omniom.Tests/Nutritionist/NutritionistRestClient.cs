using Omniom.Domain.Nutritionist.FetchingPendingVerificationRequests;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;

namespace Omniom.Tests.Nutritionist;

public static class NutritionistRestClient
{
    public static async Task RegisterNutritionistAsync(this HttpClient httpClient, RegisterNutritionistRequest request)
    {
        var content = JsonContent.Create(request);
        var response = await httpClient.PostAsync(NutritionistRoutes.RegisterNutritionist, content);
        response.EnsureSuccessStatusCode();
    }

    public static async Task<List<PendingVerificationListItem>> GetPendingVerificationRequestsAsync(this HttpClient httpClient)
    {
        var response = await httpClient.GetAsync(NutritionistRoutes.PendingVerificationRequests);
        return await response.Content.ReadFromJsonAsync<List<PendingVerificationListItem>>() ?? throw new InvalidOperationException("Fetching pending verificatino requests failed with error");
    }

    public static async Task<List<PendingVerificationListItem>> GetUserVerificationRequest(this HttpClient httpClient, Guid userId)
    {
        var response = await httpClient.GetAsync(NutritionistRoutes.UserVerificationRequest.Replace("{{userId}}", userId.ToString()));
        return await response.Content.ReadFromJsonAsync<List<PendingVerificationListItem>>() ?? throw new InvalidOperationException("Fetching pending verificatino requests failed with error");
    }
}
