using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using CodeThinker.Application.Services;
using CodeThinker.Application.DTOs.Auth;
using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;

namespace CodeThinker.Infrastructure.Services;

public class JwtService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtSecurityTokenHandler _tokenHandler;

    public JwtService(IConfiguration configuration, IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
        _tokenHandler = new JwtSecurityTokenHandler();
    }

    public async Task<LoginResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        // Check if user already exists
        var existingUser = await _unitOfWork.Users.FindAsync(u => u.Email == request.Email, cancellationToken);
        if (existingUser.Any())
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        // Create new user
        var user = new User
        {
            Email = request.Email,
            DisplayName = request.DisplayName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PreferredLanguage = request.PreferredLanguage,
            UiLanguage = request.UiLanguage,
            SelfAssessedLevel = request.SelfAssessedLevel,
            Avatar = "👤", // Default avatar
            Country = "Unknown",
            LastActive = DateTime.UtcNow
        };

        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Generate tokens
        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(GetJwtExpirationMinutes()),
            User = MapToUserResponse(user)
        };
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var users = await _unitOfWork.Users.FindAsync(u => u.Email == request.Email, cancellationToken);
        var user = users.FirstOrDefault();

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid email or password.");
        }

        // Update last active
        user.LastActive = DateTime.UtcNow;
        await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Generate tokens
        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(GetJwtExpirationMinutes()),
            User = MapToUserResponse(user)
        };
    }

    public async Task<LoginResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        // For now, just generate new tokens
        // In a real implementation, you would validate the refresh token from a store
        throw new NotImplementedException("Refresh token functionality not implemented yet.");
    }

    public async Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        try
        {
            var tokenValidationParameters = GetTokenValidationParameters();
            _tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<UserResponse> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new InvalidOperationException("User not found.");
        }

        return MapToUserResponse(user);
    }

    private string GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.DisplayName),
            new Claim("preferred_language", user.PreferredLanguage),
            new Claim("ui_language", user.UiLanguage)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(GetJwtExpirationMinutes()),
            signingCredentials: credentials
        );

        return _tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString();
    }

    private TokenValidationParameters GetTokenValidationParameters()
    {
        return new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
            ClockSkew = TimeSpan.Zero
        };
    }

    private int GetJwtExpirationMinutes()
    {
        return int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "60");
    }

    private static UserResponse MapToUserResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Avatar = user.Avatar,
            Country = user.Country,
            PreferredLanguage = user.PreferredLanguage,
            UiLanguage = user.UiLanguage,
            SelfAssessedLevel = user.SelfAssessedLevel,
            EditorTheme = user.EditorTheme,
            EditorFontSize = user.EditorFontSize,
            EditorWordWrap = user.EditorWordWrap,
            EditorMinimap = user.EditorMinimap,
            EmailNotifications = user.EmailNotifications,
            PushNotifications = user.PushNotifications,
            WeeklyProgress = user.WeeklyProgress,
            Points = user.Points,
            Streak = user.Streak,
            CompletedChallenges = user.CompletedChallenges,
            LastActive = user.LastActive
        };
    }
}
