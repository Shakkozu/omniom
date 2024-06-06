using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Omniom.Domain.Auth.GetUserIdByEmail;
using Omniom.Domain.Auth.RegisterUser;
using Omniom.Domain.Catalogue.Meals.CreatingNewMeal;
using Omniom.Domain.Catalogue.Meals.InitializingModuleData;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.NutritionDiary.AddNutritionEntries;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetNutritionDay;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.RemovingNutritionEntries;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Repositories;
using System.Net.WebSockets;
using static System.Net.Mime.MediaTypeNames;

namespace Omniom.Domain.NutritionDiary;

public class DemoDataInitializer
{
    private readonly WebApplication _webApplication;
    private readonly IConfiguration _config;
    private readonly ILogger<DemoDataInitializer> _logger;
    private UserInfoRepository _usersRepository;

    public DemoDataInitializer(WebApplication webApplication, IConfiguration config)
    {
        _webApplication = webApplication;
        _config = config;
        _logger = _webApplication.Services.GetService<ILogger<DemoDataInitializer>>() ?? new Logger<DemoDataInitializer>(new LoggerFactory());
    }

    public async Task SeedApplicationWithDemoData()
    {
        using (var scope = _webApplication.Services.CreateScope())
        {
            if (!_config.GetValue<bool>("Demo:AddDemoData"))
            {
                _logger.LogInformation("Demo data initialization is disabled, skipping");
                return;
            }
            var isAlreadyInitialized = (await GetDemoUsersIdsAsync(scope)).Any();
            if (isAlreadyInitialized)
            {
                _logger.LogInformation("Demo data is already initialized, skipping");
                return;
            }

            await AddDemoUsersAsync(scope);
            var demoUsers = await GetDemoUsersIdsAsync(scope);
            var usersRepository = new UserInfoRepository(demoUsers);
            await AddIndividualDishesAsync(scope, usersRepository);
            await AddNutritionistRegistrationRequests(scope, usersRepository);
        }
    }

    private async Task AddIndividualDishesAsync(IServiceScope scope, UserInfoRepository repo)
    {
        var createMealCommandHandler = scope.ServiceProvider.GetRequiredService<ICommandHandler<CreateMealCommand>>();
        var searchProductsQueryHandler = scope.ServiceProvider.GetRequiredService<SearchProductsQueryHandler>();
        var mealInitializer = new MealsInitializer(createMealCommandHandler, searchProductsQueryHandler);
        foreach (var userId in repo.GetAll().Select(x => x.UserId))
            await mealInitializer.SeedMealsCatalogue(userId, 50);
    }

    private async Task AddDemoUsersAsync(IServiceScope scope)
    {
        var usersToAdd = _config.GetSection("Demo:DemoUsersMails").GetChildren().Select(x => x.Value).ToList();
        var addUserCommandHandler = scope.ServiceProvider.GetRequiredService<RegisterUserCommandHandler>();
        foreach (var userToAdd in usersToAdd)
        {
            var command = new UserForRegistrationDto
            {
                Email = userToAdd,
                Password = "zaq1@WSX",
                ConfirmPassword = "zaq1@WSX"
            };
            await addUserCommandHandler.HandleAsync(command, CancellationToken.None);
        }
    }

    private async Task<List<UserInfo>> GetDemoUsersIdsAsync(IServiceScope scope)
    {
        var usersToAddMails = _config.GetSection("Demo:DemoUsersMails").GetChildren().Select(x => x.Value).ToList();
        var result = new List<UserInfo>();
        var getUserIdQueryHandler = scope.ServiceProvider.GetRequiredService<GetUserIdByEmailHandlerQueryHandler>();
        foreach (var userMail in usersToAddMails)
        {
            var userId = await getUserIdQueryHandler.HandleAsync(new GetUserIdByEmailQuery(userMail));
            result.Add(new UserInfo(Guid.Parse(userId), userMail));
        }
        return result;
    }

    private async Task AddNutritionistRegistrationRequests(IServiceScope scope, UserInfoRepository repo)
    {
        var nutritionistMails = _config.GetSection("Demo:NutritionistsMails").GetChildren().Select(x => x.Value).ToList();
        var handler = scope.ServiceProvider.GetRequiredService<ICommandHandler<RegisterNutritionistCommand>>();
        var faker = new Bogus.Faker("pl");
        foreach (var mail in nutritionistMails)
        {
            var request = new RegisterNutritionistRequest
            {
                City = faker.Address.City(),
                Email = mail,
                Name = faker.Name.FirstName(),
                Surname = faker.Name.LastName(),
                TermsAndConditionsAccepted = true,
                Attachments = new List<Nutritionist.Storage.Attachment>
                {
                    new Nutritionist.Storage.Attachment("file1", "content")
                }
            };
            var command = new RegisterNutritionistCommand(repo.FindByUserMail(mail).UserId, request);
            await handler.HandleAsync(command, CancellationToken.None);
        }
    }

    private record UserInfo(Guid UserId, string UserMail);

    private class UserInfoRepository
    {
        private readonly IEnumerable<UserInfo> _data;

        public UserInfoRepository(IEnumerable<UserInfo> data)
        {
            _data = data;
        }

        internal IEnumerable<UserInfo> GetAll()
        {
            return _data;
        }

        internal IEnumerable<Guid> GetUserGuids()
        {
            return _data.Select(x => x.UserId).ToList();
        }

        internal IEnumerable<string> GetUserMails()
        {
            return _data.Select(x => x.UserMail).ToList();
        }

        internal UserInfo FindByUserMail(string mail)
        {
            return _data.Single(entry => entry.UserMail == mail);
        }

