using Bogus;
using Omniom.Domain.Catalogue.Meals.CreatingNewMeal;
using Omniom.Domain.Catalogue.Meals.GettingMeal;
using Omniom.Domain.Catalogue.Meals.InitializingModuleData;
using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Tests.Auth;
using Omniom.Tests.Products;

namespace Omniom.Tests.DishConfiguration;

internal class MealsTestsFixture
{
    private MealsInitializer _initializer;

    public MealsTestsFixture(ICommandHandler<CreateMealCommand> commandHandler,
        IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>> getUserMealsQueryHandler,
        SearchProductsQueryHandler searchProductsQueryHandler,
        AuthFixture authFixture)
    {
        _initializer = new MealsInitializer(commandHandler, searchProductsQueryHandler);
        _getUserMealsQueryHandler = getUserMealsQueryHandler;
        _userId = authFixture.GetUserIdAsync().Result;
    }

    private readonly IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>> _getUserMealsQueryHandler;
    private readonly Guid _userId;

    internal async Task SeedMealsCatalogue(int count = 10)
    {
        await _initializer.SeedMealsCatalogue(_userId, count);
    }

    internal async Task<IEnumerable<MealCatalogueItem>> GetUserMeals(Guid userId)
    {
        return await _getUserMealsQueryHandler.HandleAsync(new GetUserMealsQuery(userId), CancellationToken.None);
    }
}