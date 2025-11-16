namespace CodeThinker.Domain.Entities;

public class UserAchievement : Common.BaseEntity
{
    public Guid UserId { get; set; }
    public Guid AchievementId { get; set; }
    public bool Unlocked { get; set; } = false;
    public DateTime? UnlockedAt { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Achievement Achievement { get; set; } = null!;
}
