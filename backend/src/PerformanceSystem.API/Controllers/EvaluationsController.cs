using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PerformanceSystem.Application.DTOs.Common;
using PerformanceSystem.Application.DTOs.Evaluations;
using PerformanceSystem.Application.Services;
using System.Security.Claims;

namespace PerformanceSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EvaluationsController : ControllerBase
{
    private readonly IEvaluationService _evaluationService;
    private readonly ILogger<EvaluationsController> _logger;

    public EvaluationsController(IEvaluationService evaluationService, ILogger<EvaluationsController> logger)
    {
        _evaluationService = evaluationService;
        _logger = logger;
    }

    /// <summary>
    /// Get evaluations with filtering and pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<EvaluationDto>>>> GetEvaluations([FromQuery] EvaluationListRequest request)
    {
        try
        {
            var result = await _evaluationService.GetEvaluationsAsync(request);
            return Ok(ApiResponse<PaginatedResponse<EvaluationDto>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting evaluations");
            return StatusCode(500, ApiResponse<PaginatedResponse<EvaluationDto>>.ErrorResponse("حدث خطأ أثناء جلب التقييمات"));
        }
    }

    /// <summary>
    /// Get evaluation by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EvaluationDto>>> GetEvaluation(Guid id)
    {
        try
        {
            var evaluation = await _evaluationService.GetEvaluationByIdAsync(id);
            if (evaluation == null)
            {
                return NotFound(ApiResponse<EvaluationDto>.ErrorResponse("التقييم غير موجود"));
            }
            return Ok(ApiResponse<EvaluationDto>.SuccessResponse(evaluation));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting evaluation {EvaluationId}", id);
            return StatusCode(500, ApiResponse<EvaluationDto>.ErrorResponse("حدث خطأ أثناء جلب التقييم"));
        }
    }

    /// <summary>
    /// Create new evaluation
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Manager,HR,Admin")]
    public async Task<ActionResult<ApiResponse<EvaluationDto>>> CreateEvaluation([FromBody] CreateEvaluationRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var evaluation = await _evaluationService.CreateEvaluationAsync(request, userId);
            return CreatedAtAction(nameof(GetEvaluation), new { id = evaluation.Id },
                ApiResponse<EvaluationDto>.SuccessResponse(evaluation, "تم إنشاء التقييم بنجاح"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating evaluation");
            return StatusCode(500, ApiResponse<EvaluationDto>.ErrorResponse("حدث خطأ أثناء إنشاء التقييم"));
        }
    }

    /// <summary>
    /// Update evaluation scores
    /// </summary>
    [HttpPut("{id}/scores")]
    [Authorize(Roles = "Manager,HR,Admin")]
    public async Task<ActionResult<ApiResponse<EvaluationDto>>> UpdateEvaluationScores(Guid id, [FromBody] UpdateEvaluationScoresRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var evaluation = await _evaluationService.UpdateEvaluationScoresAsync(id, request, userId);
            return Ok(ApiResponse<EvaluationDto>.SuccessResponse(evaluation, "تم تحديث درجات التقييم بنجاح"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating evaluation scores {EvaluationId}", id);
            return StatusCode(500, ApiResponse<EvaluationDto>.ErrorResponse("حدث خطأ أثناء تحديث درجات التقييم"));
        }
    }

    /// <summary>
    /// Add evaluation item
    /// </summary>
    [HttpPost("{id}/items")]
    [Authorize(Roles = "Manager,HR,Admin")]
    public async Task<ActionResult<ApiResponse<EvaluationDto>>> AddEvaluationItem(Guid id, [FromBody] AddEvaluationItemRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var evaluation = await _evaluationService.AddEvaluationItemAsync(id, request, userId);
            return Ok(ApiResponse<EvaluationDto>.SuccessResponse(evaluation, "تم إضافة بند التقييم بنجاح"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<EvaluationDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding evaluation item {EvaluationId}", id);
            return StatusCode(500, ApiResponse<EvaluationDto>.ErrorResponse("حدث خطأ أثناء إضافة بند التقييم"));
        }
    }

    /// <summary>
    /// Delete evaluation item
    /// </summary>
    [HttpDelete("{id}/items/{itemId}")]
    [Authorize(Roles = "Manager,HR,Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteEvaluationItem(Guid id, Guid itemId)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _evaluationService.DeleteEvaluationItemAsync(id, itemId, userId);
            if (!result)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("بند التقييم غير موجود"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "تم حذف بند التقييم بنجاح"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting evaluation item {ItemId}", itemId);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("حدث خطأ أثناء حذف بند التقييم"));
        }
    }

    /// <summary>
    /// Finalize evaluation (calculate final score, create PIP if needed)
    /// </summary>
    [HttpPost("{id}/finalize")]
    [Authorize(Roles = "Manager,HR,Admin")]
    public async Task<ActionResult<ApiResponse<FinalizeEvaluationResponse>>> FinalizeEvaluation(Guid id, [FromBody] FinalizeEvaluationRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _evaluationService.FinalizeEvaluationAsync(id, request, userId);
            var message = result.PipCreated
                ? "تم اعتماد التقييم بنجاح. تم إنشاء خطة تحسين الأداء تلقائياً"
                : "تم اعتماد التقييم بنجاح";
            return Ok(ApiResponse<FinalizeEvaluationResponse>.SuccessResponse(result, message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<FinalizeEvaluationResponse>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<FinalizeEvaluationResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finalizing evaluation {EvaluationId}", id);
            return StatusCode(500, ApiResponse<FinalizeEvaluationResponse>.ErrorResponse("حدث خطأ أثناء اعتماد التقييم"));
        }
    }

    /// <summary>
    /// Approve evaluation (HR/Admin only)
    /// </summary>
    [HttpPost("{id}/approve")]
    [Authorize(Roles = "HR,Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> ApproveEvaluation(Guid id)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _evaluationService.ApproveEvaluationAsync(id, userId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "تمت الموافقة على التقييم بنجاح"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving evaluation {EvaluationId}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("حدث خطأ أثناء الموافقة على التقييم"));
        }
    }
}
