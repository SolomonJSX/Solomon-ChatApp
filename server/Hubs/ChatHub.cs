using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server_chat_app.Models;

namespace server_chat_app.Hubs;

public class ChatHub(ChatAppDbContext dbContext) : Hub
{
    private static Dictionary<string, string> userSocketMap = new();

    public async Task SendMessage(MessageDTO messageDTO)
    {
        var message = new Message()
        {
            SenderId = messageDTO.SenderId,
            RecipientId = messageDTO.RecipientId,
            Content = messageDTO.Content,
            FileUrl = messageDTO.FileUrl,
            MessageType = messageDTO.MessageType,
        };

        var messageEntity = await dbContext.Messages.AddAsync(message);
        await dbContext.SaveChangesAsync();
        var createdMessage = messageEntity.Entity;

        var messageData = await dbContext.Messages
            .Include(m => m.Sender)
            .Include(m => m.Recipient)
            .FirstOrDefaultAsync(m => m.Id == createdMessage.Id);

        if (messageData != null)
        {
            await Clients.Users(messageDTO.RecipientId, messageDTO.SenderId).SendAsync("ReceiveMessage", messageData);
        }
    }

    public override Task OnConnectedAsync()
    {
        var userId = Context?.User?.FindFirst("userId")?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            userSocketMap[userId] = Context.ConnectionId;
            Console.WriteLine($"User connected: {userId} with connectionId: {userSocketMap[userId]}");
        }
        else
        {
            Console.WriteLine("User ID not provided during connection.");
        }

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = userSocketMap.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;

        if (!string.IsNullOrEmpty(userId))
        {
            userSocketMap.Remove(userId);
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
        }

        return base.OnDisconnectedAsync(exception);
    }
}