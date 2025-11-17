namespace CodeThinker.Domain.Entities;

public class User : Common.BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "JavaScript";
    public string UiLanguage { get; set; } = "en";
    public string SelfAssessedLevel { get; set; } = "Beginner";
    public string EditorTheme { get; set; } = "vs-dark";
    public int EditorFontSize { get; set; } = 14;
    public string EditorWordWrap { get; set; } = "on";
    public bool EditorMinimap { get; set; } = true;
    
    // Notification preferences
    public bool EmailNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;
    public bool WeeklyProgress { get; set; } = true;
    
    // User statistics
    public int Points { get; set; } = 0;
    public int Streak { get; set; } = 0;
    public int CompletedChallenges { get; set; } = 0;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<UserChallenge> UserChallenges { get; set; } = new List<UserChallenge>();
    public virtual ICollection<UserAchievement> Achievements { get; set; } = new List<UserAchievement>();
    public virtual ICollection<UserTrack> Tracks { get; set; } = new List<UserTrack>();
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    public virtual UserStats? UserStats { get; set; }
}
