using Microsoft.AspNetCore.SignalR;

namespace server_chat_app.Providers;

public class CustomUserIdProvider : IUserIdProvider
{
    public virtual string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst("userId")?.Value;
    }
}