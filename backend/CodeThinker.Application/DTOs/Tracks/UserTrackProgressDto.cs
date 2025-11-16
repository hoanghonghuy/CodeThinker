namespace CodeThinker.Application.DTOs.Tracks;

public class UserTrackProgressDto
{
    public Guid TrackId { get; set; }
    public string TrackTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ProgressCurrent { get; set; }
    public int ProgressTotal { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TotalChallenges { get; set; }
    public int CompletedChallenges { get; set; }
}
