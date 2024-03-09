using Microsoft.VisualStudio.TestPlatform.ObjectModel;
using Omniom.Domain.ProductsCatalogue.SeedDatabase;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Products;

public class ProductsCatalogueSeedingTests
{
    private OmniomApp _app = default!;

    internal record UnitTranslation(string Unit, decimal ConversionRatio);


    [TestCase("320 g (450 ml)", 320)]
    [TestCase("168 g (3 x 56 g) (przed odsączeniem 240 g (3 x 80 g)", 168)]
    [TestCase("480 g + 30 g sos", 480)]
    [TestCase("275 ml", 275)]
    [TestCase("0,7 l", 700)]
    public void ShouldConvertProductQuantityAndServingSizeFromAnotherUnitToGrams(string input, int expectedValueInGrams)
    {
        Assert.That(QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(input).Result, Is.EqualTo(expectedValueInGrams));
    }


    [TestCase("2", 2)]
    [TestCase("10", 10)]
    [TestCase("350,2", 350)]
    [TestCase("90.879", 90)]
    public void ShouldMarkUnitAsGramsWhenNotProvided(string input, int expectedValueInGrams)
    {
        Assert.That(QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(input).Result, Is.EqualTo(expectedValueInGrams));
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
    public void ShouldThrowArgumentExceptionWhenInvalidInputIsProvided(string input)
    {
        Assert.That(QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(input).HasError, Is.True);
    }
}
