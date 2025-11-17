using CodeThinker.Domain.Entities;

namespace CodeThinker.Application.Services;

public interface IStreakService
{
    Task<int> UpdateStreakAsync(UserStats userStats);
    Task<bool> IsStreakMaintainedAsync(UserStats userStats);
}
