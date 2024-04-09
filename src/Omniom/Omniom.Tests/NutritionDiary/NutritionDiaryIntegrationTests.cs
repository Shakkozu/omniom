using FluentAssertions;
using Omniom.Domain.NutritionDiary.AddNutritionEntries;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Tests.Auth;
using Omniom.Tests.Products;
using Omniom.Tests.Shared;

namespace Omniom.Tests.NutritionDiary;
public class NutritionDiaryIntegrationTests
{
    private OmniomApp _omniomApp;
    private List<ProductDetailsDescription> _productsSet;
    private ProductsTestsFixture ProductsTestsFixture => _omniomApp.ProductsTestsFixture;
    private AuthFixture AuthFixture => _omniomApp.AuthFixture;

    [SetUp]
    public async Task Setup()
    {
        _omniomApp = OmniomApp.CreateInstance();
        _omniomApp.ProductsTestsFixture.SeedProductsCatalogue();
        _productsSet = (await ProductsTestsFixture.AProductsFromCatalogue()).ToList();
    }

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
                        UserId = await AuthFixture.GetSuperuserIdAsync(),
                        PortionInGrams = 250,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = secondProduct.Name,
                        Calories = secondProduct.KcalPer100G * 2.5m,
                        Proteins = secondProduct.ProteinsPer100G * 2.5m,
                        Carbohydrates = secondProduct.CarbsPer100G * 2.5m,
                        Fats = secondProduct.FatPer100G * 2.5m
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
        var restClient = new NutritionDiaryRestClient(await _omniomApp.CreateHttpClientWithAuthorizationAsync());

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
                        UserId = await AuthFixture.GetSuperuserIdAsync(),
                        PortionInGrams = 100,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = firstProduct.Name,
                        Calories = firstProduct.KcalPer100G,
                        Proteins = firstProduct.ProteinsPer100G,
                        Carbohydrates = firstProduct.CarbsPer100G,
                        Fats = firstProduct.FatPer100G
                    },
                    new DiaryEntryData
                    {
                        ProductId = secondProduct.Guid,
                        UserId = await AuthFixture.GetSuperuserIdAsync(),
                        PortionInGrams = 250,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = secondProduct.Name,
                        Calories = secondProduct.KcalPer100G * 2.5m,
                        Proteins = secondProduct.ProteinsPer100G * 2.5m,
                        Carbohydrates = secondProduct.CarbsPer100G * 2.5m,
                        Fats = secondProduct.FatPer100G * 2.5m
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
                        UserId = await AuthFixture.GetSuperuserIdAsync(),
                        PortionInGrams = 50,
                        Meal = MealType.Breakfast.ToString(),
                        ProductName = anotherProduct.Name,
                        Calories = anotherProduct.KcalPer100G * .5m,
                        Proteins = anotherProduct.ProteinsPer100G * .5m,
                        Carbohydrates = anotherProduct.CarbsPer100G * .5m,
                        Fats = anotherProduct.FatPer100G * .5m
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
            TotalFats = firstProduct.FatPer100G + secondProduct.FatPer100G,
            TotalCarbohydrates = firstProduct.CarbsPer100G + secondProduct.CarbsPer100G,
            TotalProteins = firstProduct.ProteinsPer100G + secondProduct.ProteinsPer100G
        });
        summary.Single(entry => entry.NutritionDay.Date == dateOfModifiedEntry.AddDays(-1).Date).Should().BeEquivalentTo(new ShortSummary
        {
            NutritionDay = dateOfModifiedEntry.AddDays(-1).Date,
            TotalCalories = secondProduct.KcalPer100G * 2.5m,
            TotalFats = secondProduct.FatPer100G * 2.5m,
            TotalCarbohydrates = secondProduct.CarbsPer100G * 2.5m,
            TotalProteins = secondProduct.ProteinsPer100G * 2.5m
        });
    }
}
