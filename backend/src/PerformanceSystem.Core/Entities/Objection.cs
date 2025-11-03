using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Core.Entities;

public class Objection : BaseEntity
{
    public Guid EmployeeId { get; set; }
    public Guid EvaluationId { get; set; }

    public string Reason { get; set; } = string.Empty;
    public string? Details { get; set; }
    public string? AttachmentUrl { get; set; }

    public ObjectionStatus Status { get; set; } = ObjectionStatus.Open;

    public string? DecisionNotes { get; set; }
    public Guid? DecidedBy { get; set; }
    public DateTime? DecidedAt { get; set; }

    // Navigation properties
    public Employee? Employee { get; set; }
    public Evaluation? Evaluation { get; set; }
}
