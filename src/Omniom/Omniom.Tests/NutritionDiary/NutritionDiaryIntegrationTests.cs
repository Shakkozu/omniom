using FluentAssertions;
using Omniom.Domain.NutritionDiary.AddProductToDiary;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.ModifyProductPortion;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Tests.Products;
using Omniom.Tests.Shared;

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
    private GetDiaryQueryHandler GetDiaryQueryHandler => _omniomApp.GetDiaryQueryHandler;
    private GetShortSummaryForDaysQueryHandler ShortSummaryForDaysQueryHandler => _omniomApp.GetShortSummaryForDaysQueryHandler;
    private ProductsTestsFixture ProductsTestsFixture => _omniomApp.ProductsTestsFixture;

    [SetUp]
    public async Task Setup()
    {
        _omniomApp = OmniomApp.CreateInstance();
        _userId = Guid.NewGuid();
        _omniomApp.ProductsTestsFixture.SeedProductsCatalogue();
        _productsSet = (await ProductsTestsFixture.AProductsFromCatalogue()).ToList();
    }

    [Test]
    public async Task AddingAndModyfyingEntriesToProductsDiaryIntegrationTests()
    {
        _firstProductGuid = _productsSet.First().Guid;
        _secondProductGuid = _productsSet.Last().Guid;
        var addFirstProductToDiaryCommand = new AddProductToDiaryCommand
        (
            _userId,
            _firstProductGuid,
            Guid.NewGuid(),
            100,
            MealType.Breakfast,
            DateTime.UtcNow.Date.ToLocalTime()
        );
        var addSecondProductToDiaryCommand = new AddProductToDiaryCommand(
            _userId,
            _secondProductGuid,
            Guid.NewGuid(),
            250,
            MealType.Supper,
            DateTime.UtcNow.Date.ToLocalTime()
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

        var diary = (await GetDiaryQueryHandler.HandleAsync(new GetDiaryQuery(_userId, DateTime.UtcNow.Date.ToLocalTime()), CancellationToken.None)).Single();
        diary.Entries.Should().HaveCount(2);
        diary.Entries.First(product => product.Guid == addFirstProductToDiaryCommand.Guid).PortionInGrams.Should().Be(460);
        diary.Entries.First(product => product.Guid == addSecondProductToDiaryCommand.Guid).PortionInGrams.Should().Be(250);
    }

    [Test]
    public async Task ShouldReturnShortSummaryRangeForDays()
    {
        _firstProductGuid = _productsSet.First().Guid;
        _secondProductGuid = _productsSet.Last().Guid;
        var addFirstProductToDiaryCommand = new AddProductToDiaryCommand(
            _userId,
            _firstProductGuid,
            Guid.NewGuid(),
            100,
            MealType.Breakfast,
            DateTime.UtcNow.Date
        );
        var addSecondProductToDiaryCommand = new AddProductToDiaryCommand(
            _userId,
            _secondProductGuid,
            Guid.NewGuid(),
            250,
            MealType.Supper,
            DateTime.UtcNow.Date.AddDays(-1)
        );
        await AddProductToDiaryCommandHandler.HandleAsync(addFirstProductToDiaryCommand, CancellationToken.None);
        await AddProductToDiaryCommandHandler.HandleAsync(addSecondProductToDiaryCommand, CancellationToken.None);

        var summary = await ShortSummaryForDaysQueryHandler.HandleAsync(new GetShortDaysSummary(_userId, DateTime.UtcNow.Date.AddDays(-7), DateTime.UtcNow.Date), CancellationToken.None);

        summary.Should().HaveCount(8);
        summary.Single(entry => entry.NutritionDay == DateTime.UtcNow.Date).Should().BeEquivalentTo<ShortSummary>(new ShortSummary
        {
            NutritionDay = DateTime.UtcNow.Date.Date,
            TotalCalories = _productsSet.First().KcalPer100G,
            TotalFats = _productsSet.First().FatPer100G,
            TotalCarbohydrates = _productsSet.First().CarbsPer100G,
            TotalProteins = _productsSet.First().ProteinsPer100G
        });
        summary.Single(entry => entry.NutritionDay == DateTime.UtcNow.Date.AddDays(-1)).Should().BeEquivalentTo(new ShortSummary
        {
            NutritionDay = DateTime.UtcNow.Date.AddDays(-1).Date,
            TotalCalories = _productsSet.Last().KcalPer100G * 2.5m,
            TotalFats = _productsSet.Last().FatPer100G * 2.5m,
            TotalCarbohydrates = _productsSet.Last().CarbsPer100G * 2.5m,
            TotalProteins = _productsSet.Last().ProteinsPer100G * 2.5m
        });
        summary.Where(entry => entry.NutritionDay < DateTime.UtcNow.Date.AddDays(-1))
            .All(entry =>
            entry.TotalProteins == 0 &&
            entry.TotalCarbohydrates == 0 &&
            entry.TotalCalories == 0 &&
            entry.TotalFats == 0);   
    }
}
