namespace CuidadoraDeCrianca.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public int ReviewerUserId { get; set; }
        public int Rating { get; set; } // 1-5
        public string Title { get; set; } = null!;
        public string Comment { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Profile? Profile { get; set; }
        public User? ReviewerUser { get; set; }
    }
}
