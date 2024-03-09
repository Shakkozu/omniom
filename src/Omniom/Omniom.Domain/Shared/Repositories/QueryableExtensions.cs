namespace Omniom.Domain.Shared.Repositories;
public static class QueryableExtensions
{
    public static IQueryable<TEntity> GetPage<TEntity>(
            this IQueryable<TEntity> query,
            int pageNumber = 1,
            int pageSize = 20
        )
    {
        return query
            .Skip((pageNumber - 1)* pageSize)
            .Take(pageSize);
    }
}
