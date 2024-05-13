using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Nutritionist.Storage;
using Omniom.Domain.Shared.Extensions;
using System.Text.RegularExpressions;

namespace Omniom.Domain.Nutritionist.Verification.GettingAttachmentDetails;
internal static class Route
{
    internal static IEndpointRouteBuilder MapGetAttachmentDetailsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(NutritionistRoutes.GetAttachmentDetails, async (
            HttpContext context,
            [FromRoute] Guid requestId,
            [FromRoute] int attachmentId,
            [FromServices] IQueryable<NutritionistVerificationRequest> verificationRequests,
            CancellationToken ct) =>
        {
            var request = await verificationRequests
                .Include(x => x.Attachments)
                .FirstOrDefaultAsync(x => x.Guid == requestId, ct);

            if (request == null)
            {
                return Results.NotFound();
            }

            var attachment = request.Attachments.FirstOrDefault(x => x.Id == attachmentId);
            if (attachment == null)
            {
                return Results.NotFound();
            }

            var base64Data = Regex.Match(attachment.Attachment.FileContentBase64Encoded, @"data:application/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
            var binData = Convert.FromBase64String(base64Data);

            return Results.File(binData, "application/pdf", attachment.Attachment.FileName);
        }).RequireAdministratorRole();
        return endpoints;
    }
}
