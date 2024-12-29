namespace server_chat_app.Models;

public class Message 
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public MessageTypeEnum MessageType { get; set; }
    public string? Content { get; set; }
    public string? FileUrl { get; set; }
    public DateTime TimeStamp { get; set; } = DateTime.UtcNow;

    public string? SenderId { get; set; } 
    public User? Sender { get; set; }
    public string? RecipientId { get; set; } 
    public User? Recipient { get; set; }
    
    public string? ChannelId { get; set; } 
    public Channel? Channel { get; set; } 
}
