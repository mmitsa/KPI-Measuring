using PerformanceSystem.Application.DTOs.Common;
using PerformanceSystem.Application.DTOs.Goals;

namespace PerformanceSystem.Application.Services;

public interface IGoalService
{
    Task<PaginatedResponse<GoalDto>> GetGoalsAsync(GoalListRequest request);
    Task<GoalDto?> GetGoalByIdAsync(Guid id);
    Task<GoalDto> CreateGoalAsync(CreateGoalRequest request, Guid createdBy);
    Task<GoalDto> UpdateGoalAsync(Guid id, UpdateGoalRequest request, Guid updatedBy);
    Task<bool> DeleteGoalAsync(Guid id, Guid deletedBy);
    Task<GoalDto> UpdateGoalProgressAsync(Guid id, UpdateGoalProgressRequest request, Guid updatedBy);
    Task<GoalDto> ApproveGoalAsync(Guid id, ApproveGoalRequest request, Guid approvedBy);
    Task<bool> ValidateGoalWeightsAsync(Guid employeeId, int year);
}
