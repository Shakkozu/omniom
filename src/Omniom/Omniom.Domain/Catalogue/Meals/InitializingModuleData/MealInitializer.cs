using Bogus;
using Omniom.Domain.Catalogue.Meals.CreatingNewMeal;
using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Shared.BuildingBlocks;

namespace Omniom.Domain.Catalogue.Meals.InitializingModuleData;

public class MealsInitializer
{
    private readonly ICommandHandler<CreateMealCommand> _createMealCommandHandler;
    private readonly SearchProductsQueryHandler _searchProductsQueryHandler;

    public MealsInitializer(ICommandHandler<CreateMealCommand> createMealCommandHandler,
        SearchProductsQueryHandler searchProductsQueryHandler)
    {
        _createMealCommandHandler = createMealCommandHandler;
        _searchProductsQueryHandler = searchProductsQueryHandler;
    }

    public async Task SeedMealsCatalogue(Guid userId, int count = 10)
    {
        var faker = new Faker();
        for (int i = 0; i < count; i++)
        {
            var meal = new Meal(Guid.NewGuid(), faker.Lorem.Slug(3), faker.Lorem.Lines(), faker.Lorem.Lines(), 1, await GetRandomMealIngredientsAsync());
            await _createMealCommandHandler.HandleAsync(new CreateMealCommand(userId, meal), CancellationToken.None);
        }
    }

    private async Task<List<MealIngredient>> GetRandomMealIngredientsAsync()
    {
        var count = new Random().Next(1, 5);
        var products = await _searchProductsQueryHandler.HandleAsync(new SearchProductsQuery("", PageSize: 1000), CancellationToken.None);
        return products
            .Products
            .OrderBy(x => Guid.NewGuid()) // Shuffle the products list
            .Take(count)
            .Select(p => new MealIngredient(
                p.Name,
                p.Guid,
                new Random().Next(80, 240),
                p.KcalPer100G,
                p.ProteinsPer100G,
                p.CarbohydratesPer100G,
                p.FatsPer100G))
            .ToList();
    }
}