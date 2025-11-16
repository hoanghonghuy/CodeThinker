namespace CodeThinker.Domain.Entities;

public class UserChallenge : Common.BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ChallengeId { get; set; }
    public string Status { get; set; } = "not_started";
    public int ProgressCurrent { get; set; } = 0;
    public int ProgressTotal { get; set; } = 100;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Solution { get; set; }
    public int Attempts { get; set; } = 0;
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Challenge Challenge { get; set; } = null!;
}
