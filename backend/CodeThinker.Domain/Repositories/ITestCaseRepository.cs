using CodeThinker.Domain.Entities;

namespace CodeThinker.Domain.Repositories;

public interface ITestCaseRepository : IRepository<TestCase>
{
    Task<IEnumerable<TestCase>> GetByChallengeIdAsync(Guid challengeId);
}
