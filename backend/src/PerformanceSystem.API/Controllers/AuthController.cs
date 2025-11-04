using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PerformanceSystem.Application.DTOs.Auth;
using PerformanceSystem.Application.DTOs.Common;
using PerformanceSystem.Application.Services;
using System.Security.Claims;

namespace PerformanceSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Login with username and password
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "تم تسجيل الدخول بنجاح"));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Login failed for user: {Username}", request.Username);
            return Unauthorized(ApiResponse<LoginResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user: {Username}", request.Username);
            return StatusCode(500, ApiResponse<LoginResponse>.ErrorResponse("حدث خطأ أثناء تسجيل الدخول"));
        }
    }

    /// <summary>
    /// SSO callback endpoint (Masar platform integration)
    /// </summary>
    [HttpPost("sso-callback")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> SSOCallback([FromBody] SSOCallbackRequest request)
    {
        try
        {
            var result = await _authService.SSOCallbackAsync(request);
            return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "تم تسجيل الدخول بنجاح عبر منصة مسار"));
        }
        catch (NotImplementedException)
        {
            return StatusCode(501, ApiResponse<LoginResponse>.ErrorResponse("SSO integration not implemented yet"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during SSO callback");
            return StatusCode(500, ApiResponse<LoginResponse>.ErrorResponse("حدث خطأ أثناء تسجيل الدخول"));
        }
    }

    /// <summary>
    /// Change password for current user
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _authService.ChangePasswordAsync(userId, request);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "تم تغيير كلمة المرور بنجاح"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password");
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("حدث خطأ أثناء تغيير كلمة المرور"));
        }
    }

    /// <summary>
    /// Request password reset
    /// </summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<bool>>> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            var result = await _authService.ResetPasswordAsync(request);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"));
        }
        catch (NotImplementedException)
        {
            return StatusCode(501, ApiResponse<bool>.ErrorResponse("Password reset not implemented yet"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("حدث خطأ أثناء إعادة تعيين كلمة المرور"));
        }
    }

    /// <summary>
    /// Logout current user
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> Logout()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _authService.LogoutAsync(userId);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "تم تسجيل الخروج بنجاح"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("حدث خطأ أثناء تسجيل الخروج"));
        }
    }

    /// <summary>
    /// Get current user info
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public ActionResult<ApiResponse<object>> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var username = User.FindFirstValue(ClaimTypes.Name);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        var permissions = User.FindAll("Permission").Select(c => c.Value).ToList();

        var userInfo = new
        {
            Id = userId,
            Username = username,
            Email = email,
            Roles = roles,
            Permissions = permissions
        };

        return Ok(ApiResponse<object>.SuccessResponse(userInfo));
    }
}
