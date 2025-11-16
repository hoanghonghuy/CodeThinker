namespace CodeThinker.Application.DTOs.Tracks;

public class TrackSummaryDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public List<string> Topics { get; set; } = new List<string>();
    public string Status { get; set; } = string.Empty;
    public int EstimatedHours { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public int ProgressCurrent { get; set; }
    public int ProgressTotal { get; set; }
    public bool IsCompleted { get; set; }
    public int ChallengeCount { get; set; }
    public int CompletedChallenges { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
