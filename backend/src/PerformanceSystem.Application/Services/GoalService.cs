using Microsoft.EntityFrameworkCore;
using PerformanceSystem.Application.DTOs.Common;
using PerformanceSystem.Application.DTOs.Goals;
using PerformanceSystem.Core.Entities;
using PerformanceSystem.Core.Enums;
using PerformanceSystem.Infrastructure.Data;

namespace PerformanceSystem.Application.Services;

public class GoalService : IGoalService
{
    private readonly PerformanceDbContext _context;

    public GoalService(PerformanceDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<GoalDto>> GetGoalsAsync(GoalListRequest request)
    {
        var query = _context.Goals
            .Include(g => g.Employee)
            .Where(g => !g.IsDeleted);

        // Apply filters
        if (request.EmployeeId.HasValue)
            query = query.Where(g => g.EmployeeId == request.EmployeeId.Value);

        if (request.Type.HasValue)
            query = query.Where(g => g.Type == request.Type.Value);

        if (request.Status.HasValue)
            query = query.Where(g => g.Status == request.Status.Value);

        if (request.Year.HasValue)
            query = query.Where(g => g.StartDate.Year == request.Year.Value);

        var totalCount = await query.CountAsync();

        var goals = await query
            .OrderByDescending(g => g.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(g => new GoalDto
            {
                Id = g.Id,
                EmployeeId = g.EmployeeId,
                EmployeeNameAr = g.Employee!.FullNameAr,
                Title = g.Title,
                Description = g.Description,
                Type = g.Type.ToString(),
                Category = g.Category,
                Weight = g.Weight,
                TargetValue = g.TargetValue,
                MeasurementUnit = g.MeasurementUnit,
                StartDate = g.StartDate,
                EndDate = g.EndDate,
                Status = g.Status.ToString(),
                ProgressPercent = g.ProgressPercent,
                ApprovedAt = g.ApprovedAt,
                ApprovedBy = g.ApprovedBy,
                CreatedAt = g.CreatedAt
            })
            .ToListAsync();

        return new PaginatedResponse<GoalDto>
        {
            Items = goals,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<GoalDto?> GetGoalByIdAsync(Guid id)
    {
        var goal = await _context.Goals
            .Include(g => g.Employee)
            .FirstOrDefaultAsync(g => g.Id == id && !g.IsDeleted);

        if (goal == null)
            return null;

        return new GoalDto
        {
            Id = goal.Id,
            EmployeeId = goal.EmployeeId,
            EmployeeNameAr = goal.Employee!.FullNameAr,
            Title = goal.Title,
            Description = goal.Description,
            Type = goal.Type.ToString(),
            Category = goal.Category,
            Weight = goal.Weight,
            TargetValue = goal.TargetValue,
            MeasurementUnit = goal.MeasurementUnit,
            StartDate = goal.StartDate,
            EndDate = goal.EndDate,
            Status = goal.Status.ToString(),
            ProgressPercent = goal.ProgressPercent,
            ApprovedAt = goal.ApprovedAt,
            ApprovedBy = goal.ApprovedBy,
            CreatedAt = goal.CreatedAt
        };
    }

    public async Task<GoalDto> CreateGoalAsync(CreateGoalRequest request, Guid createdBy)
    {
        // Validate employee exists
        var employee = await _context.Employees.FindAsync(request.EmployeeId);
        if (employee == null)
        {
            throw new KeyNotFoundException("الموظف غير موجود");
        }

        // Validate weight doesn't exceed 100 when combined with existing goals
        var year = request.StartDate.Year;
        var existingWeight = await _context.Goals
            .Where(g => g.EmployeeId == request.EmployeeId
                && g.StartDate.Year == year
                && !g.IsDeleted
                && g.Status != GoalStatus.Cancelled)
            .SumAsync(g => g.Weight);

        if (existingWeight + request.Weight > 100)
        {
            throw new InvalidOperationException($"مجموع أوزان الأهداف يتجاوز 100%. الوزن الحالي: {existingWeight}%");
        }

        var goal = new Goal
        {
            EmployeeId = request.EmployeeId,
            Title = request.Title,
            Description = request.Description,
            Type = request.Type,
            Category = request.Category,
            Weight = request.Weight,
            TargetValue = request.TargetValue,
            MeasurementUnit = request.MeasurementUnit,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = GoalStatus.Draft,
            CreatedBy = createdBy
        };

        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();

        return (await GetGoalByIdAsync(goal.Id))!;
    }

    public async Task<GoalDto> UpdateGoalAsync(Guid id, UpdateGoalRequest request, Guid updatedBy)
    {
        var goal = await _context.Goals.FindAsync(id);
        if (goal == null || goal.IsDeleted)
        {
            throw new KeyNotFoundException("الهدف غير موجود");
        }

        // Can only update draft or approved goals
        if (goal.Status != GoalStatus.Draft && goal.Status != GoalStatus.Approved)
        {
            throw new InvalidOperationException("لا يمكن تعديل الهدف في الحالة الحالية");
        }

        // Validate weight if changed
        if (goal.Weight != request.Weight)
        {
            var year = request.StartDate.Year;
            var existingWeight = await _context.Goals
                .Where(g => g.EmployeeId == goal.EmployeeId
                    && g.Id != id
                    && g.StartDate.Year == year
                    && !g.IsDeleted
                    && g.Status != GoalStatus.Cancelled)
                .SumAsync(g => g.Weight);

            if (existingWeight + request.Weight > 100)
            {
                throw new InvalidOperationException($"مجموع أوزان الأهداف يتجاوز 100%. الوزن الحالي: {existingWeight}%");
            }
        }

        goal.Title = request.Title;
        goal.Description = request.Description;
        goal.Type = request.Type;
        goal.Category = request.Category;
        goal.Weight = request.Weight;
        goal.TargetValue = request.TargetValue;
        goal.MeasurementUnit = request.MeasurementUnit;
        goal.StartDate = request.StartDate;
        goal.EndDate = request.EndDate;
        goal.UpdatedAt = DateTime.UtcNow;
        goal.UpdatedBy = updatedBy;

        await _context.SaveChangesAsync();

        return (await GetGoalByIdAsync(id))!;
    }

    public async Task<bool> DeleteGoalAsync(Guid id, Guid deletedBy)
    {
        var goal = await _context.Goals.FindAsync(id);
        if (goal == null || goal.IsDeleted)
        {
            return false;
        }

        // Can only delete draft goals
        if (goal.Status != GoalStatus.Draft)
        {
            throw new InvalidOperationException("لا يمكن حذف الهدف بعد الموافقة عليه");
        }

        goal.IsDeleted = true;
        goal.UpdatedAt = DateTime.UtcNow;
        goal.UpdatedBy = deletedBy;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<GoalDto> UpdateGoalProgressAsync(Guid id, UpdateGoalProgressRequest request, Guid updatedBy)
    {
        var goal = await _context.Goals.FindAsync(id);
        if (goal == null || goal.IsDeleted)
        {
            throw new KeyNotFoundException("الهدف غير موجود");
        }

        if (goal.Status != GoalStatus.Approved && goal.Status != GoalStatus.InProgress)
        {
            throw new InvalidOperationException("لا يمكن تحديث تقدم الهدف في الحالة الحالية");
        }

        if (request.ProgressPercent < 0 || request.ProgressPercent > 100)
        {
            throw new ArgumentException("نسبة التقدم يجب أن تكون بين 0 و 100");
        }

        goal.ProgressPercent = request.ProgressPercent;
        goal.Status = request.ProgressPercent == 100 ? GoalStatus.Completed : GoalStatus.InProgress;
        goal.UpdatedAt = DateTime.UtcNow;
        goal.UpdatedBy = updatedBy;

        await _context.SaveChangesAsync();

        return (await GetGoalByIdAsync(id))!;
    }

    public async Task<GoalDto> ApproveGoalAsync(Guid id, ApproveGoalRequest request, Guid approvedBy)
    {
        var goal = await _context.Goals.FindAsync(id);
        if (goal == null || goal.IsDeleted)
        {
            throw new KeyNotFoundException("الهدف غير موجود");
        }

        if (goal.Status != GoalStatus.Draft)
        {
            throw new InvalidOperationException("لا يمكن الموافقة على الهدف في الحالة الحالية");
        }

        if (request.Approved)
        {
            goal.Status = GoalStatus.Approved;
            goal.ApprovedAt = DateTime.UtcNow;
            goal.ApprovedBy = approvedBy;
        }
        else
        {
            // Rejection - could add rejection reason
            goal.Status = GoalStatus.Cancelled;
        }

        goal.UpdatedAt = DateTime.UtcNow;
        goal.UpdatedBy = approvedBy;

        await _context.SaveChangesAsync();

        return (await GetGoalByIdAsync(id))!;
    }

    public async Task<bool> ValidateGoalWeightsAsync(Guid employeeId, int year)
    {
        var totalWeight = await _context.Goals
            .Where(g => g.EmployeeId == employeeId
                && g.StartDate.Year == year
                && !g.IsDeleted
                && g.Status != GoalStatus.Cancelled)
            .SumAsync(g => g.Weight);

        return totalWeight == 100;
    }
}
