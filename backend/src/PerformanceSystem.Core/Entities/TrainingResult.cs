namespace PerformanceSystem.Core.Entities;

public class TrainingResult : BaseEntity
{
    public Guid EmployeeId { get; set; }
    public string? CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string? CourseCategory { get; set; }

    public decimal ScorePercent { get; set; } // 0-100
    public bool IsPassed { get; set; }

    public decimal Impact { get; set; } // +0.15, 0, -0.20

    public DateTime CompletedAt { get; set; }
    public bool SentToPerformance { get; set; } = false;
    public DateTime? SentAt { get; set; }

    // Navigation properties
    public Employee? Employee { get; set; }
}
