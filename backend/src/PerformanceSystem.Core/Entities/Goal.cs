using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Core.Entities;

public class Goal : BaseEntity
{
    public Guid EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public GoalType Type { get; set; }
    public string? Category { get; set; }

    public decimal Weight { get; set; } // 0-100
    public string? TargetValue { get; set; }
    public string? MeasurementUnit { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public GoalStatus Status { get; set; } = GoalStatus.Draft;
    public decimal? ProgressPercent { get; set; } = 0;

    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedBy { get; set; }

    // Navigation properties
    public Employee? Employee { get; set; }
}
