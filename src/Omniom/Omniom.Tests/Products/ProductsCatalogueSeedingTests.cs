﻿using Microsoft.VisualStudio.TestPlatform.ObjectModel;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Products.SeedDatabase;
using Omniom.Domain.Catalogue.Products.Storage;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Tests.Shared;
using System.Globalization;

namespace Omniom.Tests.Products;

[TestFixture]
public class ProductsCatalogueSeedingTests : BaseIntegrationTestsFixture
{
    private ImportProductsToCatalogue Importer => _omniomApp.ProductCatalogueImportHandler;
    private SearchProductsQueryHandler SearchProductsHandler => _omniomApp.SearchProductsQueryHandler;

    [Test]
    public async Task ShouldSeedDatabaseWithProductsDataImportFile()
    {
        var importData = ProductsDataCsvToObjectsMapper.MapCsvContentToProductsImportDtos("Products/products_data.csv");
        Importer.SeedDatabase(new ImportProductsToCatalogueCommand(importData));

        var result = await SearchProductsHandler.HandleAsync(new SearchProductsQuery(string.Empty, 10000), CancellationToken.None);

        var resultList = result.Products.ToList().Select(x => x as ProductCatalogItem).ToList();
        Assert.That(importData.Count(), Is.EqualTo(resultList.Count));
        Assert.Multiple(() =>
        {
            foreach (var resultItem in resultList)
            {

                Assert.That(resultItem.Name, Is.Not.Null.Or.Empty, "The Name property is not filled for a result item.");
                Assert.That(resultItem.Code, Is.Not.Null.Or.Empty, "The Code property is not filled for a result item.");
                Assert.That(resultItem.Brands, Is.Not.Null.Or.Empty, "The Brands property is not filled for a result item.");
                Assert.That(resultItem.CategoriesTags, Is.Not.Null.Or.Empty, "The CategoriesTags property is not filled for a result item.");
                Assert.That(resultItem.PortionInGrams, Is.Not.Zero, "The SuggestedPortionSizeG property is not filled for a result item. {0}", resultItem);
                Assert.That(resultItem.KcalPer100G, Is.Not.Zero, "The KcalPer100G property is not filled for a result item {0}.", resultItem);
            }
        });
    }

    [Test]
    public void ShouldMapDtosToDatabaseObjectsCorrectly()
    {
        var importData = AImportData();
        var mapped = importData.Select(dto => dto.MapToProduct()).ToList();

        AssertThatImportedDataMatchesInput(mapped, importData);
    }

    private void AssertThatImportedDataMatchesInput(IEnumerable<ProductData> result, IEnumerable<ProductImportDto> inputData)
    {
        var resultList = result.ToList();
        var inputDataList = inputData.ToList();

        Assert.AreEqual(resultList.Count, inputDataList.Count, "The counts of the result and input data lists are not equal.");

        for (int i = 0; i < inputDataList.Count; i++)
        {
            var inputItem = inputDataList[i];
            var matchingResultItem = resultList.Single(resultItem => resultItem.Code == inputItem.Code);
            var convertedQuantityValue = QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(inputItem.Quantity);
            int? expectedQuantityValue = convertedQuantityValue.HasError ? null : convertedQuantityValue.Value;
            var convertecServingSize = QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(inputItem.ServingSize);
            var expectedServingSizeValue = convertecServingSize.HasError ? 100 : convertecServingSize.Value;
            Assert.Multiple(() =>
            {
                // Compare the properties of the result item with the corresponding properties of the input item
                Assert.That(inputItem.Code, Is.EqualTo(matchingResultItem.Code), $"The Code property of item {i} does not match.");
                Assert.That(inputItem.ProductNamePl, Is.EqualTo(matchingResultItem.ProductNamePl), $"The ProductNamePl property of item {i} does not match.");
                Assert.That(inputItem.Brands, Is.EqualTo(matchingResultItem.Brands), $"The Brands property of item {i} does not match.");
                Assert.That(expectedQuantityValue, Is.EqualTo(matchingResultItem.QuantityG), $"The Quantity property of item {i} does not match.");
                Assert.That(expectedServingSizeValue, Is.EqualTo(matchingResultItem.ServingSizeG), $"The ServingSize property of item {i} does not match.");
                Assert.That(inputItem.CategoriesTags, Is.EqualTo(matchingResultItem.CategoriesTags), $"The CategoriesTags property of item {i} does not match.");
                Assert.That(inputItem.EnergyKcalValue, Is.EqualTo(matchingResultItem.EnergyKcal), $"The EnergyKcalValue property of item {i} does not match.");
                Assert.That(inputItem.FatValue, Is.EqualTo(matchingResultItem.FatValueG), $"The FatValue property of item {i} does not match.");
                Assert.That(inputItem.SaturatedFatValue, Is.EqualTo(matchingResultItem.SaturatedFatValueG), $"The SaturatedFatValue property of item {i} does not match.");
                Assert.That(inputItem.CarbohydratesValue, Is.EqualTo(matchingResultItem.CarbohydratesValueG), $"The CarbohydratesValue property of item {i} does not match.");
                Assert.That(inputItem.SugarsValue, Is.EqualTo(matchingResultItem.SugarsValueG), $"The SugarsValue property of item {i} does not match.");
                Assert.That(inputItem.FiberValue, Is.EqualTo(matchingResultItem.FiberValueG), $"The FiberValue property of item {i} does not match.");
                Assert.That(inputItem.ProteinsValue, Is.EqualTo(matchingResultItem.ProteinsValueG), $"The ProteinsValue property of item {i} does not match.");
                Assert.That(inputItem.SaltValue, Is.EqualTo(matchingResultItem.SaltValueG), $"The SaltValue property of item {i} does not match.");
            });
        }
    }

