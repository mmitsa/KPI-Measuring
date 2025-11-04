using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Application.DTOs.Evaluations;

public class EvaluationDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeNameAr { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string EvaluationType { get; set; } = string.Empty;
    public decimal? GoalsScore { get; set; }
    public decimal? BehaviorScore { get; set; }
    public decimal? InitiativesScore { get; set; }
    public decimal TrainingImpact { get; set; }
    public decimal? FinalScore { get; set; }
    public string? FinalRating { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ManagerNotes { get; set; }
    public string? EmployeeNotes { get; set; }
    public DateTime? EvaluatedAt { get; set; }
    public Guid? EvaluatedBy { get; set; }
    public string? EvaluatedByName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedBy { get; set; }
    public string? ApprovedByName { get; set; }
    public List<EvaluationItemDto> Items { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class EvaluationItemDto
{
    public Guid Id { get; set; }
    public string ItemType { get; set; } = string.Empty;
    public Guid? RefId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? Weight { get; set; }
    public decimal Score { get; set; }
    public string? Notes { get; set; }
    public string? EvidenceUrl { get; set; }
}

public class CreateEvaluationRequest
{
    public Guid EmployeeId { get; set; }
    public string Period { get; set; } = string.Empty;
    public EvaluationType EvaluationType { get; set; }
}

public class UpdateEvaluationScoresRequest
{
    public decimal? GoalsScore { get; set; }
    public decimal? BehaviorScore { get; set; }
    public decimal? InitiativesScore { get; set; }
    public string? ManagerNotes { get; set; }
}

public class AddEvaluationItemRequest
{
    public string ItemType { get; set; } = string.Empty;
    public Guid? RefId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? Weight { get; set; }
    public decimal Score { get; set; }
    public string? Notes { get; set; }
    public string? EvidenceUrl { get; set; }
}

public class FinalizeEvaluationRequest
{
    public string? ManagerNotes { get; set; }
}

public class FinalizeEvaluationResponse
{
    public decimal FinalScore { get; set; }
    public string FinalRating { get; set; } = string.Empty;
    public bool PipCreated { get; set; }
    public Guid? PipId { get; set; }
}

public class EvaluationListRequest
{
    public Guid? EmployeeId { get; set; }
    public string? Period { get; set; }
    public EvaluationType? EvaluationType { get; set; }
    public EvaluationStatus? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
