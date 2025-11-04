using Microsoft.EntityFrameworkCore;
using PerformanceSystem.Application.DTOs.Common;
using PerformanceSystem.Application.DTOs.Evaluations;
using PerformanceSystem.Core.Entities;
using PerformanceSystem.Core.Enums;
using PerformanceSystem.Infrastructure.Data;

namespace PerformanceSystem.Application.Services;

public class EvaluationService : IEvaluationService
{
    private readonly PerformanceDbContext _context;

    public EvaluationService(PerformanceDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<EvaluationDto>> GetEvaluationsAsync(EvaluationListRequest request)
    {
        var query = _context.Evaluations
            .Include(e => e.Employee)
            .Include(e => e.EvaluationItems)
            .Where(e => !e.IsDeleted);

        // Apply filters
        if (request.EmployeeId.HasValue)
            query = query.Where(e => e.EmployeeId == request.EmployeeId.Value);

        if (!string.IsNullOrEmpty(request.Period))
            query = query.Where(e => e.Period == request.Period);

        if (request.EvaluationType.HasValue)
            query = query.Where(e => e.EvaluationType == request.EvaluationType.Value);

        if (request.Status.HasValue)
            query = query.Where(e => e.Status == request.Status.Value);

        var totalCount = await query.CountAsync();

        var evaluations = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(e => new EvaluationDto
            {
                Id = e.Id,
                EmployeeId = e.EmployeeId,
                EmployeeNameAr = e.Employee!.FullNameAr,
                Period = e.Period,
                EvaluationType = e.EvaluationType.ToString(),
                GoalsScore = e.GoalsScore,
                BehaviorScore = e.BehaviorScore,
                InitiativesScore = e.InitiativesScore,
                TrainingImpact = e.TrainingImpact,
                FinalScore = e.FinalScore,
                FinalRating = e.FinalRating.ToString(),
                Status = e.Status.ToString(),
                ManagerNotes = e.ManagerNotes,
                EmployeeNotes = e.EmployeeNotes,
                EvaluatedAt = e.EvaluatedAt,
                EvaluatedBy = e.EvaluatedBy,
                ApprovedAt = e.ApprovedAt,
                ApprovedBy = e.ApprovedBy,
                Items = e.EvaluationItems.Select(i => new EvaluationItemDto
                {
                    Id = i.Id,
                    ItemType = i.ItemType,
                    RefId = i.RefId,
                    Title = i.Title,
                    Description = i.Description,
                    Weight = i.Weight,
                    Score = i.Score,
                    Notes = i.Notes,
                    EvidenceUrl = i.EvidenceUrl
                }).ToList(),
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();

        return new PaginatedResponse<EvaluationDto>
        {
            Items = evaluations,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<EvaluationDto?> GetEvaluationByIdAsync(Guid id)
    {
        var evaluation = await _context.Evaluations
            .Include(e => e.Employee)
            .Include(e => e.EvaluationItems)
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

        if (evaluation == null)
            return null;

        return new EvaluationDto
        {
            Id = evaluation.Id,
            EmployeeId = evaluation.EmployeeId,
            EmployeeNameAr = evaluation.Employee!.FullNameAr,
            Period = evaluation.Period,
            EvaluationType = evaluation.EvaluationType.ToString(),
            GoalsScore = evaluation.GoalsScore,
            BehaviorScore = evaluation.BehaviorScore,
            InitiativesScore = evaluation.InitiativesScore,
            TrainingImpact = evaluation.TrainingImpact,
            FinalScore = evaluation.FinalScore,
            FinalRating = evaluation.FinalRating?.ToString(),
            Status = evaluation.Status.ToString(),
            ManagerNotes = evaluation.ManagerNotes,
            EmployeeNotes = evaluation.EmployeeNotes,
            EvaluatedAt = evaluation.EvaluatedAt,
            EvaluatedBy = evaluation.EvaluatedBy,
            ApprovedAt = evaluation.ApprovedAt,
            ApprovedBy = evaluation.ApprovedBy,
            Items = evaluation.EvaluationItems.Select(i => new EvaluationItemDto
            {
                Id = i.Id,
                ItemType = i.ItemType,
                RefId = i.RefId,
                Title = i.Title,
                Description = i.Description,
                Weight = i.Weight,
                Score = i.Score,
                Notes = i.Notes,
                EvidenceUrl = i.EvidenceUrl
            }).ToList(),
            CreatedAt = evaluation.CreatedAt
        };
    }

    public async Task<EvaluationDto> CreateEvaluationAsync(CreateEvaluationRequest request, Guid createdBy)
    {
        // Validate employee exists
        var employee = await _context.Employees.FindAsync(request.EmployeeId);
        if (employee == null)
        {
            throw new KeyNotFoundException("الموظف غير موجود");
        }

        // Check for existing evaluation in same period
        var existingEvaluation = await _context.Evaluations
            .FirstOrDefaultAsync(e => e.EmployeeId == request.EmployeeId
                && e.Period == request.Period
                && e.EvaluationType == request.EvaluationType
                && !e.IsDeleted);

        if (existingEvaluation != null)
        {
            throw new InvalidOperationException("يوجد تقييم بالفعل لهذا الموظف في نفس الفترة");
        }

        var evaluation = new Evaluation
        {
            EmployeeId = request.EmployeeId,
            Period = request.Period,
            EvaluationType = request.EvaluationType,
            Status = EvaluationStatus.Draft,
            CreatedBy = createdBy
        };

        _context.Evaluations.Add(evaluation);
        await _context.SaveChangesAsync();

        return (await GetEvaluationByIdAsync(evaluation.Id))!;
    }

    public async Task<EvaluationDto> UpdateEvaluationScoresAsync(Guid id, UpdateEvaluationScoresRequest request, Guid updatedBy)
    {
        var evaluation = await _context.Evaluations.FindAsync(id);
        if (evaluation == null || evaluation.IsDeleted)
        {
            throw new KeyNotFoundException("التقييم غير موجود");
        }

        if (evaluation.Status != EvaluationStatus.Draft && evaluation.Status != EvaluationStatus.InProgress)
        {
            throw new InvalidOperationException("لا يمكن تعديل التقييم في الحالة الحالية");
        }

        // Validate scores are between 0 and 5
        if (request.GoalsScore.HasValue && (request.GoalsScore < 0 || request.GoalsScore > 5))
            throw new ArgumentException("درجة الأهداف يجب أن تكون بين 0 و 5");

        if (request.BehaviorScore.HasValue && (request.BehaviorScore < 0 || request.BehaviorScore > 5))
            throw new ArgumentException("درجة السلوكيات يجب أن تكون بين 0 و 5");

        if (request.InitiativesScore.HasValue && (request.InitiativesScore < 0 || request.InitiativesScore > 5))
            throw new ArgumentException("درجة المبادرات يجب أن تكون بين 0 و 5");

        evaluation.GoalsScore = request.GoalsScore;
        evaluation.BehaviorScore = request.BehaviorScore;
        evaluation.InitiativesScore = request.InitiativesScore;
        evaluation.ManagerNotes = request.ManagerNotes;
        evaluation.Status = EvaluationStatus.InProgress;
        evaluation.UpdatedAt = DateTime.UtcNow;
        evaluation.UpdatedBy = updatedBy;

        await _context.SaveChangesAsync();

        return (await GetEvaluationByIdAsync(id))!;
    }

    public async Task<EvaluationDto> AddEvaluationItemAsync(Guid evaluationId, AddEvaluationItemRequest request, Guid updatedBy)
    {
        var evaluation = await _context.Evaluations
            .Include(e => e.EvaluationItems)
            .FirstOrDefaultAsync(e => e.Id == evaluationId && !e.IsDeleted);

        if (evaluation == null)
        {
            throw new KeyNotFoundException("التقييم غير موجود");
        }

        if (evaluation.Status != EvaluationStatus.Draft && evaluation.Status != EvaluationStatus.InProgress)
        {
            throw new InvalidOperationException("لا يمكن إضافة بنود للتقييم في الحالة الحالية");
        }

        // Validate score
        if (request.Score < 0 || request.Score > 5)
            throw new ArgumentException("الدرجة يجب أن تكون بين 0 و 5");

        var item = new EvaluationItem
        {
            EvaluationId = evaluationId,
            ItemType = request.ItemType,
            RefId = request.RefId,
            Title = request.Title,
            Description = request.Description,
            Weight = request.Weight,
            Score = request.Score,
            Notes = request.Notes,
            EvidenceUrl = request.EvidenceUrl,
            CreatedBy = updatedBy
        };

        evaluation.EvaluationItems.Add(item);
        evaluation.UpdatedAt = DateTime.UtcNow;
        evaluation.UpdatedBy = updatedBy;

        await _context.SaveChangesAsync();

        return (await GetEvaluationByIdAsync(evaluationId))!;
    }

    public async Task<bool> DeleteEvaluationItemAsync(Guid evaluationId, Guid itemId, Guid deletedBy)
    {
        var item = await _context.EvaluationItems
            .FirstOrDefaultAsync(i => i.Id == itemId && i.EvaluationId == evaluationId && !i.IsDeleted);

        if (item == null)
            return false;

        item.IsDeleted = true;
        item.UpdatedAt = DateTime.UtcNow;
        item.UpdatedBy = deletedBy;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<FinalizeEvaluationResponse> FinalizeEvaluationAsync(Guid id, FinalizeEvaluationRequest request, Guid evaluatedBy)
    {
        var evaluation = await _context.Evaluations
            .Include(e => e.Employee)
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

        if (evaluation == null)
        {
            throw new KeyNotFoundException("التقييم غير موجود");
        }

        if (evaluation.Status == EvaluationStatus.Finalized || evaluation.Status == EvaluationStatus.Approved)
        {
            throw new InvalidOperationException("التقييم تم اعتماده بالفعل");
        }

        // Ensure all scores are provided
        if (!evaluation.GoalsScore.HasValue || !evaluation.BehaviorScore.HasValue || !evaluation.InitiativesScore.HasValue)
        {
            throw new InvalidOperationException("يجب إدخال جميع الدرجات قبل الاعتماد");
        }

        // Get training impact for this employee
        var trainingImpact = await CalculateTrainingImpactAsync(evaluation.EmployeeId, evaluation.Period);
        evaluation.TrainingImpact = trainingImpact;

        // Calculate final score using the formula:
        // FinalScore = (GoalsScore × 0.6) + (BehaviorScore × 0.3) + (InitiativesScore × 0.1) + TrainingImpact
        var finalScore = (evaluation.GoalsScore.Value * 0.6m) +
                        (evaluation.BehaviorScore.Value * 0.3m) +
                        (evaluation.InitiativesScore.Value * 0.1m) +
                        trainingImpact;

        evaluation.FinalScore = Math.Round(finalScore, 2);
        evaluation.FinalRating = CalculatePerformanceRating(evaluation.FinalScore.Value);
        evaluation.Status = EvaluationStatus.Finalized;
        evaluation.ManagerNotes = request.ManagerNotes ?? evaluation.ManagerNotes;
        evaluation.EvaluatedAt = DateTime.UtcNow;
        evaluation.EvaluatedBy = evaluatedBy;

        // Check if PIP should be created (FinalScore < 2.5)
        bool pipCreated = false;
        Guid? pipId = null;

        if (evaluation.FinalScore < 2.5m)
        {
            var pip = new PIP
            {
                EmployeeId = evaluation.EmployeeId,
                EvaluationId = id,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(3), // Default 3 months
                Status = PIPStatus.Draft,
                CreatedBy = evaluatedBy
            };

            _context.PIPs.Add(pip);
            pipCreated = true;
            pipId = pip.Id;
        }

        await _context.SaveChangesAsync();

        return new FinalizeEvaluationResponse
        {
            FinalScore = evaluation.FinalScore.Value,
            FinalRating = evaluation.FinalRating!.Value.ToString(),
            PipCreated = pipCreated,
            PipId = pipId
        };
    }

    public async Task<bool> ApproveEvaluationAsync(Guid id, Guid approvedBy)
    {
        var evaluation = await _context.Evaluations.FindAsync(id);
        if (evaluation == null || evaluation.IsDeleted)
        {
            throw new KeyNotFoundException("التقييم غير موجود");
        }

        if (evaluation.Status != EvaluationStatus.Finalized)
        {
            throw new InvalidOperationException("يجب اعتماد التقييم أولاً قبل الموافقة عليه");
        }

        evaluation.Status = EvaluationStatus.Approved;
        evaluation.ApprovedAt = DateTime.UtcNow;
        evaluation.ApprovedBy = approvedBy;

        await _context.SaveChangesAsync();
        return true;
    }

    private async Task<decimal> CalculateTrainingImpactAsync(Guid employeeId, string period)
    {
        // Get training results for this employee in this period
        var trainingResults = await _context.TrainingResults
            .Where(tr => tr.EmployeeId == employeeId
                && tr.CompletionDate.HasValue
                && tr.CompletionDate.Value.Year.ToString() == period
                && !tr.IsDeleted)
            .ToListAsync();

        if (!trainingResults.Any())
            return 0;

        // Calculate average score
        var averageScore = trainingResults.Average(tr => tr.Score ?? 0);

        // Apply training impact rules:
        // ≥85% → +0.15
        // <60% → -0.20
        // else → 0
        if (averageScore >= 85)
            return 0.15m;
        else if (averageScore < 60)
            return -0.20m;
        else
            return 0;
    }

    private static PerformanceRating CalculatePerformanceRating(decimal finalScore)
    {
        return finalScore switch
        {
            >= 4.5m => PerformanceRating.Excellent,
            >= 3.5m => PerformanceRating.AboveExpected,
            >= 2.5m => PerformanceRating.Satisfactory,
            >= 1.5m => PerformanceRating.BelowExpected,
            _ => PerformanceRating.Poor
        };
    }
}
