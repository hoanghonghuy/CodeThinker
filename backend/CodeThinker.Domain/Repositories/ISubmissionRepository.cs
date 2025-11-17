using CodeThinker.Domain.Entities;

namespace CodeThinker.Domain.Repositories;

public interface ISubmissionRepository : IRepository<Submission>
{
    Task<IEnumerable<Submission>> GetUserSubmissionsAsync(Guid userId, Guid? challengeId, int page, int pageSize);
    Task<IEnumerable<Submission>> GetUserSubmissionsInDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
}
