using Microsoft.AspNetCore.Http;

namespace CuidadoraDeCrianca.DTOs
{
    public class ProfileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string City { get; set; } = null!;
        public string District { get; set; } = null!;
        public decimal PricePerHour { get; set; }
        public string Bio { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Certifications { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public bool IsAvailable { get; set; }
        public string UserType { get; set; } = string.Empty;
        public string Specializations { get; set; } = string.Empty;
        public string ProfileImageUrl { get; set; } = string.Empty;
    }

    public class UpdateProfileDto
    {
        public string FullName { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string City { get; set; } = null!;
        public string District { get; set; } = null!;
        public decimal PricePerHour { get; set; }
        public string Bio { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Certifications { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public string Specializations { get; set; } = string.Empty;
        public IFormFile? ProfileImage { get; set; }
    }
}
