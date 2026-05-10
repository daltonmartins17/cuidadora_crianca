namespace CuidadoraDeCrianca.Models
{
    public class Profile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Location { get; set; } = null!;
        public string City { get; set; } = null!;
        public string District { get; set; } = null!;
        public decimal PricePerHour { get; set; }
        public string Bio { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Certifications { get; set; } = string.Empty;
        public double AverageRating { get; set; } = 0;
        public int TotalReviews { get; set; } = 0;
        public bool IsAvailable { get; set; } = true;
        public string Specializations { get; set; } = string.Empty; // JSON array
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
