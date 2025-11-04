using PerformanceSystem.Application.DTOs.Auth;

namespace PerformanceSystem.Application.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<LoginResponse> SSOCallbackAsync(SSOCallbackRequest request);
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
    Task LogoutAsync(Guid userId);
}
