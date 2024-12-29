using server_chat_app.Models;

public class MessageDTO 
{
    public MessageTypeEnum MessageType { get; set; }
    public string? Content { get; set; }
    public string? FileUrl { get; set; }

    public string SenderId { get; set; } 
    public string RecipientId { get; set; } 
}