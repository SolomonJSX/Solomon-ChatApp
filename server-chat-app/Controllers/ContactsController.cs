using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace server_chat_app.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController(ChatAppDbContext dbContext): ControllerBase
{
    [HttpPost("search")]
    [UserIdFilter]
    public async Task<ActionResult> SearchContacts(string? userId, [FromBody] SearchContactsDTO searchContactsDTO)
    {
        if (string.IsNullOrEmpty(searchContactsDTO.SearchTerm)) return NotFound("Search term is required.");

        string pattern = @"[.*+?^${}()|[\]\\]";
        var sanitizedSearchTerm = Regex.Replace(searchContactsDTO.SearchTerm, pattern, @"\$&");

        var lowerCaseSearchTerm = sanitizedSearchTerm.ToLower();

        var contacts = await dbContext.Users.AsNoTracking()
            .Where(user => user.Id.ToString() != userId && (
                user.FirstName!.ToLower().Contains(lowerCaseSearchTerm) || user.LastName!.ToLower().Contains(lowerCaseSearchTerm) || user.Email.ToLower().Contains(lowerCaseSearchTerm)
            )).ToListAsync();
        
        return Ok(contacts);
    }
}