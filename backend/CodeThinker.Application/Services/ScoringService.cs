using CodeThinker.Domain.Entities;

namespace CodeThinker.Application.Services;

public class ScoringService : IScoringService
{
    public Task<int> CalculatePointsAsync(Challenge challenge, Submission submission)
    {
        var basePoints = 10;
        
        // Add points based on difficulty
        var difficultyBonus = challenge.Difficulty.ToLowerInvariant() switch
        {
            "easy" => 0,
            "medium" => 10,
            "hard" => 20,
            _ => 0
        };

        // Add points for estimated hours
        var timeBonus = Math.Min(challenge.EstimatedHours * 5, 15);

        var totalPoints = basePoints + difficultyBonus + timeBonus;
        
        return Task.FromResult(totalPoints);
    }

    public Task UpdateUserStatsAsync(UserStats userStats, int pointsAwarded, bool challengeCompleted)
    {
        userStats.TotalPoints += pointsAwarded;
        userStats.TotalSubmissions++;

        if (challengeCompleted)
        {
            userStats.CompletedChallenges++;
        }

        userStats.LastActiveAt = DateTime.UtcNow;

        return Task.CompletedTask;
    }
}
