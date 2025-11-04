using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PerformanceSystem.Application.DTOs.Common;
using PerformanceSystem.Application.DTOs.Goals;
using PerformanceSystem.Application.Services;
using System.Security.Claims;

namespace PerformanceSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoalsController : ControllerBase
{
    private readonly IGoalService _goalService;
    private readonly ILogger<GoalsController> _logger;

    public GoalsController(IGoalService goalService, ILogger<GoalsController> logger)
    {
        _goalService = goalService;
        _logger = logger;
    }

    /// <summary>
    /// Get goals with filtering and pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<GoalDto>>>> GetGoals([FromQuery] GoalListRequest request)
    {
        try
        {
            var result = await _goalService.GetGoalsAsync(request);
            return Ok(ApiResponse<PaginatedResponse<GoalDto>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting goals");
            return StatusCode(500, ApiResponse<PaginatedResponse<GoalDto>>.ErrorResponse("حدث خطأ أثناء جلب الأهداف"));
        }
    }

    /// <summary>
    /// Get goal by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<GoalDto>>> GetGoal(Guid id)
    {
        try
        {
            var goal = await _goalService.GetGoalByIdAsync(id);
            if (goal == null)
            {
                return NotFound(ApiResponse<GoalDto>.ErrorResponse("الهدف غير موجود"));
            }
            return Ok(ApiResponse<GoalDto>.SuccessResponse(goal));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting goal {GoalId}", id);
            return StatusCode(500, ApiResponse<GoalDto>.ErrorResponse("حدث خطأ أثناء جلب الهدف"));
        }
    }

    /// <summary>
    /// Create new goal
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<GoalDto>>> CreateGoal([FromBody] CreateGoalRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var goal = await _goalService.CreateGoalAsync(request, userId);
            return CreatedAtAction(nameof(GetGoal), new { id = goal.Id },
                ApiResponse<GoalDto>.SuccessResponse(goal, "تم إنشاء الهدف بنجاح"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating goal");
            return StatusCode(500, ApiResponse<GoalDto>.ErrorResponse("حدث خطأ أثناء إنشاء الهدف"));
        }
    }

    /// <summary>
    /// Update existing goal
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<GoalDto>>> UpdateGoal(Guid id, [FromBody] UpdateGoalRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var goal = await _goalService.UpdateGoalAsync(id, request, userId);
            return Ok(ApiResponse<GoalDto>.SuccessResponse(goal, "تم تحديث الهدف بنجاح"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating goal {GoalId}", id);
            return StatusCode(500, ApiResponse<GoalDto>.ErrorResponse("حدث خطأ أثناء تحديث الهدف"));
        }
    }

    /// <summary>
    /// Delete goal (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteGoal(Guid id)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _goalService.DeleteGoalAsync(id, userId);
            if (!result)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("الهدف غير موجود"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "تم حذف الهدف بنجاح"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting goal {GoalId}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("حدث خطأ أثناء حذف الهدف"));
        }
    }

    /// <summary>
    /// Update goal progress
    /// </summary>
    [HttpPut("{id}/progress")]
    public async Task<ActionResult<ApiResponse<GoalDto>>> UpdateGoalProgress(Guid id, [FromBody] UpdateGoalProgressRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var goal = await _goalService.UpdateGoalProgressAsync(id, request, userId);
            return Ok(ApiResponse<GoalDto>.SuccessResponse(goal, "تم تحديث تقدم الهدف بنجاح"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating goal progress {GoalId}", id);
            return StatusCode(500, ApiResponse<GoalDto>.ErrorResponse("حدث خطأ أثناء تحديث تقدم الهدف"));
        }
    }

    /// <summary>
    /// Approve or reject goal (Manager only)
    /// </summary>
    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Manager,HR,Admin")]
    public async Task<ActionResult<ApiResponse<GoalDto>>> ApproveGoal(Guid id, [FromBody] ApproveGoalRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var goal = await _goalService.ApproveGoalAsync(id, request, userId);
            var message = request.Approved ? "تمت الموافقة على الهدف بنجاح" : "تم رفض الهدف";
            return Ok(ApiResponse<GoalDto>.SuccessResponse(goal, message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving goal {GoalId}", id);
            return StatusCode(500, ApiResponse<GoalDto>.ErrorResponse("حدث خطأ أثناء معالجة الهدف"));
        }
    }

    /// <summary>
    /// Validate goal weights for employee (should total 100%)
    /// </summary>
    [HttpGet("validate-weights/{employeeId}/{year}")]
    public async Task<ActionResult<ApiResponse<bool>>> ValidateGoalWeights(Guid employeeId, int year)
    {
        try
        {
            var isValid = await _goalService.ValidateGoalWeightsAsync(employeeId, year);
            var message = isValid ? "مجموع أوزان الأهداف صحيح (100%)" : "مجموع أوزان الأهداف غير صحيح";
            return Ok(ApiResponse<bool>.SuccessResponse(isValid, message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating goal weights for employee {EmployeeId}", employeeId);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("حدث خطأ أثناء التحقق من أوزان الأهداف"));
        }
    }
}