    private IEnumerable<ProductImportDto> AImportData()
    {
        return new List<ProductImportDto>
                {
                    new ProductImportDto
                    {
                        Code = Guid.NewGuid().ToString("n"),
                        ProductNamePl = "Merci Finest Selection",
                        ProductNameEn = "Merci Finest Selection",
                        GenericNameEn = "",
                        GenericNamePl = "Nadziewane i nienadziewane specjały czekoladowe",
                        Quantity = "250g",
                        ServingSize = "12g",
                        Brands = "Storck",
                        Categories = "Snacks, Sweet snacks, Cocoa and its products, Confectioneries, Chocolate candies, Bonbons, Chocolates, Filled chocolates, Assorted chocolates",
                        CategoriesTags = "en:snacks,en:sweet-snacks,en:cocoa-and-its-products,en:confectioneries,en:chocolate-candies,en:bonbons,en:chocolates,en:filled-chocolates,en:assorted-chocolates",
                        Countries = "Austria, Belgium, Bulgaria, France, Germany, Hungary, Netherlands, North Macedonia, Poland, Romania, Sweden, Switzerland",
                        CountriesTags = "en:austria,en:belgium,en:bulgaria,en:france,en:germany,en:hungary,en:netherlands,en:north-macedonia,en:poland,en:romania,en:sweden,en:switzerland",
                        OriginsTags = "",
                        EnergyKcalValue = 563,
                        EnergyKcalUnit = "kcal",
                        FatValue = 36.1m,
                        FatUnit = "g",
                        SaturatedFatValue = 19.9m,
                        SaturatedFatUnit = "g",
                        CarbohydratesValue = 49.9m,
                        CarbohydratesUnit = "g",
                        SugarsValue = 48m,
                        SugarsUnit = "g",
                        FiberValue = null,
                        FiberUnit = "g",
                        ProteinsValue = 7.8m,
                        ProteinsUnit = "g",
                        SaltValue = 0.17m,
                        SaltUnit = "g"
                    },
                    new ProductImportDto
                    {
                        Code = Guid.NewGuid().ToString("n"),
                        ProductNamePl = "Piątuś bananowy jogurt kremowy",
                        ProductNameEn = "",
                        GenericNameEn = "",
                        GenericNamePl = "",
                        Quantity = "125g",
                        ServingSize = "125g",
                        Brands = "Piątnica",
                        Categories = "Nabiał, Żywność fermentowana, Fermentowane produkty mleczne, Desery, Desery mleczne, Fermentowane desery mleczne, en:Fermented dairy desserts with fruits, Jogurty, Jogurty owocowe, en:Banana yogurts",
                        CategoriesTags = "en:dairies,en:fermented-foods,en:fermented-milk-products,en:desserts,en:dairy-desserts,en:fermented-dairy-desserts,en:fermented-dairy-desserts-with-fruits,en:yogurts,en:fruit-yogurts,en:banana-yogurts",
                        Countries = "Polska",
                        CountriesTags = "en:poland",
                        OriginsTags = "",
                        EnergyKcalValue = 85,
                        EnergyKcalUnit = "kcal",
                        FatValue = 2.3m,
                        FatUnit = "g",
                        SaturatedFatValue = 1.6m,
                        SaturatedFatUnit = "g",
                        CarbohydratesValue = 9.5m,
                        CarbohydratesUnit = "g",
                        SugarsValue = 9.5m,
                        SugarsUnit = "g",
                        FiberValue = 0.7m,
                        FiberUnit = "g",
                        ProteinsValue = 7m,
                        ProteinsUnit = "g",
                        SaltValue = 0.07m,
                        SaltUnit = "g"
                    },
                    new ProductImportDto
                    {
                        Code = Guid.NewGuid().ToString("n"),
                        ProductNamePl = "Kasza manna",
                        ProductNameEn = "",
                        GenericNameEn = "",
                        GenericNamePl = "",
                        Quantity = "400 g",
                        ServingSize = "",
                        Brands = "Janex",
                        Categories = "Żywność i napoje na bazie roślin, Żywność na bazie roślin, Zboża i ziemniaki, Zboża i produkty zbożowe, Kasza",
                        CategoriesTags = "en:plant-based-foods-and-beverages,en:plant-based-foods,en:cereals-and-potatoes,en:cereals-and-their-products,en:groats",
                        Countries = "Polska",
                        CountriesTags = "en:poland",
                        OriginsTags = "",
                        EnergyKcalValue = 353,
                        EnergyKcalUnit = "kcal",
                        FatValue = 1.3m,
                        FatUnit = "g",
                        SaturatedFatValue = 0.18m,
                        SaturatedFatUnit = "g",
                        CarbohydratesValue = 76.7m,
                        CarbohydratesUnit = "g",
                        SugarsValue = 0.1m,
                        SugarsUnit = "g",
                        FiberValue = 2.5m,
                        FiberUnit = "g",
                        ProteinsValue = 8.7m,
                        ProteinsUnit = "g",
                        SaltValue = 0.01m,
                        SaltUnit = "g"
                    },
                    new ProductImportDto
                    {
                        Code = Guid.NewGuid().ToString("n"),
                        ProductNamePl = "Multiwitamina, napój wieloowocowo-marchwiowy",
                        ProductNameEn = "",
                        GenericNameEn = "",
                        GenericNamePl = "",
                        Quantity = "2 l",
                        ServingSize = "250 ml",
                        Brands = "Costa,Hortex",
                        Categories = "Żywność i napoje na bazie roślin, Napoje, Napoje na bazie roślin, Napoje owocowe, Soki i nektary, Soki owocowe",
                        CategoriesTags = "en:plant-based-foods-and-beverages,en:beverages,en:plant-based-beverages,en:fruit-based-beverages,en:juices-and-nectars,en:fruit-juices",
                        Countries = "Polska",
                        CountriesTags = "en:poland",
                        OriginsTags = "",
                        EnergyKcalValue = 15,
                        EnergyKcalUnit = "kcal",
                        FatValue = 0m,
                        FatUnit = "g",
                        SaturatedFatValue = 0m,
                        SaturatedFatUnit = "g",
                        CarbohydratesValue = 3.3m,
                        CarbohydratesUnit = "g",
                        SugarsValue = 3.3m,
                        SugarsUnit = "g",
                        FiberValue = null,
                        FiberUnit = "g",
                        ProteinsValue = 2.4m,
                        ProteinsUnit = "g",
                        SaltValue = 0,
                        SaltUnit = "g"
                    }
                };
    }

