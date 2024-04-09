using Omniom.Domain.NutritionDiary.AddNutritionEntries;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using System.Net.Http.Json;

namespace Omniom.Tests.NutritionDiary;

internal class NutritionDiaryRestClient
{
    private readonly HttpClient _httpClient;

    public NutritionDiaryRestClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<NutritionDayEntryDto>> GetNutritionDayEntries(DateTime dateTime)
    {
        return
            await _httpClient.GetFromJsonAsync<IEnumerable<NutritionDayEntryDto>>($"/api/nutrition-diary/details?nutritionDay={dateTime:yyyy-MM-dd}")
            ?? throw new InvalidOperationException("Fetching nutriiton day entries failed");
    }
    public async Task<IEnumerable<ShortSummary>> GetShortSummaryForDays(DateTime from, DateTime to)
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<ShortSummary>>($"/api/nutrition-diary/summary?datefrom={from:yyyy-MM-dd}&dateTo={to:yyyy-MM-dd}")
            ?? throw new Exception("Fetching short summary for days failed");
    }

    public async Task SaveNutritionEntries(SaveMealNutritionEntriesRequest request)
    {
        await _httpClient.PostAsJsonAsync("/api/nutrition-diary/entries", request);
    }

    public async Task RemoveNutritionEntry(Guid entryId)
    {
        await _httpClient.DeleteAsync($"/api/nutrition-diary/entries/{entryId}");
    }


}
