using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace server_chat_app.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController(ChatAppDbContext dbContext) : ControllerBase
{
    [HttpPost("search")]
    [Authorize]
    [UserIdFilter]
    public async Task<ActionResult> SearchContacts(string? userId, [FromBody] SearchContactsDTO searchContactsDTO)
    {
        if (string.IsNullOrEmpty(searchContactsDTO.SearchTerm)) return NotFound("Search term is required.");

        string pattern = @"[.*+?^${}()|[\]\\]";
        var sanitizedSearchTerm = Regex.Replace(searchContactsDTO.SearchTerm, pattern, @"\$&");

        var lowerCaseSearchTerm = sanitizedSearchTerm.ToLower();

        var contacts = await dbContext.Users.AsNoTracking()
            .Where(user => user.Id.ToString() != userId && (
                user.FirstName!.ToLower().Contains(lowerCaseSearchTerm) ||
                user.LastName!.ToLower().Contains(lowerCaseSearchTerm) ||
                user.Email.ToLower().Contains(lowerCaseSearchTerm)
            )).ToListAsync();

        return Ok(contacts);
    }

    [UserIdFilter]
    [Authorize]
    [HttpGet("get-contacts-for-dm")]
    public async Task<IActionResult> GetContactsForDMList(string? userId)
    {
        if (string.IsNullOrEmpty(userId)) return NotFound("User ID is required.");

        var messages = await dbContext.Messages.AsNoTracking()
            .Where(m => m.SenderId == userId || m.RecipientId == userId)
            .OrderByDescending(m => m.TimeStamp)
            .ToListAsync();

        var contacts = messages
            .GroupBy(m => m.SenderId == userId ? m.RecipientId : m.SenderId)
            .Select(g => new
            {
                _Id = g.Key,
                LastMessageTime = g.Max(m => m.TimeStamp)
            })
            .ToList();

        var userContacts = contacts
            .Join(dbContext.Users, g => g._Id, u => u.Id, (g, u) =>
                new
                {
                    Id = g._Id,
                    LastMessageTime = g.LastMessageTime,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    ImagePath = u.ImagePath,
                    Color = u.Color,
                })
            .OrderByDescending(c => c.LastMessageTime)
            .ToList();

        return Ok(userContacts);
    }

    [HttpGet("get-all-contacts")]
    [UserIdFilter]
    [Authorize]
    public async Task<IActionResult> GetAllContacts(string? userId)
    {
        try
        {
            if (string.IsNullOrEmpty(userId)) return NotFound("User ID is required.");

            var users = await dbContext.Users.AsNoTracking()
                .Where(u => u.Id != userId)
                .Select(u => new
                {
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Id = u.Id,
                    Email = u.Email
                }).ToListAsync();

            var contacts = users
                .Select(u => new
                {
                    Label = !string.IsNullOrEmpty(u.FirstName) ? $"{u.FirstName} {u.LastName}" : u.Email,
                    Value = u.Id
                }).ToList();

            return Ok(new
            {
                Contacts = contacts
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}