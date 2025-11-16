using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeThinker.Application.DTOs.Tracks;
using CodeThinker.Application.DTOs.Challenges;
using CodeThinker.Application.Services;

namespace CodeThinker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TracksController : ControllerBase
{
    private readonly ITrackService _trackService;

    public TracksController(ITrackService trackService)
    {
        _trackService = trackService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TrackSummaryDto>>> GetTracks(
        [FromQuery] string? difficulty = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var tracks = await _trackService.GetTracksAsync(difficulty, page, pageSize);
            return Ok(tracks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve tracks" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TrackDetailDto>> GetTrack(Guid id)
    {
        try
        {
            var track = await _trackService.GetTrackByIdAsync(id);
            if (track == null)
            {
                return NotFound(new { error = "Track not found" });
            }
            return Ok(track);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve track" });
        }
    }

    [HttpGet("{id}/challenges")]
    public async Task<ActionResult<IEnumerable<ChallengeSummaryDto>>> GetTrackChallenges(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var challenges = await _trackService.GetTrackChallengesAsync(id, page, pageSize);
            return Ok(challenges);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve track challenges" });
        }
    }

    [HttpPost("{id}/start")]
    public async Task<ActionResult<UserTrackProgressDto>> StartTrack(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var progress = await _trackService.StartTrackAsync(userId, id);
            return Ok(progress);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to start track" });
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
