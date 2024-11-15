using Microsoft.AspNetCore.Mvc;
using server_chat_app.DTOs;
using server_chat_app.Models;

namespace server_chat_app.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthRepository authRepository, ChatAppDbContext dbContext) : ControllerBase
{
    [HttpPost("signup")]
    public async Task<ActionResult<User>> SignUp(SignUpDto model)
    {
        var result = await authRepository.SignUpAsync(model, HttpContext);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(LoginDTO model)
    {
        var result = await authRepository.LoginAsync(model, HttpContext);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("user-info")]
    public async Task<ActionResult> Get
}