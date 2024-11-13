namespace server_chat_app.DTOs;

public record SignUpDto(string? Email, string? Password, int? Color, string? FirstName, string? LastName, IFormFile? File, bool? ProfileSetup);