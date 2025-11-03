namespace PerformanceSystem.Core.Entities;

public class Position
{
    public int Id { get; set; }
    public string PositionCode { get; set; } = string.Empty;
    public string PositionNameAr { get; set; } = string.Empty;
    public string? PositionNameEn { get; set; }
    public int? Grade { get; set; }
    public string? JobFamily { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
