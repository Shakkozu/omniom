using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Catalogue.Products.Storage;

namespace Omniom.Domain.Catalogue.Shared;
public interface ICatalogueItem
{
    Guid Guid { get; set; }
    string Name { get; set; }
    string Type { get; }
    int PortionInGrams { get; set; }
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
    public int PortionInGrams { get; set; }
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
    public MealCatalogueItem(Meal meal)
    {
        Guid = meal.Guid;
        Name = meal.Name;

        // Calculate total values for the entire meal
        decimal totalKcal = 0;
        decimal totalProteins = 0;
        decimal totalFats = 0;
        decimal totalCarbohydrates = 0;
        decimal totalWeight = 0;

        foreach (var ingredient in meal.Ingredients)
        {
            decimal ingredientWeight = ingredient.PortionInGrams;
            totalWeight += ingredientWeight;

            totalKcal += (ingredient.KcalPer100G / 100m) * ingredientWeight;
            totalProteins += (ingredient.ProteinsPer100G / 100m) * ingredientWeight;
            totalFats += (ingredient.FatsPer100G / 100m) * ingredientWeight;
            totalCarbohydrates += (ingredient.CarbohydratesPer100G / 100m) * ingredientWeight;
        }

        // Calculate per portion values
        KcalPerPortion = Math.Round(totalKcal / meal.Portions, 1);
        ProteinsPerPortion = Math.Round(totalProteins / meal.Portions, 1);
        FatsPerPortion = Math.Round(totalFats / meal.Portions, 1);
        CarbohydratesPerPortion = totalCarbohydrates / meal.Portions;

        // Calculate per 100g values
        KcalPer100G = Math.Round((totalKcal / totalWeight) * 100m, 1);
        ProteinsPer100G = Math.Round((totalProteins / totalWeight) * 100m, 1);
        FatsPer100G = Math.Round((totalFats / totalWeight) * 100m, 1);
        CarbohydratesPer100G = Math.Round((totalCarbohydrates / totalWeight) * 100m, 1);

        Description = meal.Description;
        Recipe = meal.Recipe;
        Portions = meal.Portions;
        PortionInGrams = (int)Math.Round(totalWeight / Portions);
        Ingredients = meal.Ingredients;
    }

    public int Portions { get; set; }
    public string Description { get; set; }
    public string Recipe { get; set; }

    public override string Type => CatalogueItemType.Meal.ToString();

    public IEnumerable<MealIngredient> Ingredients { get; set; }
}


public class ProductCatalogItem : BaseCatalogueItem
{
    public string ProductName { get; set; }
    public string Brands { get; set; }
    public string Code { get; set; }
    public string CategoriesTags { get; set; }

    public override string Type => CatalogueItemType.Product.ToString();

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
