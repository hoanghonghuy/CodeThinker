using Microsoft.EntityFrameworkCore;
using CodeThinker.Application.Services;
using CodeThinker.Application.DTOs.Challenges;
using CodeThinker.Application.DTOs.Common;
using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;

namespace CodeThinker.Infrastructure.Services;

public class ChallengeService : IChallengeService
{
    private readonly IUnitOfWork _unitOfWork;

    public ChallengeService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResult<ChallengeSummaryDto>> GetChallengesAsync(
        string? difficulty = null, 
        string? topic = null, 
        int page = 1, 
        int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = _unitOfWork.Challenges.GetAllQueryable()
            .Include(c => c.Track)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(difficulty))
        {
            query = query.Where(c => c.Difficulty == difficulty);
        }

        if (!string.IsNullOrEmpty(topic))
        {
            query = query.Where(c => c.Topics.Contains(topic));
        }

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
                StartedAt = null, // Will be populated when user-specific data is needed
                CompletedAt = null
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<ChallengeSummaryDto>(items, totalCount, page, pageSize);
    }

    public async Task<ChallengeDetailDto?> GetChallengeByIdAsync(
        Guid id, 
        CancellationToken cancellationToken = default)
    {
        var challenge = await _unitOfWork.Challenges.GetAllQueryable()
            .Include(c => c.Track)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (challenge == null)
            return null;

        return new ChallengeDetailDto
        {
            Id = challenge.Id,
            Title = challenge.Title,
            Description = challenge.Description,
            Difficulty = challenge.Difficulty,
            Topics = challenge.Topics,
            Status = challenge.Status,
            EstimatedHours = challenge.EstimatedHours,
            Tags = challenge.Tags,
            Solution = challenge.Solution,
            Hints = challenge.Hints,
            TrackId = challenge.TrackId?.ToString(),
            TrackTitle = challenge.Track?.Title,
            ProgressCurrent = challenge.ProgressCurrent,
            ProgressTotal = challenge.ProgressTotal,
            IsCompleted = challenge.Status == "completed",
            StartedAt = null,
            CompletedAt = null,
            Attempts = 0
        };
    }

    public async Task<UserChallengeProgressDto> StartChallengeAsync(
        Guid userId, 
        Guid challengeId,
        CancellationToken cancellationToken = default)
    {
        // Check if challenge exists
        var challenge = await _unitOfWork.Challenges.GetByIdAsync(challengeId, cancellationToken);
        if (challenge == null)
            throw new InvalidOperationException("Challenge not found");

        // Check if user already started this challenge
        var existingProgress = await _unitOfWork.UserChallenges.FindAsync(
            uc => uc.UserId == userId && uc.ChallengeId == challengeId, 
            cancellationToken);

        UserChallenge userChallenge;

        if (existingProgress.Any())
        {
            userChallenge = existingProgress.First();
            if (userChallenge.StartedAt == null)
            {
                userChallenge.StartedAt = DateTime.UtcNow;
                userChallenge.Status = "in_progress";
                await _unitOfWork.UserChallenges.UpdateAsync(userChallenge, cancellationToken);
            }
        }
        else
        {
            userChallenge = new UserChallenge
            {
                UserId = userId,
                ChallengeId = challengeId,
                Status = "in_progress",
                ProgressCurrent = 0,
                ProgressTotal = 100,
                StartedAt = DateTime.UtcNow,
                Attempts = 0
            };

            await _unitOfWork.UserChallenges.AddAsync(userChallenge, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UserChallengeProgressDto
        {
            ChallengeId = challengeId,
            ChallengeTitle = challenge.Title,
            Status = userChallenge.Status,
            ProgressCurrent = userChallenge.ProgressCurrent,
            ProgressTotal = userChallenge.ProgressTotal,
            StartedAt = userChallenge.StartedAt,
            CompletedAt = userChallenge.CompletedAt,
            Attempts = userChallenge.Attempts,
            LastSolution = userChallenge.Solution
        };
    }

    public async Task<ChallengeResultDto> SubmitChallengeAsync(
        Guid userId, 
        Guid challengeId, 
        string solution,
        CancellationToken cancellationToken = default)
    {
        // Get challenge and user progress
        var challenge = await _unitOfWork.Challenges.GetByIdAsync(challengeId, cancellationToken);
        if (challenge == null)
            throw new InvalidOperationException("Challenge not found");

        var userProgress = await _unitOfWork.UserChallenges.FindAsync(
            uc => uc.UserId == userId && uc.ChallengeId == challengeId, 
            cancellationToken);

        var userChallenge = userProgress.FirstOrDefault();
        if (userChallenge == null)
            throw new InvalidOperationException("Challenge not started");

        // Simple solution validation (in real app, this would be more sophisticated)
        var isCorrect = ValidateSolution(solution, challenge.Solution ?? "");
        var pointsEarned = 0;

        if (isCorrect)
        {
            userChallenge.Status = "completed";
            userChallenge.CompletedAt = DateTime.UtcNow;
            userChallenge.ProgressCurrent = 100;
            pointsEarned = GetPointsForDifficulty(challenge.Difficulty);

            // Update user points
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user != null)
            {
                user.Points += pointsEarned;
                user.CompletedChallenges += 1;
                await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            }
        }

        userChallenge.Solution = solution;
        userChallenge.Attempts += 1;
        await _unitOfWork.UserChallenges.UpdateAsync(userChallenge, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ChallengeResultDto
        {
            IsCorrect = isCorrect,
            Message = isCorrect ? "Correct! Well done!" : "Not quite right. Try again!",
            PointsEarned = pointsEarned,
            Progress = new UserChallengeProgressDto
            {
                ChallengeId = challengeId,
                ChallengeTitle = challenge.Title,
                Status = userChallenge.Status,
                ProgressCurrent = userChallenge.ProgressCurrent,
                ProgressTotal = userChallenge.ProgressTotal,
                StartedAt = userChallenge.StartedAt,
                CompletedAt = userChallenge.CompletedAt,
                Attempts = userChallenge.Attempts,
                LastSolution = userChallenge.Solution
            },
            AchievementsUnlocked = new List<string>() // TODO: Check for achievements
        };
    }

    public async Task<PagedResult<ChallengeSummaryDto>> GetChallengesByTrackAsync(
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

    private bool ValidateSolution(string userSolution, string correctSolution)
    {
        // Simple validation - in real app, this would be more sophisticated
        return !string.IsNullOrWhiteSpace(userSolution) && 
               userSolution.Trim().Equals(correctSolution.Trim(), StringComparison.OrdinalIgnoreCase);
    }

    public async Task<IEnumerable<UserChallengeProgressDto>> GetUserRecentProgressAsync(
        Guid userId,
        int count = 5,
        CancellationToken cancellationToken = default)
    {
        var recentProgress = await _unitOfWork.UserChallenges.GetAllQueryable()
            .Include(uc => uc.Challenge)
            .Where(uc => uc.UserId == userId && uc.StartedAt.HasValue)
            .OrderByDescending(uc => uc.StartedAt)
            .Take(count)
            .Select(uc => new UserChallengeProgressDto
            {
                ChallengeId = uc.ChallengeId,
                ChallengeTitle = uc.Challenge.Title,
                Status = uc.Status,
                ProgressCurrent = uc.ProgressCurrent,
                ProgressTotal = uc.ProgressTotal,
                StartedAt = uc.StartedAt,
                CompletedAt = uc.CompletedAt,
                Attempts = uc.Attempts,
                LastSolution = uc.Solution
            })
            .ToListAsync(cancellationToken);

        return recentProgress;
    }

    public async Task<UserChallengeProgressDto?> GetDailyChallengeProgressAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        // For now, get the most recently started challenge as "daily"
        // In a real implementation, you'd have a proper daily challenge system
        var dailyProgress = await _unitOfWork.UserChallenges.GetAllQueryable()
            .Include(uc => uc.Challenge)
            .Where(uc => uc.UserId == userId && uc.StartedAt.HasValue)
            .OrderByDescending(uc => uc.StartedAt)
            .Select(uc => new UserChallengeProgressDto
            {
                ChallengeId = uc.ChallengeId,
                ChallengeTitle = uc.Challenge.Title,
                Status = uc.Status,
                ProgressCurrent = uc.ProgressCurrent,
                ProgressTotal = uc.ProgressTotal,
                StartedAt = uc.StartedAt,
                CompletedAt = uc.CompletedAt,
                Attempts = uc.Attempts,
                LastSolution = uc.Solution
            })
            .FirstOrDefaultAsync(cancellationToken);

        return dailyProgress;
    }

    private int GetPointsForDifficulty(string difficulty)
    {
        return difficulty.ToLower() switch
        {
            "easy" => 10,
            "medium" => 25,
            "hard" => 50,
            _ => 10
        };
    }
}
