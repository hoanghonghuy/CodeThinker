using Microsoft.EntityFrameworkCore;
using CodeThinker.Application.Services;
using CodeThinker.Application.DTOs.Tracks;
using CodeThinker.Application.DTOs.Common;
using CodeThinker.Application.DTOs.Challenges;
using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;

namespace CodeThinker.Infrastructure.Services;

public class TrackService : ITrackService
{
    private readonly IUnitOfWork _unitOfWork;

    public TrackService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResult<TrackSummaryDto>> GetTracksAsync(
        string? difficulty = null, 
        int page = 1, 
        int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = _unitOfWork.Tracks.GetAllQueryable()
            .Include(t => t.Challenges)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(difficulty))
        {
            query = query.Where(t => t.Difficulty == difficulty);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TrackSummaryDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description.Length > 150 ? t.Description.Substring(0, 147) + "..." : t.Description,
                Difficulty = t.Difficulty,
                Topics = t.Topics,
                Status = t.Status,
                EstimatedHours = t.EstimatedHours,
                Tags = t.Tags,
                ProgressCurrent = t.ProgressCurrent,
                ProgressTotal = t.ProgressTotal,
                IsCompleted = t.Status == "completed",
                ChallengeCount = t.Challenges.Count,
                CompletedChallenges = t.Challenges.Count(c => c.Status == "completed"),
                StartedAt = null,
                CompletedAt = null
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<TrackSummaryDto>(items, totalCount, page, pageSize);
    }

    public async Task<TrackDetailDto?> GetTrackByIdAsync(
        Guid id, 
        CancellationToken cancellationToken = default)
    {
        var track = await _unitOfWork.Tracks.GetAllQueryable()
            .Include(t => t.Challenges)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (track == null)
            return null;

        return new TrackDetailDto
        {
            Id = track.Id,
            Title = track.Title,
            Description = track.Description,
            Difficulty = track.Difficulty,
            Topics = track.Topics,
            Status = track.Status,
            EstimatedHours = track.EstimatedHours,
            Tags = track.Tags,
            ProgressCurrent = track.ProgressCurrent,
            ProgressTotal = track.ProgressTotal,
            IsCompleted = track.Status == "completed",
            ChallengeCount = track.Challenges.Count,
            CompletedChallenges = track.Challenges.Count(c => c.Status == "completed"),
            StartedAt = null,
            CompletedAt = null
        };
    }

    public async Task<PagedResult<ChallengeSummaryDto>> GetTrackChallengesAsync(
        Guid trackId,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = _unitOfWork.Challenges.GetAllQueryable()
            .Include(c => c.Track)
            .Where(c => c.TrackId == trackId)
            .AsQueryable();

        var totalCount = await query.CountAsync(cancellationToken);
        
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new ChallengeSummaryDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description.Length > 150 ? c.Description.Substring(0, 147) + "..." : c.Description,
                Difficulty = c.Difficulty,
                Topics = c.Topics,
                Status = c.Status,
                EstimatedHours = c.EstimatedHours,
                Tags = c.Tags,
                TrackId = c.TrackId.HasValue ? c.TrackId.Value.ToString() : null,
                TrackTitle = c.Track != null ? c.Track.Title : null,
                ProgressCurrent = c.ProgressCurrent,
                ProgressTotal = c.ProgressTotal,
                IsCompleted = c.Status == "completed",
                StartedAt = null,
                CompletedAt = null
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<ChallengeSummaryDto>(items, totalCount, page, pageSize);
    }

    public async Task<UserTrackProgressDto> StartTrackAsync(
        Guid userId, 
        Guid trackId,
        CancellationToken cancellationToken = default)
    {
        // Check if track exists
        var track = await _unitOfWork.Tracks.GetByIdAsync(trackId, cancellationToken);
        if (track == null)
            throw new InvalidOperationException("Track not found");

        // Check if user already started this track
        var existingProgress = await _unitOfWork.UserTracks.FindAsync(
            ut => ut.UserId == userId && ut.TrackId == trackId, 
            cancellationToken);

        UserTrack userTrack;

        if (existingProgress.Any())
        {
            userTrack = existingProgress.First();
            if (userTrack.StartedAt == null)
            {
                userTrack.StartedAt = DateTime.UtcNow;
                userTrack.Status = "in_progress";
                await _unitOfWork.UserTracks.UpdateAsync(userTrack, cancellationToken);
            }
        }
        else
        {
            userTrack = new UserTrack
            {
                UserId = userId,
                TrackId = trackId,
                Status = "in_progress",
                ProgressCurrent = 0,
                ProgressTotal = 100,
                StartedAt = DateTime.UtcNow
            };

            await _unitOfWork.UserTracks.AddAsync(userTrack, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Get track challenge count
        var challenges = await _unitOfWork.Challenges.GetAllQueryable()
            .Where(c => c.TrackId == trackId)
            .ToListAsync(cancellationToken);

        return new UserTrackProgressDto
        {
            TrackId = trackId,
            TrackTitle = track.Title,
            Status = userTrack.Status,
            ProgressCurrent = userTrack.ProgressCurrent,
            ProgressTotal = userTrack.ProgressTotal,
            StartedAt = userTrack.StartedAt,
            CompletedAt = userTrack.CompletedAt,
            TotalChallenges = challenges.Count,
            CompletedChallenges = challenges.Count(c => c.Status == "completed")
        };
    }
}
