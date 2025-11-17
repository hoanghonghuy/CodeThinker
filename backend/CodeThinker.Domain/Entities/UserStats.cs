namespace CodeThinker.Domain.Entities;

public class UserStats : Common.BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int TotalPoints { get; set; } = 0;
    public int CurrentLevel { get; set; } = 1;
    public int CurrentStreak { get; set; } = 0;
    public DateTime? LastStreakDate { get; set; }
    public int CompletedChallenges { get; set; } = 0;
    public int TotalSubmissions { get; set; } = 0;
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;
}
