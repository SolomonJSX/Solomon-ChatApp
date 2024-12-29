namespace server_chat_app.Models;

public class Channel
{
    public string Id { get; set; } = Guid.NewGuid().ToString(); // Уникальный идентификатор канала
    public string Name { get; set; } // Название канала
    public List<Member> Members { get; set; } = new List<Member>(); // Список ID участников
    public string? AdminId { get; set; } // ID администратора канала
    
    public List<Message> Messages { get; set; } = new List<Message>(); // Список ID сообщений
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Дата создания канала
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // Дата последнего обновления
}