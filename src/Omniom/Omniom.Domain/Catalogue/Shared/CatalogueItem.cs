using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Catalogue.Products.Storage;

namespace Omniom.Domain.Catalogue.Shared;
public interface ICatalogueItem
{
    Guid Guid { get; set; }
    string Name { get; set; }
    string Type { get; }
    decimal PortionInGrams { get; set; }
    decimal KcalPer100G { get; set; }
    decimal ProteinsPer100G { get; set; }
    decimal FatsPer100G { get; set; }
    decimal CarbohydratesPer100G { get; set; }
    decimal KcalPerPortion { get; set; }
    decimal ProteinsPerPortion { get; set; }
    decimal FatsPerPortion { get; set; }
    decimal CarbohydratesPerPortion { get; set; }
}

public abstract class BaseCatalogueItem : ICatalogueItem
{
    public Guid Guid { get; set; }
    public string Name { get; set; }
    public abstract string Type { get; }
    public decimal PortionInGrams { get; set; }
    public decimal KcalPer100G { get; set; }
    public decimal ProteinsPer100G { get; set; }
    public decimal FatsPer100G { get; set; }
    public decimal CarbohydratesPer100G { get; set; }
    public decimal KcalPerPortion { get; set; }
    public decimal ProteinsPerPortion { get; set; }
    public decimal FatsPerPortion { get; set; }
    public decimal CarbohydratesPerPortion { get; set; }
}

public class MealCatalogueItem : BaseCatalogueItem
{
    public MealCatalogueItem()
    {
        
    }
    public MealCatalogueItem(Meal meal)
    {
        Guid = meal.Guid;
        Name = meal.Name;
        KcalPer100G = meal.Ingredients.Sum(x => x.KcalPer100g);
        ProteinsPer100G = meal.Ingredients.Sum(x => x.ProteinsPer100g);
        FatsPer100G = meal.Ingredients.Sum(x => x.FatsPer100g);
        CarbohydratesPer100G = meal.Ingredients.Sum(x => x.CarbohydratesPer100g);
        KcalPerPortion = meal.Ingredients.Sum(x => x.Kcal);
        ProteinsPerPortion = meal.Ingredients.Sum(x => x.Proteins);
        FatsPerPortion = meal.Ingredients.Sum(x => x.Fats);
        CarbohydratesPerPortion = meal.Ingredients.Sum(x => x.Carbohydrates);
        
        Description = meal.Description;
        Recipe = meal.Recipe;
        Portions = meal.Portions;
        PortionInGrams = meal.Ingredients.Sum(i => i.PortionInGrams) / Portions;
        Ingredients = meal.Ingredients;
    }

    public int Portions { get; set; }
    public string Description { get; set; }
    public string Recipe { get; set; }

    public override string Type => "Meal";

    public IEnumerable<MealIngredient> Ingredients { get; set; }
}

public class ProductCatalogItem : BaseCatalogueItem
{
    public string ProductName { get; set; }
    public string Brands { get; set; }
    public string Code { get; set; }
    public string CategoriesTags { get; set; }

    public override string Type => "Product";

    public ProductCatalogItem()
    {
        
    }
    public ProductCatalogItem(ProductData productData)
    {
        Guid = productData.Guid;
        Name = $"{productData.ProductNamePl} [{productData.Brands}]";
        PortionInGrams = productData.ServingSizeG;
        KcalPer100G = productData.EnergyKcal;
        ProteinsPer100G = productData.ProteinsValueG;
        FatsPer100G = productData.FatValueG;
        CarbohydratesPer100G = productData.CarbohydratesValueG;
        KcalPerPortion = productData.EnergyKcal * productData.ServingSizeG / 100;
        ProteinsPerPortion = productData.ProteinsValueG * productData.ServingSizeG / 100;
        FatsPerPortion = productData.FatValueG * productData.ServingSizeG / 100;
        CarbohydratesPerPortion = productData.CarbohydratesValueG * productData.ServingSizeG / 100;
        Brands = productData.Brands;
        Code = productData.Code;
        CategoriesTags = productData.CategoriesTags;
        ProductName = productData.ProductNamePl;
    }
}
