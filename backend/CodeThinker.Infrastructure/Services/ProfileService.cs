using CodeThinker.Application.DTOs.Profile;
using CodeThinker.Application.Services;
using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;

namespace CodeThinker.Infrastructure.Services;

public class ProfileService : IProfileService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProfileService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProfileResponse> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken)
                   ?? throw new InvalidOperationException("User not found.");

        return MapToResponse(user);
    }

    public async Task<ProfileResponse> UpdateProfileAsync(
        Guid userId,
        UpdateProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken)
                   ?? throw new InvalidOperationException("User not found.");

        user.Email = request.Email;
        user.DisplayName = request.DisplayName;
        user.PreferredLanguage = request.PreferredLanguage;
        user.UiLanguage = request.UiLanguage;
        user.SelfAssessedLevel = request.SelfAssessedLevel;
        user.EditorTheme = request.EditorTheme;
        user.EditorFontSize = request.EditorFontSize;
        user.EditorWordWrap = request.EditorWordWrap;
        user.EditorMinimap = request.EditorMinimap;
        user.EmailNotifications = request.EmailNotifications;
        user.PushNotifications = request.PushNotifications;
        user.WeeklyProgress = request.WeeklyProgress;
        user.LastActive = DateTime.UtcNow;

        await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(user);
    }

    private static ProfileResponse MapToResponse(User user)
    {
        return new ProfileResponse
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
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
            LastActive = user.LastActive,
        };
    }
}
