using CodeThinker.Domain.Entities;

namespace CodeThinker.Application.Services;

public class StreakService : IStreakService
{
    public Task<int> UpdateStreakAsync(UserStats userStats)
    {
        var today = DateTime.UtcNow.Date;
        var lastActiveDate = userStats.LastStreakDate?.Date;

        if (lastActiveDate == null)
        {
            // First activity
            userStats.CurrentStreak = 1;
            userStats.LastStreakDate = today;
        }
        else if (lastActiveDate.Value == today.AddDays(-1))
        {
            // Consecutive day
            userStats.CurrentStreak++;
            userStats.LastStreakDate = today;
        }
        else if (lastActiveDate.Value < today.AddDays(-1))
        {
            // Streak broken
            userStats.CurrentStreak = 1;
            userStats.LastStreakDate = today;
        }
        // If lastActiveDate == today, streak remains unchanged

        return Task.FromResult(userStats.CurrentStreak);
    }

    public Task<bool> IsStreakMaintainedAsync(UserStats userStats)
    {
        var today = DateTime.UtcNow.Date;
        var lastActiveDate = userStats.LastStreakDate?.Date;

        var isMaintained = lastActiveDate.HasValue && 
                          (lastActiveDate.Value == today || lastActiveDate.Value == today.AddDays(-1));

        return Task.FromResult(isMaintained);
    }
}
