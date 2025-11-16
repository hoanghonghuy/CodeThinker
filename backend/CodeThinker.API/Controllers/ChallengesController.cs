using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeThinker.Application.DTOs.Challenges;
using CodeThinker.Application.Services;
using CodeThinker.Domain.Entities;

namespace CodeThinker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChallengesController : ControllerBase
{
    private readonly IChallengeService _challengeService;

    public ChallengesController(IChallengeService challengeService)
    {
        _challengeService = challengeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChallengeSummaryDto>>> GetChallenges(
        [FromQuery] string? difficulty = null,
        [FromQuery] string? topic = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var challenges = await _challengeService.GetChallengesAsync(difficulty, topic, page, pageSize);
            return Ok(challenges);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve challenges" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ChallengeDetailDto>> GetChallenge(Guid id)
    {
        try
        {
            var challenge = await _challengeService.GetChallengeByIdAsync(id);
            if (challenge == null)
            {
                return NotFound(new { error = "Challenge not found" });
            }
            return Ok(challenge);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve challenge" });
        }
    }

    [HttpPost("{id}/start")]
    public async Task<ActionResult<UserChallengeProgressDto>> StartChallenge(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var progress = await _challengeService.StartChallengeAsync(userId, id);
            return Ok(progress);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to start challenge" });
        }
    }

    [HttpPost("{id}/submit")]
    public async Task<ActionResult<ChallengeResultDto>> SubmitChallenge(Guid id, [FromBody] SubmitChallengeRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _challengeService.SubmitChallengeAsync(userId, id, request.Solution);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to submit challenge" });
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
