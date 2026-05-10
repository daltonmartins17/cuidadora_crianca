namespace CuidadoraDeCrianca.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = null!;
        public int ReceiverId { get; set; }
        public string ReceiverName { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Content { get; set; } = null!;
        public bool IsRead { get; set; }
        public DateTime SentAt { get; set; }
    }

    public class CreateMessageDto
    {
        public int ReceiverId { get; set; }
        public string Subject { get; set; } = null!;
        public string Content { get; set; } = null!;
    }
}
