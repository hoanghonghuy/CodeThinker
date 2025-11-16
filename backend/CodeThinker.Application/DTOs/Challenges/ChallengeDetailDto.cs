namespace CodeThinker.Application.DTOs.Challenges;

public class ChallengeDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public List<string> Topics { get; set; } = new List<string>();
    public string Status { get; set; } = string.Empty;
    public int EstimatedHours { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public string? Solution { get; set; }
    public string? Hints { get; set; }
    public string? TrackId { get; set; }
    public string? TrackTitle { get; set; }
    public int ProgressCurrent { get; set; }
    public int ProgressTotal { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int Attempts { get; set; }
}
