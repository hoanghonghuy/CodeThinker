using CodeThinker.Domain.Entities;

namespace CodeThinker.Application.Services;

public interface IScoringService
{
    Task<int> CalculatePointsAsync(Challenge challenge, Submission submission);
    Task UpdateUserStatsAsync(UserStats userStats, int pointsAwarded, bool challengeCompleted);
}
