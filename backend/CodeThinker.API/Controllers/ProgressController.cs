using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeThinker.Application.Services;
using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;
using CodeThinker.API.Extensions;

namespace CodeThinker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProgressController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ProgressController> _logger;

    public ProgressController(
        IUnitOfWork unitOfWork,
        ILogger<ProgressController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ProgressSummaryDto>> GetProgressSummary()
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized();

            var userStats = await _unitOfWork.UserStatsCustom.GetByUserIdAsync(userId.Value);
            if (userStats == null)
            {
                // Return empty stats for new users
                userStats = new UserStats
                {
                    Id = Guid.NewGuid(),
                    UserId = userId.Value
                };
                await _unitOfWork.UserStats.AddAsync(userStats);
                await _unitOfWork.SaveChangesAsync();
            }

            var recentSubmissions = await _unitOfWork.SubmissionsCustom.GetUserSubmissionsAsync(userId.Value, null, 1, 5);
            var recentActivity = recentSubmissions.Select(s => new RecentActivityDto
            {
                SubmissionId = s.Id,
                ChallengeId = s.ChallengeId,
                ChallengeTitle = s.Challenge?.Title ?? "Unknown",
                Status = s.Status.ToString(),
                SubmittedAt = s.SubmittedAt,
                PointsAwarded = s.PointsAwarded
            }).ToList();

            var dto = new ProgressSummaryDto
            {
                TotalPoints = userStats.TotalPoints,
                CurrentLevel = userStats.CurrentLevel,
                CurrentStreak = userStats.CurrentStreak,
                CompletedChallenges = userStats.CompletedChallenges,
                TotalSubmissions = userStats.TotalSubmissions,
                LastActiveAt = userStats.LastActiveAt,
                RecentActivity = recentActivity
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting progress summary");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("daily")]
    public async Task<ActionResult<List<DailyProgressDto>>> GetDailyProgress([FromQuery] int days = 7)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized();

            var endDate = DateTime.UtcNow.Date;
            var startDate = endDate.AddDays(-(days - 1));

            var submissions = await _unitOfWork.SubmissionsCustom.GetUserSubmissionsInDateRangeAsync(userId.Value, startDate, endDate);

            var dailyData = new List<DailyProgressDto>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var daySubmissions = submissions.Where(s => s.SubmittedAt.Date == date).ToList();
                var completedCount = daySubmissions.Count(s => s.Status == SubmissionStatus.Passed);
                var pointsEarned = daySubmissions.Where(s => s.Status == SubmissionStatus.Passed).Sum(s => s.PointsAwarded);

                dailyData.Add(new DailyProgressDto
                {
                    Date = date,
                    SubmissionsCount = daySubmissions.Count,
                    CompletedCount = completedCount,
                    PointsEarned = pointsEarned
                });
            }

            return Ok(dailyData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting daily progress");
            return StatusCode(500, "Internal server error");
        }
    }
}

public class ProgressSummaryDto
{
    public int TotalPoints { get; set; }
    public int CurrentLevel { get; set; }
    public int CurrentStreak { get; set; }
    public int CompletedChallenges { get; set; }
    public int TotalSubmissions { get; set; }
    public DateTime LastActiveAt { get; set; }
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
}

public class RecentActivityDto
{
    public Guid SubmissionId { get; set; }
    public Guid ChallengeId { get; set; }
    public string ChallengeTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int PointsAwarded { get; set; }
}

public class DailyProgressDto
{
    public DateTime Date { get; set; }
    public int SubmissionsCount { get; set; }
    public int CompletedCount { get; set; }
    public int PointsEarned { get; set; }
}
