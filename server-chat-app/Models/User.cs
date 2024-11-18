using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server_chat_app.Models;

public class User 
{
    public Guid Id { get; set; }
    
    [Required(ErrorMessage = "Email is required")]
    public string Email { get; set; } = null!;
    [Required]
    [JsonIgnore]
    public string PasswordHash { get; set;} = null!;
    public string? FirstName { get; set;}
    public string? LastName { get; set; } 
    public string? ImagePath { get; set; }
    public int? Color { get; set; }
    public bool? ProfileSetup { get; set; } = false;

}