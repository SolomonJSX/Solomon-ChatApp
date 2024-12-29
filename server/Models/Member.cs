namespace server_chat_app.Models;

public class Member
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? MemberId { get; set; }
    
    public string ChannelId { get; set; } = null!;
    public Channel Channel { get; set; } = null!;
}