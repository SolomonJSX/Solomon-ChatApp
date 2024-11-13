using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server_chat_app.DTOs;
using server_chat_app.Models;

public class AuthRepository(ChatAppDbContext dbContext)
{
    public async Task<Result<User>> SignUpAsync(SignUpDto model, HttpContext httpContext) 
    {
        try
        {  
            if (model.Email is null || model.Password is null) 
            {
                return Result.Failure<User>("Email and Password is required");
            }
            
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var imagePath = UpdateFileFromClientAsync(model.File, "profileImages");
            
            var user = new User 
            {
                Email = model.Email,
                PasswordHash = passwordHash,
                Color = model.Color,
                FirstName = model.FirstName,
                LastName = model.LastName,
                ImagePath = imagePath.Result
            };
            
            string token = CreateToken(user.Email, userId: user.Id);
            
            AppendToCookies("token", token, httpContext);
            
            var userEntity = dbContext.Add(user);
            await dbContext.SaveChangesAsync();
            
            return Result.Success(userEntity.Entity);
        } 
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return Result.Failure<User>(ex.Message);
        }
    }

    public async Task<Result<User>> LoginAsync(LoginDTO model, HttpContext httpContext) 
    {
        try
        {
            if (model.Email is null || model.Password is null)
            {
                return Result.Failure<User>("Email and Password is required");
            }

            var user = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == model.Email);
            
            if (user == null) return Result.Failure<User>("User with the given email not found");
            
            var auth = BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash);
            
            if (!auth) return Result.Failure<User>("Invalid password");
            
            var token = CreateToken(user.Email, userId: user.Id);
            
            AppendToCookies("token", token, httpContext);
            
            return Result.Success(user);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return Result.Failure<User>(ex.Message);
        }
    }

    private async Task<string?> UpdateFileFromClientAsync(IFormFile? file, string dirName)
    {
        if (file is null || file.Length == 0) return null;
        
        var fileExtension = Path.GetExtension(file.FileName);
        
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/{dirName}", $"{Guid.NewGuid()}{fileExtension}");

        var directoryPath = Path.GetDirectoryName(filePath);
        
        if (directoryPath != null && !Directory.Exists(filePath))
        {
            Directory.CreateDirectory(directoryPath);
        }

        using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }
        
        var relativePath = Path.Combine(dirName, $"{Path.GetFileName(filePath)}");
        return relativePath;
    }
    
    private string CreateToken(string email, int userId) 
    {
        var claims = new List<Claim>() {
            new Claim(ClaimTypes.Email, email),
            new Claim("userId", userId.ToString())
        };

        var jwt = new JwtSecurityToken(issuer: AuthOptions.ISSUER, audience: AuthOptions.AUDIENCE, claims: claims,
            DateTime.Now.AddDays(2),
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(),
                SecurityAlgorithms.HmacSha256));
        
        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    private void AppendToCookies(string key, string value, HttpContext httpContext)
    {
        httpContext.Response.Cookies.Append(key, value, new CookieOptions()
        {
            Expires = DateTimeOffset.Now.AddDays(7),
            Secure = true,
            SameSite = SameSiteMode.None
        });
    }
}