using server_chat_app.Models;

namespace server_chat_app.DTOs;

public class ChannelDTO
{
    public MessageTypeEnum MessageType { get; set; }
    public string? Content { get; set; }
    public string? FileUrl { get; set; }

    public string SenderId { get; set; } 
    public string ChannelId { get; set; } 
}