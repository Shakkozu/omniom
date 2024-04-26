using NUnit.Framework;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using System;
namespace Omniom.Tests.Nutritionist;

[TestFixture]
public class FileValidatorTests
{
    [Test]
    public void ValidationShouldFailWhenAttachmentSizeExceedsMaximumAllowedAttachmentSize()
    {
        var validatorConfig = AttachmentsValidatorConfig.Default;
        var validator = new AttachmentsValidator(validatorConfig);
        var megabyte = 1024 * 1024;
        var largePdfFile = "data:application/pdf;base64," + Convert.ToBase64String(new byte[validatorConfig.MaximumAllowedAttachmentSizeInMB * megabyte + 1]);

        var result = validator.ValidateFiles(new string[] { largePdfFile });

        Assert.That(result.TooLargeFilesCount, Is.EqualTo(1));
        Assert.That(result.IsValid, Is.EqualTo(false));
    }

    [Test]
    public void ValidationShouldFailWhenAttachmentsTotalSizeExceedsMaximumAllowedAttachmentsTotalSize()
    {
        var validatorConfig = AttachmentsValidatorConfig.Default;
        var validator = new AttachmentsValidator(validatorConfig);
        var megabyte = 1024 * 1024;
        var largePdfFile = "data:application/pdf;base64," + Convert.ToBase64String(new byte[validatorConfig.MaximumAllowedAttachmentSizeInMB * megabyte - 1]);
        var files = new string[] { largePdfFile, largePdfFile, largePdfFile, largePdfFile };

        var result = validator.ValidateFiles(files);

        Assert.That(result.TotalSizeExceedsLimit, Is.EqualTo(true));
        Assert.That(result.IsValid, Is.EqualTo(false));
    }

    [Test]
    public void ValidationShouldFailWhenAttachmentsContainsNotAllowedFormat()
    {
        var validatorConfig = AttachmentsValidatorConfig.Default;
        var validator = new AttachmentsValidator(validatorConfig);
        var files = new string[] { "data:application/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" };

        var result = validator.ValidateFiles(files);

        Assert.That(result.FilesWithInvalidExtensions.Count, Is.EqualTo(1));
        Assert.That(result.IsValid, Is.EqualTo(false));
    }

    [Test]
    public void ValidationShouldPassWhenFileExtensionAndSizeIsValid()
    {
        var validatorConfig = AttachmentsValidatorConfig.Default;
        var validator = new AttachmentsValidator(validatorConfig);
        var validPdfFile = "data:application/pdf;base64," + new String('A', 3 * 1024 * 1024);
        var files = new string[] { validPdfFile };

        var result = validator.ValidateFiles(files);

        Assert.That(result.FilesWithInvalidExtensions.Count, Is.EqualTo(0));
        Assert.That(result.TooLargeFilesCount, Is.EqualTo(0));
        Assert.That(result.TotalSizeExceedsLimit, Is.EqualTo(false));
        Assert.That(result.IsValid, Is.EqualTo(true));
    }
}
