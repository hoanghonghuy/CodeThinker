using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeThinker.Application.DTOs.Challenges;
using CodeThinker.Application.DTOs.Tracks;
using CodeThinker.Application.Services;

namespace CodeThinker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserProgressController : ControllerBase
{
    private readonly IChallengeService _challengeService;

    public UserProgressController(IChallengeService challengeService)
    {
        _challengeService = challengeService;
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<UserChallengeProgressDto>>> GetRecentProgress(
        [FromQuery] int count = 5)
    {
        try
        {
            var userId = GetCurrentUserId();
            var progress = await _challengeService.GetUserRecentProgressAsync(userId, count);
            return Ok(progress);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve recent progress" });
        }
    }

    [HttpGet("daily")]
    public async Task<ActionResult<UserChallengeProgressDto>> GetDailyChallengeProgress()
    {
        try
        {
            var userId = GetCurrentUserId();
            var progress = await _challengeService.GetDailyChallengeProgressAsync(userId);
            if (progress == null)
            {
                return NotFound(new { error = "No daily challenge progress found" });
            }
            return Ok(progress);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve daily challenge progress" });
        }
    }

    [HttpGet("track/{trackId}")]
    public async Task<ActionResult<UserTrackProgressDto>> GetTrackProgress(Guid trackId)
    {
        try
        {
            var userId = GetCurrentUserId();
            // For now, return minimal progress; in real implementation, query UserTracks table
            var progress = new UserTrackProgressDto
            {
                TrackId = trackId,
                TrackTitle = "Track " + trackId,
                Status = "not_started",
                ProgressCurrent = 0,
                ProgressTotal = 100,
                StartedAt = null,
                CompletedAt = null,
                TotalChallenges = 0,
                CompletedChallenges = 0
            };
            return Ok(progress);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve track progress" });
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new InvalidOperationException("Invalid user token");
        }
        return userId;
    }
}
