using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Nutritionist.CleaningModule;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Nutritionist.Storage;
using Omniom.Domain.Nutritionist.Verification.CreatingVerificationRequests;
using Omniom.Domain.Nutritionist.Verification.FetchingPendingVerificationRequests;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Exceptions;
using Omniom.Tests.Shared;
using System.Net;

namespace Omniom.Tests.Nutritionist;

[TestFixture]
public class RegistrationProcessTests : BaseIntegrationTestsFixture
{
    private ICommandHandler<CleanupNutritionistModuleCommand> CleanupHandler => _omniomApp.CleanupNutritionistModuleCommandHandler;
    private ICommandHandler<RegisterNutritionistCommand> RegisterNutritionistCommandHandler => _omniomApp.RegisterNutritionistCommandHandler;

    [TearDown]
    public async Task Cleanup()
    {
        await CleanupHandler.HandleAsync(new CleanupNutritionistModuleCommand(), default);
    }

    [Test]
    public async Task AdministratorShouldSeeAllPendingNutritionistRegistrationRequests()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        var registerNutritionistRequest = ARegisterNutritionistRequestWithAttachment();
        await userClient.RegisterNutritionistAsync(registerNutritionistRequest);

        var response = await adminClient.GetPendingVerificationRequestsAsync();

        PendingVerificationListItem pendingVerificationListItem = response.Single();
        Assert.That(response.Count, Is.EqualTo(1));
        Assert.That(pendingVerificationListItem.Name, Is.EqualTo("John"));
        Assert.That(pendingVerificationListItem.Surname, Is.EqualTo("Doe"));
        Assert.That(pendingVerificationListItem.Email, Is.EqualTo(registerNutritionistRequest.Email));
    }

    [Test]
    public async Task RegistrationWithoutAttachingQualificationsConfirmationsDoesNotApplyForVerificationProcess()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        var registerNutritionistRequest = ARegisterNutritionistRequestWithoutAttachment();
        await userClient.RegisterNutritionistAsync(registerNutritionistRequest);

        var response = await adminClient.GetPendingVerificationRequestsAsync();

        Assert.That(response.Count, Is.EqualTo(0));
    }

    [Test]
    public async Task ShouldReturnUserVerificationRequestDetails()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        var registerNutritionistRequest = ARegisterNutritionistRequestWithAttachment();
        await userClient.RegisterNutritionistAsync(registerNutritionistRequest);
        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();

        var response = await adminClient.GetUserVerificationRequestDetails(userId);

        Assert.Multiple(() =>
        {
            Assert.That(registerNutritionistRequest.Name, Is.EqualTo(response.Name));
            Assert.That(registerNutritionistRequest.Surname, Is.EqualTo(response.Surname));
            Assert.That(registerNutritionistRequest.City, Is.EqualTo(response.City));
            Assert.That(userId, Is.EqualTo(response.UserId));
            Assert.That(registerNutritionistRequest.Email, Is.EqualTo(response.Email));
            Assert.That(registerNutritionistRequest.Attachments.First(), Is.EqualTo(response.Attachments.First().Attachment));
            Assert.That(registerNutritionistRequest.Name, Is.EqualTo(response.Name));
        });
    }

    [Test]
    public async Task NutritionistShouldBeAbleToVerifyProfileAfterRegistration()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        var registerNutritionistRequest = ARegisterNutritionistRequestWithoutAttachment();
        await userClient.RegisterNutritionistAsync(registerNutritionistRequest);
        await userClient.CreateVerificationRequestAsync(AVerificationRequest());
        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();
        await adminClient.ApproveVerificationRequestAsync(userId);

        var response = await userClient.GetProfileInformation();

        Assert.That(response.VerificationStatus, Is.EqualTo(NutritionistVerificationStatus.Approved.ToString()));
    }

    [Test]
    public async Task ShouldReturnInformationThatNutritionistVerificationIsInProgressAfterRegisteringWithDocumentsConfirmingQualifications()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var registerNutritionistRequest = ARegisterNutritionistRequestWithAttachment();
        await userClient.RegisterNutritionistAsync(registerNutritionistRequest);

        var response = await userClient.GetProfileInformation();

        Assert.Multiple(() =>
        {
            Assert.That(registerNutritionistRequest.Name, Is.EqualTo(response.Name));
            Assert.That(registerNutritionistRequest.Surname, Is.EqualTo(response.Surname));
            Assert.That(registerNutritionistRequest.Email, Is.EqualTo(response.Email));
            Assert.That(registerNutritionistRequest.Name, Is.EqualTo(response.Name));
            Assert.That(NutritionistVerificationStatus.Pending.ToString(), Is.EqualTo(response.VerificationStatus));
        });
    }

    [Test]
    public async Task SingleUserShouldNotBeAbleToMultipleRegistrationsAsNutritionist()
    {
        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();
        var registrationCommand = new RegisterNutritionistCommand(userId, ARegisterNutritionistRequestWithoutAttachment());
        await RegisterNutritionistCommandHandler.HandleAsync(registrationCommand, CancellationToken.None);

        Assert.That(async () => await RegisterNutritionistCommandHandler.HandleAsync(registrationCommand, CancellationToken.None), Throws.TypeOf<InvalidOperationException>());
    }

    [Test]
    public async Task VerifiedNutritionistShouldReceiveThatInformationWhenFetchingProfileInformation()
    {
        var command = ARegisterNutritionistRequestWithAttachment();
        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        await userClient.RegisterNutritionistAsync(command);
        var verificationResponse = await adminClient.ApproveVerificationRequestAsync(userId, "LGTM!");

        var response = await userClient.GetProfileInformation();

        verificationResponse.EnsureSuccessStatusCode();
        Assert.That(response.VerificationStatus, Is.EqualTo(NutritionistVerificationStatus.Approved.ToString()));
        Assert.That(response.VerificationMessage, Is.EqualTo("LGTM!"));
    }

    [Test]
    public async Task ShouldNotRegisterNutritionistWithoutAcceptingTermsAndConditions()
    {
        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();
        var request = ARegisterNutritionistRequestWithoutAttachment(acceptedTermsAndConditions: false);

        Assert.Throws<CommandValidationException>(() => new RegisterNutritionistCommand(userId, request));
    }

    [Test]
    public async Task NotAdministratorShouldNotBeAbleToSeePendingNutritionistRegistrationRequests()
    {
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);

        var result = await userClient.GetPendingVerificationRequestsHttpResponseAsync();

        Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
    }

    [Test]
    public async Task NutritionistShouldSeeInformationsWhyVerificationWasRejected()
    {
        var command = ARegisterNutritionistRequestWithAttachment();
        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        await userClient.RegisterNutritionistAsync(command);
        var adminClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        var verificationResponse = await adminClient.RejectVerificationRequestAsync(userId, "Rejected due some reason");

        var response = await userClient.GetProfileInformation();

        verificationResponse.EnsureSuccessStatusCode();
        Assert.That(response.VerificationStatus, Is.EqualTo(NutritionistVerificationStatus.Rejected.ToString()));
        Assert.That(response.VerificationMessage, Is.EqualTo("Rejected due some reason"));
    }

    [Test]
    public async Task OnlyAdministratorShouldBeAbletoVerifyRequests()
    {
        var command = ARegisterNutritionistRequestWithAttachment();
        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();
        var userClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        await userClient.RegisterNutritionistAsync(command);

        var verificationResponse = await userClient.ApproveVerificationRequestAsync(userId, "LGTM!");

        Assert.That(verificationResponse.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
    }



    private static RegisterNutritionistRequest ARegisterNutritionistRequestWithoutAttachment(bool acceptedTermsAndConditions = true)
    {
        return new RegisterNutritionistRequest
        {
            Name = "John",
            Surname = "Doe",
            City = "Warsaw",
            Email = "test@example.com",
            TermsAndConditionsAccepted = acceptedTermsAndConditions,
            Attachments = []
        };
    }

    private static RegisterNutritionistRequest ARegisterNutritionistRequestWithAttachment()
    {
        return new RegisterNutritionistRequest
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
    }

    private static CreateVerificationRequest AVerificationRequest()
    {
        return new CreateVerificationRequest
        (
            [
                new Attachment("file1.pdf", "data:application/pdf;base64," + new String('A', 3 * 1024 * 1024))
            ]
        );
    }
}