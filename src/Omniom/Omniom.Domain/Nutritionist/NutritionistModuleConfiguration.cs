using Microsoft.AspNetCore.Routing;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Microsoft.Extensions.Configuration;
using Omniom.Domain.Nutritionist.Storage;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Shared.Repositories;
using Omniom.Domain.Nutritionist.CleaningModule;
using Omniom.Domain.Nutritionist.FetchingProfileDetails;
using Omniom.Domain.Nutritionist.Verification.VerifyingPendingRequests;
using Omniom.Domain.Nutritionist.Verification.GettingAttachmentDetails;
using Omniom.Domain.Nutritionist.Verification.FetchingUserVerificationRequestDetails;
using Omniom.Domain.Nutritionist.Verification.FetchingPendingVerificationRequests;
using Omniom.Domain.Nutritionist.Verification.CreatingVerificationRequests;
using Omniom.Domain.Nutritionist.MealPlans.FetchingMealPlan;
using Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;
using Omniom.Domain.Nutritionist.MealPlans.PublishingMealPlan;

namespace Omniom.Domain.Nutritionist;

public static class NutritionistModuleConfiguration
{
    public static void AddNutritionistModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<RegisterNutritionistCommandHandler>();
        services.AddScoped<ICommandHandler<RegisterNutritionistCommand>, TransactionalRegisterNutritionistCommandHandler>();
        services.AddScoped<ICommandHandler<CreateVerificationRequestCommand>, CreateVerificationRequestCommandHandler>();
        services.AddScoped<ICommandHandler<CleanupNutritionistModuleCommand>, CleanupNutritionistModuleCommandHandler>();
        services.AddScoped<ICommandHandler<VerifyQualificationsCommand>, VerifyQualificationsCommandHandler>();
        services.AddScoped<IQueryHandler<GetPendingVerificationRequestsQuery, List<PendingVerificationListItem>>, GetPendingVerificationRequestsQueryHandler>();
        services.AddScoped<IQueryHandler<GetUserVerificationRequestDetailsQuery, UserVerificationRequestDetails>, GetUserVerificationRequestDetailsQueryHandler>();
        services.AddScoped<IQueryHandler<GetProfileDetailsQuery, GetProfileDetailsResponse>, GetProfileDetailsQueryHandler>();
        services.AddDbContext<NutritionistDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
        services.AddTransient(sp => sp.GetRequiredService<NutritionistDbContext>().Set<NutritionistVerificationRequest>().AsNoTracking());
        services.AddScoped<ITransactions, NutritionistContextTransactions>();

        services.AddScoped<IQueryHandler<GetMealPlanDetails, MealPlan>, GetMealPlanDetailsHandler>();
        services.AddScoped<IQueryHandler<GetMealPlanListQuery, IEnumerable<MealPlanListItem>>, GetMealPlansListQueryHandler>();
        services.AddScoped<ICommandHandler<SaveMealPlanAsDraft>, TransactionalSaveMealPlanAsDraftHandler>();
        services.AddScoped<ICommandHandler<PublishMealPlan>, PublishMealPlanHandler>();
    }

    public static void MapNutritionistEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapRegisterNutritionistEndpoint();
        endpoints.MapCreateVerificationRequestEndpoint();
        endpoints.MapGetPendingVerificationRequestsEndpoint();
        endpoints.MapGetUserVerificationRequestDetailsEndpoint();
        endpoints.MapGetProfileInformationEndpoint();
        endpoints.MapVerifyQualificationsEndpoint();
        endpoints.MapGetAttachmentDetailsEndpoint();

        endpoints.MapGetMealPlansListEndpoint();
        endpoints.MapSaveMealPlanAsDraftEndpoint();
        endpoints.MapGetMealPlanDetailsEndpoint();
        endpoints.MapPublishMealPlanEndpoint();
    }
}