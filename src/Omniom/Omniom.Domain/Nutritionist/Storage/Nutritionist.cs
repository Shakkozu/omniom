namespace Omniom.Domain.Nutritionist.Storage;

internal class Nutritionist
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public bool IsVerified { get; set; }
    public bool TermsAndConditionsAccepted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}