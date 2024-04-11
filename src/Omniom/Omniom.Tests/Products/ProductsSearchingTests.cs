using Newtonsoft.Json;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Products;

[TestFixture]
public class ProductsSearchingTests : BaseIntegrationTestsFixture
{
    private SearchProductsQueryHandler SearchProductsQueryHandler => _omniomApp.SearchProductsQueryHandler;

    [Test]
    public async Task ShouldSearchProductsByName_ReturnProductsWhichMatchesNameOrGenericName()
    {
        var query = new SearchProductsQuery("Tortil");
        var endpoint = "/api/products";

        var result = await _omniomApp.CreateHttpClient().GetAsync($"{endpoint}?search={query.Name}");

        result.EnsureSuccessStatusCode();
        var responseContent = await result.Content.ReadAsStringAsync();
        var response = JsonConvert.DeserializeObject<SearchProductsResponse>(responseContent);
        Assert.That(response.Products.Count, Is.EqualTo(6));
    }

    [TestCase(5, 2, 1)]
    [TestCase(2, 4, 0)]
    [TestCase(10, 1, 6)]
    [TestCase(1, 6, 1)]
    public async Task ShouldPaginateFetchedProductsCorrecly(int pageSize, int pageNumber, int expectedResultsCount)
    {
        var allTortillasProductsCount = 6;
        var query = new SearchProductsQuery("Tortil", pageSize, pageNumber);

        var result = await SearchProductsQueryHandler.HandleAsync(query, CancellationToken.None);

        Assert.That(result.TotalCount, Is.EqualTo(allTortillasProductsCount));
        Assert.That(result.Page, Is.EqualTo(pageNumber));
        Assert.That(result.PageSize, Is.EqualTo(pageSize));
        Assert.That(result.Products.Count(), Is.EqualTo(expectedResultsCount));
    }
}
