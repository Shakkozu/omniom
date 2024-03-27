using FluentAssertions;
using Omniom.Domain.NutritionDiary.AddProductToDiary;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.ModifyProductPortion;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
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

    private AddProductToDiaryCommandHandler AddProductToDiaryCommandHandler => _omniomApp.AddProductToDiaryCommandHandler;
    private ModifyProductPortionCommandHandler ModifyProductPortionCommandHandler => _omniomApp.ModifyProductPortionCommandHandler;
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
    public async Task ShouldRetrieveDetailsCorrectly()
    {
        var httpClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync();
        _firstProductGuid = _productsSet.First().Guid;
        var addFirstProductToDiaryCommand = new AddProductToDiaryCommand
        (
            await AuthFixture.GetSuperuserIdAsync(),
            _firstProductGuid,
            Guid.NewGuid(),
            100,
            MealType.Breakfast,
            DateTime.Now
        );
        await AddProductToDiaryCommandHandler.HandleAsync(addFirstProductToDiaryCommand, CancellationToken.None);
        var endpoint = "/api/nutrition-diary/details";
        var nutritionDayParamStr = DateTime.Now.ToString("yyyy-MM-dd");

        var result = await httpClient.GetAsync($"{endpoint}?nutritionDay={nutritionDayParamStr}");
        result.Content.ReadFromJsonAsync<IEnumerable<NutritionDayEntryDto>>().Result.Should().BeEquivalentTo(new[]
        {
            new NutritionDayEntryDto
        {
            Date = DateTime.Now.Date,
            Entries = new List<DiaryEntryData>
            {
                new DiaryEntryData
                {
                    Guid = addFirstProductToDiaryCommand.Guid,
                    ProductId = _firstProductGuid,
                    UserId = await AuthFixture.GetSuperuserIdAsync(),
                    ProductName = _productsSet.First().Name,
                    PortionInGrams = 100,
                    Meal = MealType.Breakfast,
                    Calories = _productsSet.First().KcalPer100G,
                    Proteins = _productsSet.First().ProteinsPer100G,
                    Carbohydrates = _productsSet.First().CarbsPer100G,
                    Fats = _productsSet.First().FatPer100G
                }
            }
        }
        });
    }

    [Test]
    public async Task AddingAndModyfyingEntriesToProductsDiaryIntegrationTests()
    {
        var dateOfModifiedEntry = DateTime.Now;
        _firstProductGuid = _productsSet.First().Guid;
        _secondProductGuid = _productsSet.Last().Guid;
        var addFirstProductToDiaryCommand = new AddProductToDiaryCommand
        (
            _userId,
            _firstProductGuid,
            Guid.NewGuid(),
            100,
            MealType.Breakfast,
            dateOfModifiedEntry
        );
        var addSecondProductToDiaryCommand = new AddProductToDiaryCommand(
            _userId,
            _secondProductGuid,
            Guid.NewGuid(),
            250,
            MealType.Supper,
            dateOfModifiedEntry
        );
        var modifyFirstProductInDiaryCommand = new ModifyProductPortionCommand
        {
            UserId = _userId,
            Guid = addFirstProductToDiaryCommand.Guid,
            PortionInGrams = 460,
        };

        await AddProductToDiaryCommandHandler.HandleAsync(addFirstProductToDiaryCommand, CancellationToken.None);
        await AddProductToDiaryCommandHandler.HandleAsync(addSecondProductToDiaryCommand, CancellationToken.None);
        await ModifyProductPortionCommandHandler.HandleAsync(modifyFirstProductInDiaryCommand, CancellationToken.None);

        var diary = (await GetDiaryQueryHandler.HandleAsync(new GetNutritionDayQuery(_userId, dateOfModifiedEntry), CancellationToken.None)).Single();
        diary.Entries.Should().HaveCount(2);
        diary.Date.Should().Be(dateOfModifiedEntry.Date);
        diary.Entries.First(product => product.Guid == addFirstProductToDiaryCommand.Guid).PortionInGrams.Should().Be(460);
        diary.Entries.First(product => product.Guid == addSecondProductToDiaryCommand.Guid).PortionInGrams.Should().Be(250);
    }

    [Test]
    public async Task ShouldReturnShortSummaryRangeForDays()
    {
        var dateOfModifiedEntry = DateTime.Now;
        _firstProductGuid = _productsSet.First().Guid;
        _secondProductGuid = _productsSet.Last().Guid;
        var addFirstProductToDiaryCommand = new AddProductToDiaryCommand(
            _userId,
            _firstProductGuid,
            Guid.NewGuid(),
            100,
            MealType.Breakfast,
            dateOfModifiedEntry
        );
        var addSecondProductToDiaryCommand = new AddProductToDiaryCommand(
            _userId,
            _secondProductGuid,
            Guid.NewGuid(),
            250,
            MealType.Supper,
            dateOfModifiedEntry.AddDays(-1)
        );
        await AddProductToDiaryCommandHandler.HandleAsync(addFirstProductToDiaryCommand, CancellationToken.None);
        await AddProductToDiaryCommandHandler.HandleAsync(addSecondProductToDiaryCommand, CancellationToken.None);

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
