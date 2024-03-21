using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.FindById;

namespace Omniom.Domain.NutritionDiary.ModifyProductPortion;
public class ModifyProductPortionCommand
{
    public Guid UserId { get; set; }
    public Guid Guid { get; set; }
    public int PortionInGrams { get; set; }
}
public class ModifyProductPortionCommandHandler
{
    private readonly NutritionDiaryDbContext _dbContext;
    private readonly FindProductByIdQueryHandler _findProductByIdQueryHandler;

    public ModifyProductPortionCommandHandler(NutritionDiaryDbContext dbContext, FindProductByIdQueryHandler findProductByIdQueryHandler)
    {
        _dbContext = dbContext;
        _findProductByIdQueryHandler = findProductByIdQueryHandler;
    }
    public async Task HandleAsync(ModifyProductPortionCommand command, CancellationToken ct)
    {
        var entry = _dbContext.DiaryEntries.Single(entry => entry.Guid == command.Guid);
        var productData = await _findProductByIdQueryHandler.HandleAsync(new FindByIdQuery(entry.ProductId), ct);
        entry.ModifyPortion(command.PortionInGrams, productData);

        _dbContext.DiaryEntries.Update(entry);
        await _dbContext.SaveChangesAsync(ct);
    }
}