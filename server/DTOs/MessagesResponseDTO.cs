using server_chat_app.Models;

namespace server_chat_app.Controllers;

public record MessagesResponseDTO(List<Message> Messages);