namespace CodeThinker.Application.DTOs.Challenges;

public class UserChallengeProgressDto
{
    public Guid ChallengeId { get; set; }
    public string ChallengeTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ProgressCurrent { get; set; }
    public int ProgressTotal { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int Attempts { get; set; }
    public string? LastSolution { get; set; }
}
