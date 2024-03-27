namespace Omniom.Domain.Shared.Extensions;
public static class DatetimeExtensions
{
    public static DateTime GetEndOfDay(this DateTime dateTime) => new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 23, 59, 59);
}
