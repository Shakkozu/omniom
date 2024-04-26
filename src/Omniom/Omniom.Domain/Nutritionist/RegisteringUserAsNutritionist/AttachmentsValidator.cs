using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;


public record AttachmentsValidatorConfig(int MaximumAllowedAttachmentSizeInMB, int MaximumAllowedAttachmentsTotalSizeInMB, string[] AllowedAttachmentFormats)
{
    public static AttachmentsValidatorConfig Default => new(
        MaximumAllowedAttachmentSizeInMB: 3,
        MaximumAllowedAttachmentsTotalSizeInMB: 10,
        AllowedAttachmentFormats: ["pdf"]);
}

public record AttachmentsValidationResult
{
    public List<string> FilesWithInvalidExtensions { get; init; } = [];
    public int TooLargeFilesCount { get; init; }
    public bool TotalSizeExceedsLimit { get; init; }

    public bool IsValid => !TotalSizeExceedsLimit && TooLargeFilesCount == 0 && FilesWithInvalidExtensions.Count == 0;
}
public class AttachmentsValidator
{
    private AttachmentsValidatorConfig _validatorConfig;

    public AttachmentsValidator(AttachmentsValidatorConfig validatorConfig)
    {
        _validatorConfig = validatorConfig;
    }

    public AttachmentsValidationResult ValidateFiles(string[] files)
    {
        var filesWithInvalidExtensions = files.Where(file => !file.StartsWith("data:application/pdf;base64,")).ToList();
        var tooLargeFilesCount = files.Count(file =>
        {
            var base64Data = Regex.Match(file, @"data:application/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
            var binData = Convert.FromBase64String(base64Data);
            return binData.Length > _validatorConfig.MaximumAllowedAttachmentSizeInMB * 1024 * 1024;
        });
        var totalSizeExceedsLimit = files.Sum(file =>
        {
            var base64Data = Regex.Match(file, @"data:application/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
            var binData = Convert.FromBase64String(base64Data);
            return binData.Length;
        }) > _validatorConfig.MaximumAllowedAttachmentsTotalSizeInMB * 1024 * 1024;

        return new AttachmentsValidationResult
        {
            FilesWithInvalidExtensions = filesWithInvalidExtensions,
            TooLargeFilesCount = tooLargeFilesCount,
            TotalSizeExceedsLimit = totalSizeExceedsLimit
        };
    }
}
