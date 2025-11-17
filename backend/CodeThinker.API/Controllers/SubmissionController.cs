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
public class SubmissionController : ControllerBase
{
    private readonly ICodeRunner _codeRunner;
    private readonly IScoringService _scoringService;
    private readonly ILevelService _levelService;
    private readonly IStreakService _streakService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SubmissionController> _logger;

    public SubmissionController(
        ICodeRunner codeRunner,
        IScoringService scoringService,
        ILevelService levelService,
        IStreakService streakService,
        IUnitOfWork unitOfWork,
        ILogger<SubmissionController> logger)
    {
        _codeRunner = codeRunner;
        _scoringService = scoringService;
        _levelService = levelService;
        _streakService = streakService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<SubmissionDto>> SubmitCode([FromBody] SubmitCodeRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized();

            // Get challenge with test cases
            var challenge = await _unitOfWork.Challenges.GetByIdAsync(request.ChallengeId);
            if (challenge == null)
                return NotFound("Challenge not found");

            var testCases = await _unitOfWork.TestCasesCustom.GetByChallengeIdAsync(request.ChallengeId);
            if (!testCases.Any())
                return BadRequest("No test cases found for this challenge");

            // Create submission record
            var submission = new Submission
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                ChallengeId = request.ChallengeId,
                Language = request.Language,
                Code = request.Code,
                Status = SubmissionStatus.Running,
                SubmittedAt = DateTime.UtcNow
            };

            await _unitOfWork.Submissions.AddAsync(submission);

            // Run test cases
            var allPassed = true;
            var totalOutput = new List<string>();
            var totalErrors = new List<string>();
            var totalPoints = 0;

            foreach (var testCase in testCases)
            {
                var result = await _codeRunner.RunCodeAsync(
                    request.Language,
                    request.Code,
                    testCase.Input,
                    TimeSpan.FromSeconds(10));

                if (result.TimedOut)
                {
                    allPassed = false;
                    totalErrors.Add($"Test case {testCase.Order}: Execution timed out");
                    break;
                }

                if (!result.Success || !string.Equals(result.Output?.Trim(), testCase.ExpectedOutput?.Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    allPassed = false;
                    totalErrors.Add($"Test case {testCase.Order}: Expected '{testCase.ExpectedOutput}', got '{result.Output?.Trim()}'");
                    break;
                }

                totalOutput.Add($"Test case {testCase.Order}: Passed");
                totalPoints += testCase.Points;
            }

            // Update submission
            submission.Status = allPassed ? SubmissionStatus.Passed : SubmissionStatus.Failed;
            submission.Output = string.Join("\n", totalOutput);
            submission.Error = string.Join("\n", totalErrors);
            submission.PointsAwarded = totalPoints;
            submission.CompletedAt = DateTime.UtcNow;

            // Update user stats if passed
            if (allPassed)
            {
                var userStats = await _unitOfWork.UserStatsCustom.GetByUserIdAsync(userId.Value);
                if (userStats == null)
                {
                    userStats = new UserStats
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId.Value
                    };
                    await _unitOfWork.UserStats.AddAsync(userStats);
                }

                await _scoringService.UpdateUserStatsAsync(userStats, totalPoints, true);
                await _levelService.UpdateLevelAsync(userStats);
                await _streakService.UpdateStreakAsync(userStats);
            }

            await _unitOfWork.SaveChangesAsync();

            var dto = new SubmissionDto
            {
                Id = submission.Id,
                Status = submission.Status.ToString(),
                Output = submission.Output,
                Error = submission.Error,
                PointsAwarded = submission.PointsAwarded,
                ExecutionTimeMs = submission.ExecutionTimeMs,
                SubmittedAt = submission.SubmittedAt,
                CompletedAt = submission.CompletedAt
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting code");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<SubmissionDto>>> GetSubmissions([FromQuery] Guid? challengeId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized();

            var submissions = await _unitOfWork.SubmissionsCustom.GetUserSubmissionsAsync(userId.Value, challengeId, page, pageSize);
            
            var dtos = submissions.Select(s => new SubmissionDto
            {
                Id = s.Id,
                ChallengeId = s.ChallengeId,
                Language = s.Language,
                Status = s.Status.ToString(),
                Output = s.Output,
                Error = s.Error,
                PointsAwarded = s.PointsAwarded,
                ExecutionTimeMs = s.ExecutionTimeMs,
                SubmittedAt = s.SubmittedAt,
                CompletedAt = s.CompletedAt
            }).ToList();

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting submissions");
            return StatusCode(500, "Internal server error");
        }
    }
}

public class SubmitCodeRequest
{
    public Guid ChallengeId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class SubmissionDto
{
    public Guid Id { get; set; }
    public Guid? ChallengeId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Output { get; set; }
    public string? Error { get; set; }
    public int PointsAwarded { get; set; }
    public int ExecutionTimeMs { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
