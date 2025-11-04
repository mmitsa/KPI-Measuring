using PerformanceSystem.Core.Enums;

namespace PerformanceSystem.Application.DTOs.Goals;

public class GoalDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeNameAr { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal Weight { get; set; }
    public string? TargetValue { get; set; }
    public string? MeasurementUnit { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal? ProgressPercent { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedBy { get; set; }
    public string? ApprovedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateGoalRequest
{
    public Guid EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public GoalType Type { get; set; }
    public string? Category { get; set; }
    public decimal Weight { get; set; }
    public string? TargetValue { get; set; }
    public string? MeasurementUnit { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class UpdateGoalRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public GoalType Type { get; set; }
    public string? Category { get; set; }
    public decimal Weight { get; set; }
    public string? TargetValue { get; set; }
    public string? MeasurementUnit { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class UpdateGoalProgressRequest
{
    public decimal ProgressPercent { get; set; }
    public string? Notes { get; set; }
}

public class ApproveGoalRequest
{
    public bool Approved { get; set; }
    public string? Notes { get; set; }
}

public class GoalListRequest
{
    public Guid? EmployeeId { get; set; }
    public GoalType? Type { get; set; }
    public GoalStatus? Status { get; set; }
    public int? Year { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