    [TestCase("320 g (450 ml)", 320)]
    [TestCase("168 g (3 x 56 g) (przed odsączeniem 240 g (3 x 80 g)", 168)]
    [TestCase("480 g + 30 g sos", 480)]
    [TestCase("4,16g", 4)]
    [TestCase("275 ml", 275)]
    [TestCase("0,7 l", 700)]
    public void ShouldConvertProductQuantityAndServingSizeFromAnotherUnitToGrams(string input, int expectedValueInGrams)
    {
        Assert.That(QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(input).Value, Is.EqualTo(expectedValueInGrams));
    }

    [TestCase("2", 2)]
    [TestCase("10", 10)]
    [TestCase("350,2", 350)]
    [TestCase("90.879", 90)]
    public void ShouldMarkUnitAsGramsWhenNotProvided(string input, int expectedValueInGrams)
    {
        Assert.That(QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(input).Value, Is.EqualTo(expectedValueInGrams));
    }

    [TestCase("10 szt.")]
    [TestCase("25 sztuk")]
    [TestCase("1pcs")]
    [TestCase("8 tranches entames comprises")]
    [TestCase("185/130")]
    [TestCase("12pcs")]
    [TestCase("6 x 4")]
    [TestCase("5 x 30 g")]
    [TestCase("270 h")]
    public void ShouldMarkInputDataAsIncorrectWhenCannotTranslateToGrams(string input)
    {
        Assert.That(QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(input).HasError, Is.True);
    }
}