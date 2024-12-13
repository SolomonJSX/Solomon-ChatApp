using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;

class UserIdFilter : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        try
        {
            var token = context.HttpContext.Request.Cookies["token"];

            if (string.IsNullOrEmpty(token)) context.ActionArguments["userId"] = null;

            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidIssuer = AuthOptions.ISSUER,
                ValidAudience = AuthOptions.AUDIENCE,
                IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey()
            };
            
            var principal = jwtTokenHandler.ValidateToken(token, tokenValidationParameters, out _);
            
            var userId = principal.FindFirst("userId")?.Value;

            context.ActionArguments["userId"] = userId;
            await next();
        }
        catch (Exception ex)
        {
            context.ActionArguments["userId"] = null;
            context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.HttpContext.Response.WriteAsJsonAsync("Invalid or inspired token.");
        }
    }
}