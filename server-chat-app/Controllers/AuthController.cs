using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
    [UserIdFilter]
    public async Task<ActionResult> GetUserInfo(string? userId)
    {
        try
        {
            if (userId is null) return NotFound("UserId is not found!");
            var userData = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            
            if (userData is null) return Unauthorized("User is not found");

            return Ok(userData);
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(ex.Message);
        }
        
    }

    [HttpPut("update-user")]
    [UserIdFilter]
    public async Task<ActionResult> UpdateUser(string? userId, UpdateUserDTO model)
    {
        if (userId is null) return BadRequest("UserId is not found!");

        if (model.FirstName is null || model.LastName is null || model.Color is null)
            return BadRequest("Firstname lastname and color is not found!");

        await dbContext.Users
            .Where(u => u.Id.ToString() == userId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.FirstName, model.FirstName)
                .SetProperty(u => u.LastName, model.LastName)
                .SetProperty(u => u.Color, model.Color)
                .SetProperty(u => u.ProfileSetup, true)
            );
        
        var updatedUser = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);

        return Ok(updatedUser);
    }

    [HttpPost("add-profile-image")]
    [UserIdFilter]
    public async Task<ActionResult<User>> UploadImage([FromForm] string? userId, IFormFile? uploadedFile)
    {
        if (userId is null) return BadRequest("UserId is not found!");
        return await authRepository.UploadImageAsync(userId, uploadedFile);
    }

    [HttpDelete("remove-profile-image")]
    [UserIdFilter]
    public async Task<ActionResult<User>> UploadImage(string? userId)
    {
        return await authRepository.RemoveProfileImage(userId);
    }

    [HttpPost("logout")]
    public ActionResult LogOut() {
        try {
            HttpContext.Response.Cookies.Delete("token");
        } catch(Exception ex) 
        {
            return BadRequest($"Something went wrong trying delete token. Exception message: ${ex.Message}");
        }
        
        return Ok("Logout successfull!");
    }
}