namespace Omniom.Domain.Shared.Exceptions;
public class ResourceNotFoundException : Exception
{
    public ResourceNotFoundException(string message) : base(message)
    {
    }
}