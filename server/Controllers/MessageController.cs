using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace server_chat_app.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessageController(ChatAppDbContext dbContext) : ControllerBase
{
    [HttpPost("get-messages")]
    [Authorize]
    [UserIdFilter]
    public async Task<ActionResult> GetMessages(string? userId, MessageUserIdDTO messageUserId)
    {
        try
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(messageUserId.Id))
            {
                return BadRequest("Both ID's required.");
            }

            var user1 = userId;
            var user2 = messageUserId.Id;

            var messages = await dbContext.Messages.AsNoTracking()
                .Include(m => m.Sender)
                .Include(m => m.Recipient)
                .Where(m => (m.SenderId == user1 && m.RecipientId == user2) ||
                            (m.SenderId == user2 && m.RecipientId == user1))
                .OrderBy(m => m.TimeStamp)
                .ToListAsync();
            
            return Ok(new MessagesResponseDTO(messages));
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(ex.Message);
        }
    }
}