namespace Omniom.Domain.ProductsCatalogue.Storage;

public record ProductData
{
    public int Id { get; init; }
    public Guid Guid { get; init; }
    public string Code { get; set; }
    public string ProductNamePl { get; set; }
    public string GenericNamePl { get; set; }
    public string Brands { get; set; }
    public string Categories { get; set; }
    public string CategoriesTags { get; set; }
    public int ServingSizeG { get; set; }
    public int? QuantityG { get; set; }
    public decimal EnergyKcal { get; set; }
    public decimal FatValueG { get; set; }
    public decimal ProteinsValueG { get; set; }
    public decimal CarbohydratesValueG { get; set; }
    public decimal? SaturatedFatValueG { get; set; }
    public decimal? SugarsValueG { get; set; }
    public decimal? FiberValueG { get; set; }
    public decimal? SaltValueG { get; set; }
}

