using Bogus;
using Omniom.Domain.Catalogue.Meals.CreatingNewMeal;
using Omniom.Domain.Catalogue.Meals.GettingMeal;
using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Tests.Auth;
using Omniom.Tests.Products;

namespace Omniom.Tests.DishConfiguration;

internal class MealsTestsFixture
{
    public MealsTestsFixture(ProductsTestsFixture productsTestsFixture,
        ICommandHandler<CreateMealCommand> commandHandler,
        IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>> getUserMealsQueryHandler,
        AuthFixture authFixture)
    {
        _productsTestsFixture = productsTestsFixture;
        _commandHandler = commandHandler;
        _getUserMealsQueryHandler = getUserMealsQueryHandler;
        _userId = authFixture.GetUserIdAsync().Result;
    }

    private readonly ProductsTestsFixture _productsTestsFixture;
    private readonly ICommandHandler<CreateMealCommand> _commandHandler;
    private readonly IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>> _getUserMealsQueryHandler;
    private readonly Guid _userId;

    internal async Task SeedMealsCatalogue(int count = 10)
    {
        var faker = new Faker();
        for (int i = 0; i < count; i++)
        {
            var meal = new Meal(Guid.NewGuid(), faker.Lorem.Slug(3), faker.Lorem.Lines(), faker.Lorem.Lines(), 1, GetRandomMealIngredients());
            await _commandHandler.HandleAsync(new CreateMealCommand(_userId, meal), CancellationToken.None);
        }
    }

    internal async Task<IEnumerable<MealCatalogueItem>> GetUserMeals(Guid userId)
    {
        return await _getUserMealsQueryHandler.HandleAsync(new GetUserMealsQuery(userId), CancellationToken.None);
    }

    private List<MealIngredient> GetRandomMealIngredients()
    {
        var count = new Random().Next(1, 5);
        var products = _productsTestsFixture.AProductsFromCatalogue().Result.ToList();
        return products
            .OrderBy(x => Guid.NewGuid()) // Shuffle the products list
            .Take(count)
            .Select(p => new MealIngredient(
                p.Name,
                p.Guid,
                new Random().Next(80,240),
                p.KcalPer100G,
                p.ProteinsPer100G,
                p.CarbohydratesPer100G,
                p.FatsPer100G))
            .ToList();
    }
}