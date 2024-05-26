namespace Omniom.Domain.Catalogue.Meals.Storage;
public record MealIngredient(
    string Name,
    Guid Guid,
    decimal PortionInGrams,
    decimal KcalPer100G,
    decimal ProteinsPer100G,
    decimal CarbohydratesPer100G,
    decimal FatsPer100G)
{
    public decimal Kcal => KcalPer100G * PortionInGrams / 100;
    public decimal Proteins => ProteinsPer100G * PortionInGrams / 100;
    public decimal Carbohydrates => CarbohydratesPer100G * PortionInGrams / 100;
    public decimal Fats => FatsPer100G * PortionInGrams / 100;
}

public record Meal(
    Guid Guid,
    string Name,
    string? Description,
    string? Recipe,
    int Portions,
    List<MealIngredient> Ingredients
       )
{
    internal List<string> GetValidationErros()
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(Name))
        {
            errors.Add("Name is required");
        }
        if (Name.Trim().Length < 3)
        {
            errors.Add("Name must be at least 3 characters long");
        }
        if (Portions <= 0)
        {
            errors.Add("Portions must be greater than 0");
        }
        if (Ingredients == null || !Ingredients.Any())
        {
            errors.Add("At least one ingredient is required");
        }
        return errors;
    }
}

public class UserMealDao
{
    public UserMealDao()
    {
        // required for ef
    }

    public UserMealDao(Meal meal, Guid userId)
    {
        Meal = meal;
        UserId = userId;
    }

    public Guid UserId { get; set; }
    public Meal Meal { get; set; }
    public int Id { get; set; }
}
