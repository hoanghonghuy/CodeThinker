using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;
using CodeThinker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CodeThinker.Infrastructure.Repositories;

public class SubmissionRepository : Repository<Submission>, ISubmissionRepository
{
    public SubmissionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Submission>> GetUserSubmissionsAsync(Guid userId, Guid? challengeId, int page, int pageSize)
    {
        var query = _context.Submissions
            .Include(s => s.Challenge)
            .Where(s => s.UserId == userId);

        if (challengeId.HasValue)
        {
            query = query.Where(s => s.ChallengeId == challengeId.Value);
        }

        return await query
            .OrderByDescending(s => s.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Submission>> GetUserSubmissionsInDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        return await _context.Submissions
            .Where(s => s.UserId == userId && 
                       s.SubmittedAt.Date >= startDate && 
                       s.SubmittedAt.Date <= endDate)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();
    }
}
