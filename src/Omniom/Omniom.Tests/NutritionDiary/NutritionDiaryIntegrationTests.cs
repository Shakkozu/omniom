using FluentAssertions;
using Microsoft.IdentityModel.Tokens;
using Omniom.Domain.NutritionDiary.AddProductToDiary;
using Omniom.Domain.NutritionDiary.ModifyProductPortion;
using Omniom.Tests.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Tests.NutritionDiary;
public class NutritionDiaryIntegrationTests
{
    private OmniomApp _omniomApp;
    private Guid _userId;

    private AddProductToDiaryCommandHandler AddProductToDiaryCommandHandler => _omniomApp.AddProductToDiaryCommandHandler;
    private ModifyProductPortionCommandHandler ModifyProductPortionCommandHandler => _omniomApp.ModifyProductPortionCommandHandler;
    private GetDiaryQueryHandler GetDiaryQueryHandler => _omniomApp.GetDiaryQueryHandler;

    [SetUp]
    public void Setup()
    {
        _omniomApp = OmniomApp.CreateInstance();
        _userId = Guid.NewGuid();
    }

    [Test]
    public async Task AddingAndModyfyingEntriesToProductsDiaryIntegrationTests()
    {
        var addFirstProductToDiaryCommand = new AddProductToDiaryCommand
        {
            UserId = _userId,
            ProductId = Guid.NewGuid(),
            Guid = Guid.NewGuid(),
            PortionInGrams = 100,
            Meal = MealType.Breakfast,
            Date = DateTime.Now
        };
        var addSecondProductToDiaryCommand = new AddProductToDiaryCommand
        {
            UserId = _userId,
            ProductId = Guid.NewGuid(),
            Guid = Guid.NewGuid(),
            PortionInGrams = 250,
            Meal = MealType.Supper,
            Date = DateTime.Now
        };
        var modifyFirstProductInDiaryCommand = new ModifyProductPortionCommand
        {
            UserId = _userId,
            Guid = addFirstProductToDiaryCommand.Guid,
            PortionInGrams = 460,
            Date = DateTime.Now
        };

        await AddProductToDiaryCommandHandler.HandleAsync(addFirstProductToDiaryCommand, CancellationToken.None);
        await AddProductToDiaryCommandHandler.HandleAsync(addSecondProductToDiaryCommand, CancellationToken.None);
        await ModifyProductPortionCommandHandler.HandleAsync(modifyFirstProductInDiaryCommand, CancellationToken.None);

        var diary = (await GetDiaryQueryHandler.HandleAsync(new GetDiaryQuery { UserId = _userId, Date = DateTime.Today }, CancellationToken.None)).Single();
        diary.Entries.Should().HaveCount(2);
        diary.Entries.First(product => product.Guid == addFirstProductToDiaryCommand.Guid).PortionInGrams.Should().Be(100);
        diary.Entries.First(product => product.Guid == addSecondProductToDiaryCommand.Guid).PortionInGrams.Should().Be(460);
    }
}
