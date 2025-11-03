using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Core.Entities;

public class PIP : BaseEntity
{
    public Guid EmployeeId { get; set; }
    public Guid? EvaluationId { get; set; }

    public string? TargetedSkills { get; set; } // JSON
    public string? PlanJson { get; set; } // JSON

    public DateTime StartDate { get; set; }
    public DateTime DueDate { get; set; }

    public PIPStatus Status { get; set; } = PIPStatus.Open;
    public string? ProgressNotes { get; set; }
    public string? ResultNotes { get; set; }

    public DateTime? ClosedAt { get; set; }
    public Guid? ClosedBy { get; set; }

    // Navigation properties
    public Employee? Employee { get; set; }
    public Evaluation? Evaluation { get; set; }
}
