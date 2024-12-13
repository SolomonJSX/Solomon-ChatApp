namespace server_chat_app.DTOs;

public record UpdateUserDTO(string? FirstName, string? LastName, int? Color, bool ProfileSetup);