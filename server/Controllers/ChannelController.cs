using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server_chat_app.Models;

namespace server_chat_app.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChannelController(ChatAppDbContext dbContext) : ControllerBase
{
    [HttpGet("get-channel-messages/{channelId}")]
    [Authorize]
    [UserIdFilter]
    public async Task<IActionResult> GetChannelMessages(string channelId)
    {
        try
        {
            var messages = await dbContext.Messages
                .AsNoTracking()
                .Include(c => c.Sender)
                .Include(m => m.Channel)
                .Where(m => m.ChannelId == channelId)
                .ToListAsync();
            
            return Ok(new
            {
                Messages = messages,
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("get-user-channels")]
    [Authorize]
    [UserIdFilter]
    public async Task<ActionResult> GetUserChannels(string? userId)
    {
        try
        {
            if (string.IsNullOrEmpty(userId)) return NotFound("UserId not found exists");
            
            var channels = await dbContext.Channels
                .AsNoTracking()
                .Include(c => c.Members)
                .Where(c => c.AdminId == userId || c.Members.Any(m => m.MemberId == userId))
                .Select(c => new
                {
                    Id = c.Id,
                    Name = c.Name,
                    Members = c.Members.Select(m => dbContext.Users.AsNoTracking().FirstOrDefault(u => u.Id == m.MemberId)).ToList(),
                    AdminId = c.AdminId,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                })
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();
            
            return Ok(new
            {
                Channels = channels,
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("create-channel")]
    [Authorize]
    [UserIdFilter]
    public async Task<ActionResult> CreateChannel(CreateChannelRequest request, string? userId)
    {
        try
        {
            if (string.IsNullOrEmpty(userId)) return BadRequest("UserId is required");

            var admin = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        
            if (admin is null) return NotFound("Admin user not found");

            var validMembers = await dbContext.Users.AsNoTracking()
                .Where(u => request.MembersIdList.Contains(u.Id))
                .Select(u => new Member() {MemberId = u.Id})
                .ToListAsync();

            if (validMembers.Count != request.MembersIdList.Count) return BadRequest("Some members are not valid.");

            var newChannel = new Channel()
            {
                Name = request.Name,
                AdminId = userId,
                Members = validMembers,
                UpdatedAt = DateTime.Now
            };
        
            var newChannelEntity = await dbContext.Channels.AddAsync(newChannel);
            await dbContext.SaveChangesAsync();
        
            return Ok(new
            {
                Channel = newChannelEntity.Entity
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}

public record CreateChannelRequest(string Name, List<string> MembersIdList);