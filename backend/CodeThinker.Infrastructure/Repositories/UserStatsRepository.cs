using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;
using CodeThinker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CodeThinker.Infrastructure.Repositories;

public class UserStatsRepository : Repository<UserStats>, IUserStatsRepository
{
    public UserStatsRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<UserStats?> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserStats
            .FirstOrDefaultAsync(us => us.UserId == userId);
    }
}
