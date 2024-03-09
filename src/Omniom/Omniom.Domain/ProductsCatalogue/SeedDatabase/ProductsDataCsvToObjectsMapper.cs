using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;


namespace Omniom.Domain.ProductsCatalogue.SeedDatabase
{
    public static class ProductsDataCsvToObjectsMapper
    {
        public static List<ProductImportDto> MapCsvContentToProductsImportDtos(string filePath)
        {
            var configuration = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";"
            };

            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader, configuration))
            {
                csv.Context.RegisterClassMap<ProductImportDtoMap>();

                return csv.GetRecords<ProductImportDto>().ToList();
            }
        }

        internal sealed class ProductImportDtoMap : ClassMap<ProductImportDto>
        {
            public ProductImportDtoMap()
            {
                Map(m => m.Code).Name("code");
                Map(m => m.ProductNamePl).Name("product_name_pl");
                Map(m => m.ProductNameEn).Name("product_name_en");
                Map(m => m.GenericNameEn).Name("generic_name_en");
                Map(m => m.GenericNamePl).Name("generic_name_pl");
                Map(m => m.Quantity).Name("quantity");
                Map(m => m.ServingSize).Name("serving_size");
                Map(m => m.Brands).Name("brands");
                Map(m => m.Categories).Name("categories");
                Map(m => m.CategoriesTags).Name("categories_tags");
                Map(m => m.Countries).Name("countries");
                Map(m => m.CountriesTags).Name("countries_tags");
                Map(m => m.OriginsTags).Name("origins_tags");
                Map(m => m.EnergyKcalValue).Name("energy-kcal_value");
                Map(m => m.EnergyKcalUnit).Name("energy-kcal_unit");
                Map(m => m.FatValue).Name("fat_value");
                Map(m => m.FatUnit).Name("fat_unit");
                Map(m => m.SaturatedFatValue).Name("saturated-fat_value");
                Map(m => m.SaturatedFatUnit).Name("saturated-fat_unit");
                Map(m => m.CarbohydratesValue).Name("carbohydrates_value");
                Map(m => m.CarbohydratesUnit).Name("carbohydrates_unit");
                Map(m => m.SugarsValue).Name("sugars_value");
                Map(m => m.SugarsUnit).Name("sugars_unit");
                Map(m => m.FiberValue).Name("fiber_value");
                Map(m => m.FiberUnit).Name("fiber_unit");
                Map(m => m.ProteinsValue).Name("proteins_value");
                Map(m => m.ProteinsUnit).Name("proteins_unit");
                Map(m => m.SaltValue).Name("salt_value");
                Map(m => m.SaltUnit).Name("salt_unit");
            }
        }
    }

    public record ProductImportDto
    {
        public string Code { get; set; }
        public string ProductNamePl { get; set; }
        public string ProductNameEn { get; set; }
        public string GenericNameEn { get; set; }
        public string GenericNamePl { get; set; }
        public string Quantity { get; set; }
        public string ServingSize { get; set; }
        public string Brands { get; set; }
        public string Categories { get; set; }
        public string CategoriesTags { get; set; }
        public string Countries { get; set; }
        public string CountriesTags { get; set; }
        public string OriginsTags { get; set; }
        public decimal EnergyKcalValue { get; set; }
        public string EnergyKcalUnit { get; set; }
        public decimal FatValue { get; set; }
        public string FatUnit { get; set; }
        public decimal? SaturatedFatValue { get; set; }
        public string SaturatedFatUnit { get; set; }
        public decimal CarbohydratesValue { get; set; }
        public string CarbohydratesUnit { get; set; }
        public decimal? SugarsValue { get; set; }
        public string SugarsUnit { get; set; }
        public decimal? FiberValue { get; set; }
        public string FiberUnit { get; set; }
        public decimal ProteinsValue { get; set; }
        public string ProteinsUnit { get; set; }
        public decimal? SaltValue { get; set; }
        public string SaltUnit { get; set; }
    }
}