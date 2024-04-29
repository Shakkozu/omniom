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

    public string ErrorMessage
    {
        get
        {
            var sb = new StringBuilder();
            if (TotalSizeExceedsLimit)
            {
                sb.Append("Total size of attachments exceeds the limit. ");
            }
            if (TooLargeFilesCount > 0)
            {
                sb.Append($"Too large files count: {TooLargeFilesCount}. ");
            }
            if (FilesWithInvalidExtensions.Count > 0)
            {
                sb.Append($"Files with invalid extensions: {string.Join(", ", FilesWithInvalidExtensions)}. ");
            }
            return sb.ToString();
        }
    }
}
public class AttachmentsValidator
{
    private readonly AttachmentsValidatorConfig _validatorConfig;

    public AttachmentsValidator(AttachmentsValidatorConfig? validatorConfig = null)
    {
        _validatorConfig = validatorConfig ?? AttachmentsValidatorConfig.Default;
    }

    public AttachmentsValidationResult ValidateFiles(string[] files)
    {
        var filesWithInvalidExtensions = new List<string>();
        var tooLargeFilesCount = 0;
        var totalSize = 0;

        if(files == null || files.Length == 0)
            return new AttachmentsValidationResult();

        foreach (var file in files)
        {
            if (!file.StartsWith("data:application/pdf;base64,"))
            {
                filesWithInvalidExtensions.Add(file);
            }
            else
            {
                var base64Data = Regex.Match(file, @"data:application/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
                var binData = Convert.FromBase64String(base64Data);
                var fileSize = binData.Length;

                if (fileSize > _validatorConfig.MaximumAllowedAttachmentSizeInMB * 1024 * 1024)
                {
                    tooLargeFilesCount++;
                }

                totalSize += fileSize;
            }
        }

        var totalSizeExceedsLimit = totalSize > _validatorConfig.MaximumAllowedAttachmentsTotalSizeInMB * 1024 * 1024;

        return new AttachmentsValidationResult
        {
            FilesWithInvalidExtensions = filesWithInvalidExtensions,
            TooLargeFilesCount = tooLargeFilesCount,
            TotalSizeExceedsLimit = totalSizeExceedsLimit
        };
    }

}
