using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;
using CodeThinker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CodeThinker.Infrastructure.Repositories;

public class TestCaseRepository : Repository<TestCase>, ITestCaseRepository
{
    public TestCaseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TestCase>> GetByChallengeIdAsync(Guid challengeId)
    {
        return await _context.TestCases
            .Where(tc => tc.ChallengeId == challengeId)
            .OrderBy(tc => tc.Order)
            .ToListAsync();
    }
}
