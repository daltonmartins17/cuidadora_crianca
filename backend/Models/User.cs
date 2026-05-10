namespace CuidadoraDeCrianca.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string UserType { get; set; } = null!; // "Parent" ou "BabySitter"
        public string PhoneNumber { get; set; } = null!;
        public string ProfileImageUrl { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public Profile? Profile { get; set; }
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
        public ICollection<Review> ReviewsGiven { get; set; } = new List<Review>();
    }
}
