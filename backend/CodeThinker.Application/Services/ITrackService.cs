using CodeThinker.Application.DTOs.Tracks;
using CodeThinker.Application.DTOs.Common;
using CodeThinker.Application.DTOs.Challenges;

namespace CodeThinker.Application.Services;

public interface ITrackService
{
    Task<PagedResult<TrackSummaryDto>> GetTracksAsync(
        string? difficulty = null, 
        int page = 1, 
        int pageSize = 20,
        CancellationToken cancellationToken = default);

    Task<TrackDetailDto?> GetTrackByIdAsync(
        Guid id, 
        CancellationToken cancellationToken = default);

    Task<PagedResult<ChallengeSummaryDto>> GetTrackChallengesAsync(
        Guid trackId,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default);

    Task<UserTrackProgressDto> StartTrackAsync(
        Guid userId, 
        Guid trackId,
        CancellationToken cancellationToken = default);
}
