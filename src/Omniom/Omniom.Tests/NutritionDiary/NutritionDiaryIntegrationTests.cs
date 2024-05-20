using FluentAssertions;
using Omniom.Domain.NutritionDiary.AddNutritionEntries;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Tests.Auth;
using Omniom.Tests.Shared;

namespace Omniom.Tests.NutritionDiary;

[TestFixture]
public class NutritionDiaryIntegrationTests : BaseIntegrationTestsFixture
{
    private AuthFixture AuthFixture => _omniomApp.AuthFixture;

    [Test]
    public async Task ShouldRemoveNutriitonEntryFromMeal()
    {
        var restClient = new NutritionDiaryRestClient(await _omniomApp.CreateHttpClientWithAuthorizationAsync());
        var dateOfModifiedEntry = DateTime.Now;
        var firstProduct = _productsSet.First();
        var secondProduct = _productsSet.Last();
        var saveEntriesRequest = new SaveMealNutritionEntriesRequest(
            [
                new MealProductEntryDto(firstProduct.Guid, 100),
                new MealProductEntryDto(secondProduct.Guid, 250)
            ],
            MealType.Breakfast.ToString(),
            dateOfModifiedEntry
        );

        await restClient.SaveNutritionEntries(saveEntriesRequest);
        var result = await restClient.GetNutritionDayEntries(dateOfModifiedEntry);
        var entryToRemoveId = result.First().Entries.First(e => e.ProductId == firstProduct.Guid).Guid;

        await restClient.RemoveNutritionEntry(entryToRemoveId);
        result = await restClient.GetNutritionDayEntries(dateOfModifiedEntry);
        result.Should().BeEquivalentTo(new[]
        {
            new NutritionDayEntryDto
            {
                Date = DateTime.Now.Date,
                Entries = new List<DiaryEntryData>
                {
                    new DiaryEntryData
                    {
                        ProductId = secondProduct.Guid,
                        UserId = await AuthFixture.GetUserIdAsync(),
                        PortionInGrams = 250,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = secondProduct.ProductName,
                        Calories = secondProduct.KcalPer100G * 2.5m,
                        Proteins = secondProduct.ProteinsPer100G * 2.5m,
                        Carbohydrates = secondProduct.CarbohydratesPer100G * 2.5m,
                        Fats = secondProduct.FatsPer100G * 2.5m
                    }
                }
            }
        }, options => options.Excluding(x => x.Name.EndsWith("Guid")));
    }

    [Test]
    public async Task ModifyingNutritionEntriesWorkflowIntegrationTests()
    {
        var dateOfModifiedEntry = DateTime.Now;
        var firstProduct = _productsSet.First();
        var secondProduct = _productsSet.Last();
        var anotherProduct = _productsSet[_productsSet.Count - 2];
        var saveEntriesRequest = new SaveMealNutritionEntriesRequest(
            [
                new MealProductEntryDto(firstProduct.Guid, 100),
                new MealProductEntryDto(secondProduct.Guid, 250)
            ],
            MealType.Breakfast.ToString(),
            dateOfModifiedEntry
        );
        var restClient = new NutritionDiaryRestClient(await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User));

        await restClient.SaveNutritionEntries(saveEntriesRequest);

        var result = await restClient.GetNutritionDayEntries(dateOfModifiedEntry);
        result.Should().BeEquivalentTo(new[]
        {
            new NutritionDayEntryDto
            {
                Date = DateTime.Now.Date,
                Entries = new List<DiaryEntryData>
                {
                    new DiaryEntryData
                    {
                        ProductId = firstProduct.Guid,
                        UserId = await AuthFixture.GetUserIdAsync(),
                        PortionInGrams = 100,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = firstProduct.ProductName,
                        Calories = firstProduct.KcalPer100G,
                        Proteins = firstProduct.ProteinsPer100G,
                        Carbohydrates = firstProduct.CarbohydratesPer100G,
                        Fats = firstProduct.FatsPer100G
                    },
                    new DiaryEntryData
                    {
                        ProductId = secondProduct.Guid,
                        UserId = await AuthFixture.GetUserIdAsync(),
                        PortionInGrams = 250,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = secondProduct.ProductName,
                        Calories = secondProduct.KcalPer100G * 2.5m,
                        Proteins = secondProduct.ProteinsPer100G * 2.5m,
                        Carbohydrates = secondProduct.CarbohydratesPer100G * 2.5m,
                        Fats = secondProduct.FatsPer100G * 2.5m
                    }
                }
            }
        }, options => options.Excluding(x => x.Name.EndsWith("Guid")));

