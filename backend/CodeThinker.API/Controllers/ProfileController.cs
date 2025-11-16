using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CodeThinker.Application.DTOs.Profile;
using CodeThinker.Application.Services;

namespace CodeThinker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<ActionResult<ProfileResponse>> Get()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { error = "Invalid token." });
        }

        var profile = await _profileService.GetProfileAsync(userId.Value);
        return Ok(profile);
    }

    [HttpPut]
    public async Task<ActionResult<ProfileResponse>> Update([FromBody] UpdateProfileRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { error = "Invalid token." });
        }

        var profile = await _profileService.UpdateProfileAsync(userId.Value, request);
        return Ok(profile);
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null || !Guid.TryParse(claim.Value, out var userId))
        {
            return null;
        }

        return userId;
    }
}
