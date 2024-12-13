using System.Text;
using Microsoft.IdentityModel.Tokens;

public class AuthOptions 
{
    public const string ISSUER = "ChatAppIssuer";
    public const string AUDIENCE = "ChatAppAudience";
    public const string KEY = "*^*we&*kdjfkdsfhE&FD*8*SD8f9dfsdjfj(98392(((0(_)";
    public static SymmetricSecurityKey GetSymmetricSecurityKey() => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}