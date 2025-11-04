using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PerformanceSystem.Application.DTOs.Auth;
using PerformanceSystem.Infrastructure.Data;

namespace PerformanceSystem.Application.Services;

public class AuthService : IAuthService
{
    private readonly PerformanceDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(PerformanceDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        // Find user by username
        var user = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r!.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .Include(u => u.Employee)
                .ThenInclude(e => e!.Department)
            .Include(u => u.Employee)
                .ThenInclude(e => e!.Position)
            .Include(u => u.Employee)
                .ThenInclude(e => e!.Manager)
            .FirstOrDefaultAsync(u => u.Username == request.Username && !u.IsDeleted);

        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedAccessException("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

        // Verify password
        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullNameAr = user.FullNameAr,
            FullNameEn = user.FullNameEn,
            Roles = user.UserRoles.Select(ur => ur.Role!.RoleNameEn).ToList(),
            Permissions = user.UserRoles
                .SelectMany(ur => ur.Role!.RolePermissions)
                .Select(rp => rp.Permission!.PermissionCode)
                .Distinct()
                .ToList(),
            Employee = user.Employee != null ? new EmployeeDto
            {
                Id = user.Employee.Id,
                NationalId = user.Employee.NationalId,
                EmployeeNumber = user.Employee.EmployeeNumber,
                FullNameAr = user.Employee.FullNameAr,
                FullNameEn = user.Employee.FullNameEn,
                Email = user.Employee.Email,
                PhoneNumber = user.Employee.PhoneNumber,
                DepartmentId = user.Employee.DepartmentId,
                DepartmentNameAr = user.Employee.Department?.DepartmentNameAr,
                PositionId = user.Employee.PositionId,
                PositionNameAr = user.Employee.Position?.PositionNameAr,
                ManagerId = user.Employee.ManagerId,
                ManagerNameAr = user.Employee.Manager?.FullNameAr,
                HireDate = user.Employee.HireDate,
                Grade = user.Employee.Grade,
                Status = user.Employee.Status.ToString(),
                IsActive = user.Employee.IsActive
            } : null
        };

        var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "60");

        return new LoginResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            User = userDto
        };
    }

    public async Task<LoginResponse> SSOCallbackAsync(SSOCallbackRequest request)
    {
        // TODO: Implement SSO integration with Masar platform
        // This is a placeholder for future implementation
        throw new NotImplementedException("SSO integration will be implemented in Phase 3");
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("المستخدم غير موجود");
        }

        // Verify current password
        if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("كلمة المرور الحالية غير صحيحة");
        }

        // Validate new password
        if (request.NewPassword != request.ConfirmPassword)
        {
            throw new ArgumentException("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين");
        }

        // Hash and save new password
        user.PasswordHash = HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = userId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            // Don't reveal if email exists
            return true;
        }

        // TODO: Implement password reset email functionality
        // Generate reset token, send email, etc.
        throw new NotImplementedException("Password reset email will be implemented in Phase 3");
    }

    public async Task LogoutAsync(Guid userId)
    {
        // In JWT-based auth, logout is typically handled client-side
        // Optionally, we can track logout for audit purposes
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            // Could log this in AuditLog if needed
            await _context.SaveChangesAsync();
        }
    }

    private string GenerateJwtToken(Core.Entities.User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "60");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new("FullNameAr", user.FullNameAr)
        };

        // Add roles
        foreach (var userRole in user.UserRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole.Role!.RoleNameEn));
        }

        // Add permissions
        var permissions = user.UserRoles
            .SelectMany(ur => ur.Role!.RolePermissions)
            .Select(rp => rp.Permission!.PermissionCode)
            .Distinct();

        foreach (var permission in permissions)
        {
            claims.Add(new Claim("Permission", permission));
        }

        // Add employee ID if exists
        if (user.EmployeeId.HasValue)
        {
            claims.Add(new Claim("EmployeeId", user.EmployeeId.Value.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        // Using PBKDF2 with SHA256
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[32];
        rng.GetBytes(salt);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(32);

        var hashBytes = new byte[64];
        Array.Copy(salt, 0, hashBytes, 0, 32);
        Array.Copy(hash, 0, hashBytes, 32, 32);

        return Convert.ToBase64String(hashBytes);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        try
        {
            var hashBytes = Convert.FromBase64String(storedHash);
            var salt = new byte[32];
            Array.Copy(hashBytes, 0, salt, 0, 32);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            for (int i = 0; i < 32; i++)
            {
                if (hashBytes[i + 32] != hash[i])
                    return false;
            }

            return true;
        }
        catch
        {
            return false;
        }
    }
}
