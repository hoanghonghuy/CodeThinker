using CodeThinker.Domain.Entities;

namespace CodeThinker.Application.Services;

public class LevelService : ILevelService
{
    public Task<int> CalculateLevelAsync(int totalPoints)
    {
        // Simple level calculation: 100 points per level
        var level = Math.Max(1, totalPoints / 100 + 1);
        return Task.FromResult(level);
    }

    public Task UpdateLevelAsync(UserStats userStats)
    {
        var newLevel = CalculateLevelAsync(userStats.TotalPoints).Result;
        userStats.CurrentLevel = newLevel;
        return Task.CompletedTask;
    }
}
