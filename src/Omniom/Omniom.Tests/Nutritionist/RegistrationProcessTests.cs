using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Nutritionist.CleaningModule;
using Omniom.Domain.Nutritionist.FetchingPendingVerificationRequests;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Nutritionist;

[TestFixture]
public class RegistrationProcessTests : BaseIntegrationTestsFixture
{
    [Test]
    public async Task AdministratorShouldSeeAllPendingNutritionistRegistrationRequests()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        var registerNutritionistRequest = new RegisterNutritionistRequest
        {
            Name = "John",
            Surname = "Doe",
            City = "Warsaw",
            TermsAndConditionsAccepted = true,
            Email = "test@example.com",
            Attachments =
            [
                new Attachment("file1.pdf", "data:application/pdf;base64," + new String('A', 3 * 1024 * 1024))
            ]
        };
        await userClient.RegisterNutritionistAsync(registerNutritionistRequest);

        var response = await adminClient.GetPendingVerificationRequestsAsync();

        PendingVerificationListItem pendingVerificationListItem = response.Single();
        Assert.That(response.Count, Is.EqualTo(1));
        Assert.That(pendingVerificationListItem.Name, Is.EqualTo("John"));
        Assert.That(pendingVerificationListItem.Surname, Is.EqualTo("Doe"));
        Assert.That(pendingVerificationListItem.Email, Is.EqualTo(registerNutritionistRequest.Email));

        await _omniomApp.Services.GetRequiredService<ICommandHandler<CleanupNutritionistModuleCommand>>().HandleAsync(new CleanupNutritionistModuleCommand(), default);
    }

    [Test]
    public async Task RegistrationWithoutAttachingQualificationsConfirmationsDoesNotApplyForVerificationProcess()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        var registerNutritionistRequest = new RegisterNutritionistRequest
        {
            Name = "John",
            Surname = "Doe",
            City = "Warsaw",
            Email = "test@example.com",
            TermsAndConditionsAccepted = true,
            Attachments = []
        };
        await userClient.RegisterNutritionistAsync(registerNutritionistRequest);

        var response = await adminClient.GetPendingVerificationRequestsAsync();

        Assert.That(response.Count, Is.EqualTo(0));
    }



    [Test]
    public async Task ShouldNotRegisterNutritionistWithoutAcceptingTermsAndConditions()
    {
        Assert.Fail();
    }



    [Test]
    public async Task UserCannotRequestVerificationWhenHasActiveRequest()
    {
        Assert.Fail();
    }

    [Test]
    public async Task NotAdministratorShouldNotBeAbleToSeePendingNutritionistRegistrationRequests()
    {
        Assert.Fail();
    }

    [Test]
    public async Task ShouldReturnInformationThatNutritionistVerificationIsInProgressAfterRegisteringWithDocumentsConfirmingQualifications()
    {
        Assert.Fail();
    }

    [Test]
    public async Task NutritionistShouldSeeInformationsWhyVerificationWasRejected()
    {
        Assert.Fail();
    }
    
    [Test]
    public async Task NutritionistShouldBeAbleToReapplyForVerificationAfterRejection()
    {
        Assert.Fail();
    }

    [Test]
    public async Task RegistrationAsNutritionistShouldShouldCreateNutritionistProfile()
    {
        Assert.Fail();
    }

    [Test]
    public async Task VerifyingNutritionistDiplomasByAdministratorShouldMarkNutritionistAsVerified()
    {
        Assert.Fail();
    }

    [Test]
    public async Task VerifiedNutritionistShouldReceiveThatInformationWhenFetchingProfileInformation()
    {
        Assert.Fail();
    }
}
