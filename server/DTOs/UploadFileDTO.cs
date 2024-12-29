using Microsoft.AspNetCore.Mvc;

namespace server_chat_app.Controllers;

public class UploadFileDTO
{
    [FromForm(Name = "file")]
    public IFormFile File { get; set; }
}