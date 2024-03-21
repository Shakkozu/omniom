using FluentAssertions;
using Omniom.Domain.NutritionDiary.AddProductToDiary;
using Omniom.Domain.NutritionDiary.GetDiary;
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
        {
            UserId = _userId,
            ProductId = _firstProductGuid,
            Guid = Guid.NewGuid(),
            PortionInGrams = 100,
            Meal = MealType.Breakfast,
            Date = DateTime.UtcNow
        };
        var addSecondProductToDiaryCommand = new AddProductToDiaryCommand
        {
            UserId = _userId,
            ProductId = _secondProductGuid,
            Guid = Guid.NewGuid(),
            PortionInGrams = 250,
            Meal = MealType.Supper,
            Date = DateTime.UtcNow
        };
        var modifyFirstProductInDiaryCommand = new ModifyProductPortionCommand
        {
            UserId = _userId,
            Guid = addFirstProductToDiaryCommand.Guid,
            PortionInGrams = 460,
        };

        await AddProductToDiaryCommandHandler.HandleAsync(addFirstProductToDiaryCommand, CancellationToken.None);
        await AddProductToDiaryCommandHandler.HandleAsync(addSecondProductToDiaryCommand, CancellationToken.None);
        await ModifyProductPortionCommandHandler.HandleAsync(modifyFirstProductInDiaryCommand, CancellationToken.None);

        var diary = (await GetDiaryQueryHandler.HandleAsync(new GetDiaryQuery { UserId = _userId, DateTime = DateTime.UtcNow }, CancellationToken.None)).Single();
        diary.Entries.Should().HaveCount(2);
        diary.Entries.First(product => product.Guid == addFirstProductToDiaryCommand.Guid).PortionInGrams.Should().Be(460);
        diary.Entries.First(product => product.Guid == addSecondProductToDiaryCommand.Guid).PortionInGrams.Should().Be(250);
    }
}
