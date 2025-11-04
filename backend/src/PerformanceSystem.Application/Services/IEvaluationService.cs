using PerformanceSystem.Application.DTOs.Common;
using PerformanceSystem.Application.DTOs.Evaluations;

namespace PerformanceSystem.Application.Services;

public interface IEvaluationService
{
    Task<PaginatedResponse<EvaluationDto>> GetEvaluationsAsync(EvaluationListRequest request);
    Task<EvaluationDto?> GetEvaluationByIdAsync(Guid id);
    Task<EvaluationDto> CreateEvaluationAsync(CreateEvaluationRequest request, Guid createdBy);
    Task<EvaluationDto> UpdateEvaluationScoresAsync(Guid id, UpdateEvaluationScoresRequest request, Guid updatedBy);
    Task<EvaluationDto> AddEvaluationItemAsync(Guid evaluationId, AddEvaluationItemRequest request, Guid updatedBy);
    Task<bool> DeleteEvaluationItemAsync(Guid evaluationId, Guid itemId, Guid deletedBy);
    Task<FinalizeEvaluationResponse> FinalizeEvaluationAsync(Guid id, FinalizeEvaluationRequest request, Guid evaluatedBy);
    Task<bool> ApproveEvaluationAsync(Guid id, Guid approvedBy);
}
