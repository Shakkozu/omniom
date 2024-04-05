using FluentAssertions;
using Omniom.Domain.NutritionDiary.AddNutritionEntries;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.ModifyProductPortion;
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

    private ModifyProductPortionCommandHandler ModifyProductPortionCommandHandler => _omniomApp.ModifyProductPortionCommandHandler;
    private ICommandHandler<AddNutritionEntriesCommand> AddNutritionEntriesCommandHandler => _omniomApp.AddNutritionEntriesCommandHandler;
    private GetNutritionDayQueryHandler GetDiaryQueryHandler => _omniomApp.GetDiaryQueryHandler;
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
    public async Task AddingNutritionEntriesIntegrationTests()
    {
        var dateOfModifiedEntry = DateTime.Now;
        _firstProductGuid = _productsSet.First().Guid;
        _secondProductGuid = _productsSet.Last().Guid;
        var addEndpoint = "/api/nutrition-diary/entries";
        var retrieveEndpoint = "/api/nutrition-diary/details";
        var authHttpClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync();
        var addEntriesRequest = new AddNutritionEntriesRequest(
            [
                new MealProductEntryDto(_firstProductGuid, 100),
                new MealProductEntryDto(_secondProductGuid, 250)
            ],
            MealType.Breakfast.ToString(),
            dateOfModifiedEntry
        );
        await authHttpClient.PostAsJsonAsync(addEndpoint, addEntriesRequest);

        var result = await authHttpClient.GetAsync($"{retrieveEndpoint}?nutritionDay={dateOfModifiedEntry:yyyy-MM-dd}");
        result.Content.ReadFromJsonAsync<IEnumerable<NutritionDayEntryDto>>().Result.Should().BeEquivalentTo(new[]
        {
            new NutritionDayEntryDto
            {
                Date = DateTime.Now.Date,
                Entries = new List<DiaryEntryData>
                {
                    new DiaryEntryData
                    {
                        ProductId = _firstProductGuid,
                        UserId = await AuthFixture.GetSuperuserIdAsync(),
                        ProductName = _productsSet.First().Name,
                        PortionInGrams = 100,
                        Meal = MealType.Breakfast.ToString(),
                        Calories = _productsSet.First().KcalPer100G,
                        Proteins = _productsSet.First().ProteinsPer100G,
                        Carbohydrates = _productsSet.First().CarbsPer100G,
                        Fats = _productsSet.First().FatPer100G
                    },
                    new DiaryEntryData
                    {
                        ProductId = _secondProductGuid,
                        UserId = await AuthFixture.GetSuperuserIdAsync(),
                        ProductName = _productsSet.Last().Name,
                        PortionInGrams = 250,
                        Meal = MealType.Breakfast.ToString(),
                        Calories = _productsSet.Last().KcalPer100G * 2.5m,
                        Proteins = _productsSet.Last().ProteinsPer100G * 2.5m,
                        Carbohydrates = _productsSet.Last().CarbsPer100G * 2.5m,
                        Fats = _productsSet.Last().FatPer100G * 2.5m
                    }
                }
            }
        }, options => options.Excluding(x => x.Name.EndsWith("Guid")));
    }

    [Test]
    public async Task ShouldReturnShortSummaryRangeForDays()
    {
        var dateOfModifiedEntry = DateTime.Now;
        _firstProductGuid = _productsSet.First().Guid;
        _secondProductGuid = _productsSet.Last().Guid;
        var addNutritionEntriesCommand = new AddNutritionEntriesCommand(
            new[]
            {
                new MealProductEntryDto(_firstProductGuid, 100),
            },
            MealType.Breakfast,
            dateOfModifiedEntry,
            _userId
        );
        var addPreviousDayNutritionEntriesCommand = new AddNutritionEntriesCommand(
            new[]
            {
                new MealProductEntryDto(_secondProductGuid, 250),
            },
            MealType.Breakfast,
            dateOfModifiedEntry.AddDays(-1),
            _userId
        );
        await AddNutritionEntriesCommandHandler.HandleAsync(addNutritionEntriesCommand, CancellationToken.None);
        await AddNutritionEntriesCommandHandler.HandleAsync(addPreviousDayNutritionEntriesCommand, CancellationToken.None);

        var summary = await ShortSummaryForDaysQueryHandler.HandleAsync(new GetShortDaysSummary(_userId, DateTime.Now.AddDays(-1).Date, DateTime.Now.Date), CancellationToken.None);

        summary.Should().HaveCount(2);
        summary.Single(entry => entry.NutritionDay.Date == dateOfModifiedEntry.Date).Should().BeEquivalentTo<ShortSummary>(new ShortSummary
        {
            NutritionDay = dateOfModifiedEntry.Date,
            TotalCalories = _productsSet.First().KcalPer100G,
            TotalFats = _productsSet.First().FatPer100G,
            TotalCarbohydrates = _productsSet.First().CarbsPer100G,
            TotalProteins = _productsSet.First().ProteinsPer100G
        });
        summary.Single(entry => entry.NutritionDay.Date == dateOfModifiedEntry.AddDays(-1).Date).Should().BeEquivalentTo(new ShortSummary
        {
            NutritionDay = dateOfModifiedEntry.AddDays(-1).Date,
            TotalCalories = _productsSet.Last().KcalPer100G * 2.5m,
            TotalFats = _productsSet.Last().FatPer100G * 2.5m,
            TotalCarbohydrates = _productsSet.Last().CarbsPer100G * 2.5m,
            TotalProteins = _productsSet.Last().ProteinsPer100G * 2.5m
        });
    }
}
