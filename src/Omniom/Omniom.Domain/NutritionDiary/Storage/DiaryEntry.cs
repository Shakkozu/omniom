﻿using Omniom.Domain.Catalogue.Products.SearchProducts;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Omniom.Domain.NutritionDiary.Storage;

public class DiaryEntry
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public Guid? ProductId { get; set; }
    public Guid UserId { get; set; }
    public string? ProductName { get; set; }
    public int PortionInGrams { get; set; }
    public MealType Meal { get; set; }
    public decimal Calories { get; set; }
    public decimal Proteins { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Fats { get; set; }
    public decimal? Sugars { get; set; }
    public decimal? SaturatedFats { get; set; }
    public DateTime DateTime { get; set; }
    public Guid? UserMealId { get; internal set; }
    public string? UserMealName { get; internal set; }
}