namespace CodeThinker.Domain.Entities;

public class Achievement : Common.BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Rarity { get; set; } = "Common";
    public int Points { get; set; } = 0;
    
    // Progress tracking
    public int ProgressCurrent { get; set; } = 0;
    public int ProgressRequired { get; set; } = 100;
    
    // User achievement relationships
    public virtual ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}
