using Microsoft.EntityFrameworkCore;
using server_chat_app.Models;

public class ChatAppDbContext(DbContextOptions<ChatAppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
}