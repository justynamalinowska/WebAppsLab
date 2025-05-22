namespace DTO
{
    public class ExternalLoginRequest
    {
        public string Provider { get; set; } = "Google";
        public string IdToken  { get; set; } = null!;
    }
}