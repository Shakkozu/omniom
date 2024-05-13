using Omniom.Domain.Nutritionist.FetchingProfileDetails;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Nutritionist.Verification.CreatingVerificationRequests;
using Omniom.Domain.Nutritionist.Verification.FetchingPendingVerificationRequests;
using Omniom.Domain.Nutritionist.Verification.FetchingUserVerificationRequestDetails;
using Omniom.Domain.Nutritionist.Verification.VerifyingPendingRequests;
using System.Net.Http.Json;

namespace Omniom.Tests.Nutritionist;

public static class NutritionistRestClient
{
    public static async Task RegisterNutritionistAsync(this HttpClient httpClient, RegisterNutritionistRequest request)
    {
        var content = JsonContent.Create(request);
        var response = await httpClient.PostAsync(NutritionistRoutes.RegisterNutritionist, content);
        response.EnsureSuccessStatusCode();
    }

    public static async Task CreateVerificationRequestAsync(this HttpClient httpClient, CreateVerificationRequest request)
    {
        var content = JsonContent.Create(request);
        var response = await httpClient.PostAsync(NutritionistRoutes.CreateVerificationRequest, content);
        response.EnsureSuccessStatusCode();
    }

    public static async Task<HttpResponseMessage> RejectVerificationRequestAsync(this HttpClient httpClient, Guid userId, string rejectionReason)
    {
        var request = new VerifyRequest(VerificationStatus.Rejected.ToString(), rejectionReason);
        var content = JsonContent.Create(request);
        return await httpClient.PostAsync(NutritionistRoutes.VerifyPendingQualificationsConfirmationRequest.Replace("{userId}", userId.ToString()), content);
    }

    public static async Task<HttpResponseMessage> ApproveVerificationRequestAsync(this HttpClient httpClient, Guid userId, string? message = null)
    {
        var request = new VerifyRequest(VerificationStatus.Approved.ToString(), message);
        var content = JsonContent.Create(request);
        return await httpClient.PostAsync(NutritionistRoutes.VerifyPendingQualificationsConfirmationRequest.Replace("{userId}", userId.ToString()), content);
    }

    public static async Task<HttpResponseMessage> GetPendingVerificationRequestsHttpResponseAsync(this HttpClient httpClient)
    {
        return await httpClient.GetAsync(NutritionistRoutes.PendingVerificationRequests);
    }

    public static async Task<List<PendingVerificationListItem>> GetPendingVerificationRequestsAsync(this HttpClient httpClient)
    {
        var response = await httpClient.GetAsync(NutritionistRoutes.PendingVerificationRequests);
        return await response.Content.ReadFromJsonAsync<List<PendingVerificationListItem>>() ?? throw new InvalidOperationException("Fetching pending verificatino requests failed with error");
    }

    public static async Task<UserVerificationRequestDetails> GetUserVerificationRequestDetails(this HttpClient httpClient, Guid userId)
    {
        var response = await httpClient.GetAsync(NutritionistRoutes.UserVerificationRequestDetails.Replace("{userId}", userId.ToString()));
        return await response.Content.ReadFromJsonAsync<UserVerificationRequestDetails>() ?? throw new InvalidOperationException("Fetching user {userId} verification request details returned an error");
    }

    public static async Task<GetProfileDetailsResponse> GetProfileInformation(this HttpClient httpClient)
    {
        var response = await httpClient.GetAsync(NutritionistRoutes.ProfileInformationDetails);
        return await response.Content.ReadFromJsonAsync<GetProfileDetailsResponse>() ?? throw new InvalidOperationException("Fetching user {userId} verification request details returned an error");
    }
}