        internal UserInfo FindByUserGuid(Guid guid)
        {
            return _data.Single(entry => entry.UserId == guid);
        }
    }
}

public static class NutritionDiaryConfig
{
    public static void AddNutritionDiary(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<GetNutritionDayQueryHandler>();
        services.AddTransient<GetShortSummaryForDaysQueryHandler>();
        services.AddTransient<SaveMealNutritionEntriesCommandHandler>();
        services.AddTransient<ICommandHandler<RemoveNutritionEntryCommand>, RemoveNutritionEntryCommandHandler>();
        services.AddTransient<ICommandHandler<SaveMealNutritionEntriesCommand>>(ctx =>
            new TransactionalSaveMealNutritionEntriesCommandHandler(
                ctx.GetRequiredService<SaveMealNutritionEntriesCommandHandler>(),
                ctx.GetRequiredService<NutritionContextTransactions>()));

        services.AddDbContext<NutritionDiaryDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
    }

    public static IEndpointRouteBuilder MapNutritionDiaryEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapGetShortSummaryEndpoint();
        endpointRouteBuilder.MapGetNutritionDayDetails();
        endpointRouteBuilder.MapAddNutritionEntriesEndpoint();
        endpointRouteBuilder.MapRemoveNutritionEntryEndpoint();

        return endpointRouteBuilder;
    }

    public static void AddUsers(this WebApplication app, IConfiguration config)
    {
        var usersToAdd = config.GetValue<List<string>>("Demo:DemoUsersMails");
        var addUserCommandHandler = app.Services.GetRequiredService<RegisterUserCommandHandler>();
        if (usersToAdd == null)
            return;

        foreach (var userToAdd in usersToAdd)
        {
            var command = new UserForRegistrationDto
            {
                Email = userToAdd,
                Password = "zaq1@WSX",
                ConfirmPassword = "zaq1@WSX"
            };
            addUserCommandHandler.HandleAsync(command, CancellationToken.None).GetAwaiter().GetResult();
        }
    }

    private static List<Guid> GetDemoUsersIds(this WebApplication app, IConfiguration config)
    {
        var usersToAdd = config.GetValue<List<string>>("Demo:DemoUsersMails");
        if (usersToAdd == null)
            return [];

        var result = new List<Guid>();
        var getUserIdQueryHandler = app.Services.GetRequiredService<GetUserIdByEmailHandlerQueryHandler>();
        foreach (var userToAdd in usersToAdd)
        {
            var userId = getUserIdQueryHandler.HandleAsync(new GetUserIdByEmailQuery(userToAdd)).GetAwaiter().GetResult();
            result.Add(Guid.Parse(userId));
        }
        return result;
    }

    public static async Task AddDishesAsync(this WebApplication app, IConfiguration config)
    {
        using var scope = app.Services.CreateScope();
        var searchProductsQueryHandler = scope.ServiceProvider.GetRequiredService<SearchProductsQueryHandler>();
        var createMealCommandHandler = scope.ServiceProvider.GetRequiredService<ICommandHandler<CreateMealCommand>>();
        var mealInitializer = new MealsInitializer(createMealCommandHandler, searchProductsQueryHandler);

        var users = GetDemoUsersIds(app, config);
        foreach (var user in users)
        {
            await mealInitializer.SeedMealsCatalogue(user, 10);
        }
    }

    public static void AddNutritionDiaryEntries(this WebApplication application, IConfiguration configuration)
    {
        using (var scope = application.Services.CreateScope())
        {
            var getUserIdQueryHandler = scope.ServiceProvider.GetRequiredService<GetUserIdByEmailHandlerQueryHandler>();
            var searchProductsQueryHandler = scope.ServiceProvider.GetRequiredService<SearchProductsQueryHandler>();
            var addProductToDiaryCommandHandler = scope.ServiceProvider.GetRequiredService<ICommandHandler<SaveMealNutritionEntriesCommand>>();
            var superuserId = getUserIdQueryHandler.HandleAsync(new GetUserIdByEmailQuery(configuration.GetValue<string>("Administrator:Email"))).GetAwaiter().GetResult();
            AddNutritionEntries(superuserId, searchProductsQueryHandler, addProductToDiaryCommandHandler, DateTime.Today).GetAwaiter().GetResult();
            AddNutritionEntries(superuserId, searchProductsQueryHandler, addProductToDiaryCommandHandler, DateTime.Today.AddDays(-1)).GetAwaiter().GetResult();
        }
    }

    private static async Task AddNutritionEntries(string userId,
        SearchProductsQueryHandler searchProducts,
        ICommandHandler<SaveMealNutritionEntriesCommand> addNutritionEntriesCommandHandler,
        DateTime day)
    {
        var products = (await searchProducts.HandleAsync(new SearchProductsQuery(""), CancellationToken.None)).Products;
        if (!products.Any())
            return;
        var command = new SaveMealNutritionEntriesCommand(
                       new[]
                       {
                new MealEntry(products.First().Guid, 100, CatalogueItemType.Product),
                new MealEntry(products.Last().Guid, 200, CatalogueItemType.Product)
            },
            MealType.Breakfast,
            day,
            Guid.Parse(userId)
        );
        var command2 = new SaveMealNutritionEntriesCommand(
                       new[]
                       {
                new MealEntry(products.First().Guid, 250, CatalogueItemType.Product),
                new MealEntry(products.Last().Guid, 300, CatalogueItemType.Product)
            },
            MealType.Supper,
            day,
            Guid.Parse(userId)
        );

        await addNutritionEntriesCommandHandler.HandleAsync(command, CancellationToken.None);
        await addNutritionEntriesCommandHandler.HandleAsync(command2, CancellationToken.None);
    }
}