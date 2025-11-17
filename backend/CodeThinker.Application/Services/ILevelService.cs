using CodeThinker.Domain.Entities;

namespace CodeThinker.Application.Services;

public interface ILevelService
{
    Task<int> CalculateLevelAsync(int totalPoints);
    Task UpdateLevelAsync(UserStats userStats);
}
