using CodeThinker.Domain.Entities;

namespace CodeThinker.Domain.Repositories;

public interface IUserStatsRepository : IRepository<UserStats>
{
    Task<UserStats?> GetByUserIdAsync(Guid userId);
}
