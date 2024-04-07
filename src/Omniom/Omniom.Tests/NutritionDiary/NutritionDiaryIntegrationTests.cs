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
using System.Net.Http.Json;

namespace Omniom.Tests.NutritionDiary;
public class NutritionDiaryIntegrationTests
{
    private OmniomApp _omniomApp;
    private Guid _userId;
    private Guid _secondProductGuid;
    private Guid _firstProductGuid;
    private List<ProductDetailsDescription> _productsSet;

    private ICommandHandler<SaveMealNutritionEntriesCommand> AddNutritionEntriesCommandHandler => _omniomApp.AddNutritionEntriesCommandHandler;
    private GetShortSummaryForDaysQueryHandler ShortSummaryForDaysQueryHandler => _omniomApp.GetShortSummaryForDaysQueryHandler;
    private ProductsTestsFixture ProductsTestsFixture => _omniomApp.ProductsTestsFixture;
    private AuthFixture AuthFixture => _omniomApp.AuthFixture;

    [SetUp]
    public async Task Setup()
    {
        _omniomApp = OmniomApp.CreateInstance();
        _userId = Guid.NewGuid();
        _omniomApp.ProductsTestsFixture.SeedProductsCatalogue();
        _productsSet = (await ProductsTestsFixture.AProductsFromCatalogue()).ToList();
    }

    [Test]
    public async Task ModifyingNutritionEntriesWorkflowIntegrationTests()
    {
        var dateOfModifiedEntry = DateTime.Now;
        var firstProduct = _productsSet.First();
        var secondProduct= _productsSet.Last();
        var anotherProduct = _productsSet[_productsSet.Count - 2];
        var modifyNutritionEntriesEndpoint = "/api/nutrition-diary/entries";
        var retrieveEndpoint = "/api/nutrition-diary/details";
        var authHttpClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync();
        var saveEntriesRequest = new SaveMealNutritionEntriesRequest(
            [
                new MealProductEntryDto(firstProduct.Guid, 100),
                new MealProductEntryDto(secondProduct.Guid, 250)
            ],
            MealType.Breakfast.ToString(),
            dateOfModifiedEntry
        );
        await authHttpClient.PostAsJsonAsync(modifyNutritionEntriesEndpoint, saveEntriesRequest);

        var result = await authHttpClient.GetAsync($"{retrieveEndpoint}?nutritionDay={dateOfModifiedEntry:yyyy-MM-dd}");
        (await result.Content.ReadFromJsonAsync<IEnumerable<NutritionDayEntryDto>>()).Should().BeEquivalentTo(new[]
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
        await authHttpClient.PostAsJsonAsync(modifyNutritionEntriesEndpoint, saveEntriesRequest);
        result = await authHttpClient.GetAsync($"{retrieveEndpoint}?nutritionDay={dateOfModifiedEntry:yyyy-MM-dd}");
        result.Content.ReadFromJsonAsync<IEnumerable<NutritionDayEntryDto>>().Result.Should().BeEquivalentTo(new[]
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
        var firstProduct= _productsSet.First();
        var secondProduct= _productsSet.Last();
        var addNutritionEntriesCommand = new SaveMealNutritionEntriesCommand(
            [new MealProductEntryDto(firstProduct.Guid, 100)],
            MealType.Breakfast,
            dateOfModifiedEntry,
            _userId
        );
        var addSecondMealNutritionEntriesCommand = new SaveMealNutritionEntriesCommand(
            [ new MealProductEntryDto(secondProduct.Guid, 100) ],
            MealType.Dinner,
            dateOfModifiedEntry,
            _userId
        );
        var addPreviousDayNutritionEntriesCommand = new SaveMealNutritionEntriesCommand(
            [new MealProductEntryDto(secondProduct.Guid, 250)],
            MealType.Breakfast,
            dateOfModifiedEntry.AddDays(-1),
            _userId
        );
        await AddNutritionEntriesCommandHandler.HandleAsync(addNutritionEntriesCommand, CancellationToken.None);
        await AddNutritionEntriesCommandHandler.HandleAsync(addSecondMealNutritionEntriesCommand, CancellationToken.None);
        await AddNutritionEntriesCommandHandler.HandleAsync(addPreviousDayNutritionEntriesCommand, CancellationToken.None);

        var summary = await ShortSummaryForDaysQueryHandler.HandleAsync(new GetShortDaysSummary(_userId, DateTime.Now.AddDays(-1).Date, DateTime.Now.Date), CancellationToken.None);

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
