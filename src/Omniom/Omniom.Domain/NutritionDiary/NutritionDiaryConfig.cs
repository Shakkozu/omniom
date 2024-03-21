using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.NutritionDiary.AddProductToDiary;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.ModifyProductPortion;
using Omniom.Domain.NutritionDiary.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Domain.NutritionDiary;
public static class NutritionDiaryConfig
{
    public static void AddNutritionDiary(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<AddProductToDiaryCommandHandler>();
        services.AddTransient<ModifyProductPortionCommandHandler>();
        services.AddTransient<GetDiaryQueryHandler>();

        services.AddDbContext<NutritionDiaryDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
    }
}
