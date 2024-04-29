using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Omniom.Domain.Nutritionist.Storage;
using Omniom.Domain.Shared.BuildingBlocks;

namespace Omniom.Domain.Nutritionist.CleaningModule;

public record CleanupNutritionistModuleCommand { }

internal class CleanupNutritionistModuleCommandHandler : ICommandHandler<CleanupNutritionistModuleCommand>
{
    private readonly IConfiguration _configuration;
    private readonly NutritionistDbContext _nutritionistDb;

    public CleanupNutritionistModuleCommandHandler(IConfiguration configuration, NutritionistDbContext nutritionistDb)
    {
        _configuration = configuration;
        _nutritionistDb = nutritionistDb;
    }

    public async Task HandleAsync(CleanupNutritionistModuleCommand command, CancellationToken ct)
    {
        var environment = _configuration.GetValue<string>("Environment");
        if (environment != "Automated_Tests")
        {
            throw new InvalidOperationException("This method should only be called in the context of automated tests");
        }

        _nutritionistDb.Nutritionists.RemoveRange(_nutritionistDb.Nutritionists);
        _nutritionistDb.VerificationRequests.RemoveRange(_nutritionistDb.VerificationRequests.Include(x => x.Attachments));
        await _nutritionistDb.SaveChangesAsync(ct);
    }
}
