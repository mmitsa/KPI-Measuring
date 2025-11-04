namespace PerformanceSystem.Core.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }

    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public string? EntityType { get; set; }
    public string? EntityId { get; set; }

    public bool IsRead { get; set; } = false;
    public DateTime? ReadAt { get; set; }

    // Navigation properties
    public User? User { get; set; }
}
