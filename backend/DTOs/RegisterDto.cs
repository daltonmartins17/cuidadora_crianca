namespace CuidadoraDeCrianca.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string UserType { get; set; } = null!; // "Parent" ou "BabySitter"
        public string PhoneNumber { get; set; } = null!;
    }
}
