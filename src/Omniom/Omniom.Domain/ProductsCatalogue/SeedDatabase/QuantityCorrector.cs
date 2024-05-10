using System.Globalization;
using System.Text.RegularExpressions;

namespace Omniom.Domain.ProductsCatalogue.SeedDatabase;

public static class QuantityCorrector
{
    private sealed record UnitTranslation(string Unit, decimal ConversionRatio);

    private static Regex _regex = new Regex("([\\d,\\.]*)\\s?(g|ml|l|kg)?", RegexOptions.Compiled);

    private static List<UnitTranslation> _unitTranslations = [
        new("ml", 1),
        new("l", 1000),
    ];

    public record QuantityCorrectionResults
    {
        public static QuantityCorrectionResults CorrectResultFrom(decimal value) => new QuantityCorrectionResults((int)value, string.Empty);
        public static QuantityCorrectionResults IncorrectResult(string error) => new QuantityCorrectionResults(default, error);
        public QuantityCorrectionResults(int result, string error)
        {
            Value = result;
            Error = error;
        }
        public int Value { get; init; }
        public string Error { get; init; }

        public bool HasError => !string.IsNullOrEmpty(Error);
    }

    public static QuantityCorrectionResults ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(string entry)
    {
        var corrected = entry.Trim().ToLower().Replace(",", ".");
        decimal numericValue;
        if (decimal.TryParse(corrected, CultureInfo.InvariantCulture, out numericValue))
        {
            return QuantityCorrectionResults.CorrectResultFrom(numericValue);
        }
        string valueGroup;

        var match = _regex.Match(corrected);
        if (!match.Success || match.Groups.Count < 2)
            return QuantityCorrectionResults.IncorrectResult($"Provided quantity entry is not correct. Entry: {entry}");

        if (match.Groups.Count < 3 && corrected.All(ch => char.IsDigit(ch)))
        {
            valueGroup = match.Groups[1].Value;
            decimal.TryParse(valueGroup.Replace(".", ","), out numericValue);
            return QuantityCorrectionResults.CorrectResultFrom(numericValue);
        }

        valueGroup = match.Groups[1].Value;
        var unit = match.Groups[2].Value;
        decimal.TryParse(valueGroup.Replace(".", ","), out numericValue);
        if (unit.Trim() == "g")
        {
            return QuantityCorrectionResults.CorrectResultFrom(numericValue);
        }

        var translationUnit = _unitTranslations.FirstOrDefault(unit => corrected.Contains(unit.Unit));
        if (translationUnit != null)
        {
            return QuantityCorrectionResults.CorrectResultFrom(numericValue * translationUnit.ConversionRatio);
        }

        return QuantityCorrectionResults.IncorrectResult($"Provided quantity entry is not correct. Entry: {entry}");
    }
}