using CodeThinker.Application.DTOs.Challenges;
using CodeThinker.Application.DTOs.Common;

namespace CodeThinker.Application.Services;

public interface IChallengeService
{
    Task<PagedResult<ChallengeSummaryDto>> GetChallengesAsync(
        string? difficulty = null, 
        string? topic = null, 
        int page = 1, 
        int pageSize = 20,
        CancellationToken cancellationToken = default);

    Task<ChallengeDetailDto?> GetChallengeByIdAsync(
        Guid id, 
        CancellationToken cancellationToken = default);

    Task<UserChallengeProgressDto> StartChallengeAsync(
        Guid userId, 
        Guid challengeId,
        CancellationToken cancellationToken = default);

    Task<ChallengeResultDto> SubmitChallengeAsync(
        Guid userId, 
        Guid challengeId, 
        string solution,
        CancellationToken cancellationToken = default);

    Task<PagedResult<ChallengeSummaryDto>> GetChallengesByTrackAsync(
        Guid trackId,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<UserChallengeProgressDto>> GetUserRecentProgressAsync(
        Guid userId,
        int count = 5,
        CancellationToken cancellationToken = default);

    Task<UserChallengeProgressDto?> GetDailyChallengeProgressAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}
