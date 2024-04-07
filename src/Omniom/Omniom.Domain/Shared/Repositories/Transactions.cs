using Microsoft.EntityFrameworkCore;
using Omniom.Domain.NutritionDiary.Storage;

namespace Omniom.Domain.Shared.Repositories;

public interface ITransactions
{
    Task<ITransaction> BeginTransactionAsync();
}

public class Transactions : ITransactions
{
    private readonly DbContext _context;

    public Transactions(DbContext context)
    {
        _context = context;
    }

    public async Task<ITransaction> BeginTransactionAsync()
    {
        if (_context.Database.CurrentTransaction == null)
        {
            return new Transaction(
              await _context.Database.BeginTransactionAsync(), _context);
        }
        else
        {
            return new FakeTransaction();
        }
    }
}

public class NutritionContextTransactions : ITransactions
{
    private readonly NutritionDiaryDbContext _context;

    public NutritionContextTransactions(NutritionDiaryDbContext dbContext)
    {
        _context = dbContext;
    }

    public async Task<ITransaction> BeginTransactionAsync()
    {
        if (_context.Database.CurrentTransaction == null)
        {
            return new Transaction(
              await _context.Database.BeginTransactionAsync(), _context);
        }
        else
        {
            return new FakeTransaction();
        }
    }
}