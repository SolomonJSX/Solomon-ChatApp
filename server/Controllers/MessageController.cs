using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace server_chat_app.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessageController(ChatAppDbContext dbContext, IWebHostEnvironment environment) : ControllerBase
{
    [HttpGet("uploads/files/{date}/{filename}")]
    public IActionResult DownloadFile(string date, string filename)
    {
        var filePath = Path.Combine(environment.WebRootPath, "uploads", "files", date, filename);
        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var fileBytes = System.IO.File.ReadAllBytes(filePath);
        return File(fileBytes, "application/octet-stream", filename);
    }


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
    [HttpPost("upload-file")]
    [Authorize]
    public async Task<ActionResult> UploadFile([FromForm] UploadFileDTO model)
    {
        try
        {
            if (model.File is null || model.File.Length == 0) return BadRequest("File is required.");

            var date = DateTime.Now;

            string basePath = Path.Combine(environment.WebRootPath, $"uploads/files/{date:yyyyMMdd}");

            if (!Directory.Exists(basePath)) Directory.CreateDirectory(basePath);

            var filePath = Path.Combine(basePath, model.File.FileName);

            await using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
            {
                await model.File.CopyToAsync(fileStream);
            }

            return Ok(new
            {
                FilePath = Path.Combine($"uploads/files/{date:yyyyMMdd}", model.File.FileName).Replace("\\", "/"),
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return BadRequest(e.Message);
        }
    }
}