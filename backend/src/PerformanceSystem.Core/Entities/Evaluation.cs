using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Core.Entities;

public class Evaluation : BaseEntity
{
    public Guid EmployeeId { get; set; }
    public string Period { get; set; } = string.Empty; // e.g., "2025"
    public EvaluationType EvaluationType { get; set; } = EvaluationType.Annual;

    // Sub-scores
    public decimal? GoalsScore { get; set; } // 0-5
    public decimal? BehaviorScore { get; set; } // 0-5
    public decimal? InitiativesScore { get; set; } // 0-5

    // Training impact
    public decimal TrainingImpact { get; set; } = 0; // +0.15, 0, -0.20

    // Final result
    public decimal? FinalScore { get; set; } // 0-5
    public PerformanceRating? FinalRating { get; set; }

    // Status
    public EvaluationStatus Status { get; set; } = EvaluationStatus.Draft;

    // Notes
    public string? ManagerNotes { get; set; }
    public string? EmployeeNotes { get; set; }

    // Dates
    public DateTime? EvaluatedAt { get; set; }
    public Guid? EvaluatedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedBy { get; set; }

    // Navigation properties
    public Employee? Employee { get; set; }
    public ICollection<EvaluationItem> EvaluationItems { get; set; } = new List<EvaluationItem>();
    public ICollection<Objection> Objections { get; set; } = new List<Objection>();
}

public class EvaluationItem : BaseEntity
{
    public Guid EvaluationId { get; set; }
    public string ItemType { get; set; } = string.Empty; // Goal, Competency, Initiative
    public Guid? RefId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? Weight { get; set; }

    public decimal Score { get; set; } // 0-5
    public string? Notes { get; set; }
    public string? EvidenceUrl { get; set; }

    // Navigation properties
    public Evaluation? Evaluation { get; set; }
}
