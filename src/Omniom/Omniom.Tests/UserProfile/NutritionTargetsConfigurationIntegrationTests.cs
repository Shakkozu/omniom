using FluentAssertions;
using Omniom.Domain.UserProfile.NutritionTargetsConfiguration.Contract;
using Omniom.Tests.Shared;

namespace Omniom.Tests.UserProfile;

[TestFixture]
public class NutritionTargetsConfigurationIntegrationTests : BaseIntegrationTestsFixture
{
    [Test]
    public async Task ShouldMofidyNutritionTargetsConfiguration()
    {
        var restClient = new UserProfileRestClient(await _omniomApp.CreateHttpClientWithAuthorizationAsync());
        var result = await restClient.GetNutritionTargets();
        result.Should().BeEquivalentTo(NutritionTargetConfiguration.Default);
        var request = new NutritionTargetConfiguration
        {
            Calories = 2500,
            ProteinsPercents = 35,
            CarbohydratesPercents = 50,
            FatsPercents = 15,
            ProteinsGrams = 219,
            CarbohydratesGrams = 313,
            FatsGrams = 42
        };

        await restClient.ModifyNutritionTargets(request);
        result = await restClient.GetNutritionTargets();
        result.Should().BeEquivalentTo(request);
    }
}