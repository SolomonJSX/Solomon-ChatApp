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
    public async Task<ActionResult> GetUserInfo()
    {
        try
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var token = HttpContext.Request.Cookies["token"];
            
            if (token is null) return Unauthorized("User is not authorized");

            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidIssuer = AuthOptions.ISSUER,
                ValidAudience = AuthOptions.AUDIENCE,
                IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey()
            };
            
            var principal = jwtTokenHandler.ValidateToken(token, tokenValidationParameters, out _);
            
            var userId = principal.FindFirst("userId")?.Value;
            
            var userData = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id.ToString().ToLower() == userId);
            
            if (userData is null) return Unauthorized("User is not found");

            return Ok(userData);
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(ex.Message);
        }
        
    }
}