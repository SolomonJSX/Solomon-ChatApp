using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server_chat_app.DTOs;
using server_chat_app.Models;

public class AuthRepository(ChatAppDbContext dbContext, IWebHostEnvironment environment)
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
            
            var user = new User 
            {
                Email = model.Email,
                PasswordHash = passwordHash
            };
            
            var userEntity = dbContext.Add(user);
            await dbContext.SaveChangesAsync();
            
            string token = CreateToken(user.Email, userId: userEntity.Entity.Id);
                        
            AppendToCookies("token", token, httpContext);
            
            return Result.Success(userEntity.Entity);
        } 
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return Result.Failure<User>(ex.Message);
        }
    }

    public async Task<ActionResult<User>> UploadImageAsync(string? userId, IFormFile? uploadedFile) 
    {
        var user = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null) return new NotFoundObjectResult("User not found");

        var filePath = await AddImageAsync(uploadedFile, "profiles");

        await dbContext.Users
            .Where(u => u.Id.ToString() == userId) 
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.ImagePath, filePath));
        var updatedUser = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        return new OkObjectResult(updatedUser);
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

    public async Task<ActionResult<User>> RemoveProfileImage(string? userId) 
    {
        if (string.IsNullOrEmpty(userId)) return new NotFoundObjectResult("User ID is not provided.");

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

        if (user is null) return new NotFoundObjectResult("User not found!");

        if (!string.IsNullOrEmpty(user.ImagePath))
        {
            var deletedFile = RemoveFile(user.ImagePath);

            if (!deletedFile) return new BadRequestObjectResult("Failed to delete old image.");
        }

        user.ImagePath = null;

        await dbContext.SaveChangesAsync();

        return new OkObjectResult(user);
    }

    private async Task<string?> AddImageAsync(IFormFile? uploadedFile, string dirName) 
    {
        if (uploadedFile is null || uploadedFile.Length == 0) return null;

        string basePath = Path.Combine(environment.WebRootPath, dirName);

        if (!Directory.Exists(basePath)) Directory.CreateDirectory(basePath);

        var fileExtension = Path.GetExtension(uploadedFile.FileName);

        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

        string filePath = Path.Combine(basePath, uniqueFileName);

        await using (var fileStream = new FileStream(filePath, FileMode.Create)) 
        {
            await uploadedFile.CopyToAsync(fileStream);
        }

        return Path.Combine(dirName, uniqueFileName).Replace("\\", "/");
    }

    private string CreateToken(string email, string userId) 
    {
        var claims = new List<Claim>() {
            new Claim(ClaimTypes.Email, email),
            new Claim("userId", userId)
        };

        var jwt = new JwtSecurityToken(issuer: AuthOptions.ISSUER, audience: AuthOptions.AUDIENCE, claims: claims,
            expires: DateTime.Now.AddDays(2),
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(),
                SecurityAlgorithms.HmacSha256Signature));
        
        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    private bool RemoveFile(string? filePath)
    {
        if (string.IsNullOrEmpty(filePath)) return false;

        string fullPath = Path.Combine(environment.WebRootPath, filePath);

        if (File.Exists(fullPath))
        {
            try
            {
                File.Delete(fullPath);
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }
        return false;
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