        saveEntriesRequest = new SaveMealNutritionEntriesRequest(
            [
                new MealProductEntryDto(anotherProduct.Guid, 50),
            ],
            MealType.Breakfast.ToString(),
            dateOfModifiedEntry
        );
        await restClient.SaveNutritionEntries(saveEntriesRequest);
        (await restClient.GetNutritionDayEntries(dateOfModifiedEntry)).Should().BeEquivalentTo(new[]
        {
            new NutritionDayEntryDto
            {
                Date = DateTime.Now.Date,
                Entries = new List<DiaryEntryData>
                {
                    new DiaryEntryData
                    {
                        ProductId = anotherProduct.Guid,
                        UserId = await AuthFixture.GetUserIdAsync(),
                        PortionInGrams = 50,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = anotherProduct.ProductName,
                        Calories = anotherProduct.KcalPer100G * .5m,
                        Proteins = anotherProduct.ProteinsPer100G * .5m,
                        Carbohydrates = anotherProduct.CarbohydratesPer100G * .5m,
                        Fats = anotherProduct.FatsPer100G * .5m
                    },
                }
            }
        }, options => options.Excluding(x => x.Name.EndsWith("Guid")));
    }

    [Test]
    public async Task ShouldReturnShortSummaryRangeForDays()
    {
        var dateOfModifiedEntry = DateTime.Now;
        var firstProduct = _productsSet.First();
        var secondProduct = _productsSet.Last();
        var addNutritionEntryRequest = new SaveMealNutritionEntriesRequest(
            [new MealProductEntryDto(firstProduct.Guid, 100)],
            MealType.Breakfast.ToString(),
            dateOfModifiedEntry
        );
        var addSecondNutritionEntryRequest = new SaveMealNutritionEntriesRequest(
            [new MealProductEntryDto(secondProduct.Guid, 100)],
            MealType.Dinner.ToString(),
            dateOfModifiedEntry
        );
        var addPreviousDayNutritionEntriesRequest = new SaveMealNutritionEntriesRequest(
            [new MealProductEntryDto(secondProduct.Guid, 250)],
            MealType.Breakfast.ToString(),
            dateOfModifiedEntry.AddDays(-1)
        );
        var restClient = new NutritionDiaryRestClient(await _omniomApp.CreateHttpClientWithAuthorizationAsync());

        await restClient.SaveNutritionEntries(addNutritionEntryRequest);
        await restClient.SaveNutritionEntries(addSecondNutritionEntryRequest);
        await restClient.SaveNutritionEntries(addPreviousDayNutritionEntriesRequest);

        var summary = await restClient.GetShortSummaryForDays(DateTime.Now.AddDays(-1).Date, DateTime.Now.Date);

        summary.Should().HaveCount(2);
        summary.Single(entry => entry.NutritionDay.Date == dateOfModifiedEntry.Date).Should().BeEquivalentTo<ShortSummary>(new ShortSummary
        {
            NutritionDay = dateOfModifiedEntry.Date,
            TotalCalories = firstProduct.KcalPer100G + secondProduct.KcalPer100G,
            TotalFats = firstProduct.FatsPer100G + secondProduct.FatsPer100G,
            TotalCarbohydrates = firstProduct.CarbohydratesPer100G + secondProduct.CarbohydratesPer100G,
            TotalProteins = firstProduct.ProteinsPer100G + secondProduct.ProteinsPer100G
        });
        summary.Single(entry => entry.NutritionDay.Date == dateOfModifiedEntry.AddDays(-1).Date).Should().BeEquivalentTo(new ShortSummary
        {
            NutritionDay = dateOfModifiedEntry.AddDays(-1).Date,
            TotalCalories = secondProduct.KcalPer100G * 2.5m,
            TotalFats = secondProduct.FatsPer100G * 2.5m,
            TotalCarbohydrates = secondProduct.CarbohydratesPer100G * 2.5m,
            TotalProteins = secondProduct.ProteinsPer100G * 2.5m
        });
    }
}
